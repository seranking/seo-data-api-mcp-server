import 'dotenv/config';

import { randomUUID } from 'node:crypto';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { hostHeaderValidation } from '@modelcontextprotocol/sdk/server/middleware/hostHeaderValidation.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';

import { DATA_API_TOKEN, PROJECT_API_TOKEN } from './constants.js';
import {
  type RequestTokens,
  runWithRequestTokens,
  setSessionTokenProvider,
} from './request-token-context.js';
import { SeoApiMcpServer } from './seo-api-mcp-server.js';

interface SessionEntry {
  server: McpServer;
  transport: StreamableHTTPServerTransport;
  lastTokens: RequestTokens;
}

const sessions = new Map<string, SessionEntry>();

const SESSION_HEADER = 'mcp-session-id';

setSessionTokenProvider((sessionId) => sessions.get(sessionId)?.lastTokens);

function extractTokenFromHeader(authorization?: string) {
  const m = authorization?.match(/^Bearer\s+(.+)$/i);
  return m?.[1]?.trim();
}

/** Read token from header (Node lowercases header names). Supports both X-Seranking-* and X-Data-Api-Token / X-Project-Api-Token. */
function headerToken(req: express.Request, ...names: string[]): string | undefined {
  for (const name of names) {
    const v = req.headers[name];
    if (typeof v === 'string') {
      const t = v.trim();
      if (t) return t;
    }
    if (Array.isArray(v) && v[0]) {
      const t = String(v[0]).trim();
      if (t) return t;
    }
  }
  return undefined;
}

/** Build request tokens: headers > Bearer > server env. If only one token is set, use it for both APIs (one token is enough for many setups). */
function getRequestTokensFromReq(req: express.Request): RequestTokens {
  const bearer = extractTokenFromHeader(req.headers.authorization);
  const dataFromHeader = headerToken(req, 'x-seranking-data-api-token', 'x-data-api-token');
  const projectFromHeader = headerToken(
    req,
    'x-seranking-project-api-token',
    'x-project-api-token',
  );
  const dataApiToken = dataFromHeader ?? bearer ?? (DATA_API_TOKEN || undefined);
  const projectApiToken = projectFromHeader ?? bearer ?? (PROJECT_API_TOKEN || undefined);
  return { dataApiToken, projectApiToken };
}

function isAuthenticationRequired(req: express.Request) {
  // GET /mcp has no body (event-stream); only POST has JSON-RPC body
  if (!req.body || typeof req.body !== 'object') return false;
  return req.body.method !== 'tools/list';
}

const app = express();

app.use(express.json());

// DNS rebinding protection; allow remote hosts when using ALLOWED_HOSTS (e.g. for LAN access)
const HOST = process.env.HOST || '0.0.0.0';
const PORT = parseInt(process.env.PORT || '5000', 10);
const allowedHosts = ['localhost', '127.0.0.1', '[::1]', `localhost:${PORT}`, `127.0.0.1:${PORT}`];
if (HOST !== '0.0.0.0') {
  allowedHosts.push(HOST, `${HOST}:${PORT}`);
}
const allowedHostsEnv = process.env.ALLOWED_HOSTS?.trim();
if (allowedHostsEnv === '*') {
  // Allow any Host (e.g. for LAN access); DNS rebinding risk only if server is on public IP
  app.use((_req, _res, next) => {
    next();
  });
} else {
  const extraHosts =
    allowedHostsEnv
      ?.split(',')
      .map((h) => h.trim())
      .filter(Boolean) ?? [];
  for (const h of extraHosts) {
    allowedHosts.push(h, `${h}:${PORT}`);
  }
  app.use(hostHeaderValidation(allowedHosts));
}

// logger
app.use((req, _res, next) => {
  console.warn(
    `[Request] ${new Date().toISOString()} ${req.method} ${req.originalUrl}\nheaders:${JSON.stringify(req.headers)}\nbody: ${JSON.stringify(req.body)}\n\n`,
  );
  next();
});

function getSessionId(req: express.Request): string | undefined {
  const id = req.headers[SESSION_HEADER];
  return typeof id === 'string' ? id.trim() : Array.isArray(id) ? id[0]?.trim() : undefined;
}

async function closeSession(entry: SessionEntry): Promise<void> {
  try {
    await entry.transport.close();
  } catch {}
  try {
    await entry.server.close();
  } catch {}
}

// catch all requests for MCP requests
app.all('/mcp', async (req, res) => {
  const requestTokens = getRequestTokensFromReq(req);
  const hasToken = requestTokens.dataApiToken || requestTokens.projectApiToken;

  if (isAuthenticationRequired(req) && !hasToken) {
    console.warn('Empty token! MCP request received:', req.method, req.url);
    return res.status(401).json({
      error:
        'Missing API token. Set SERANKING_DATA_API_TOKEN and/or SERANKING_PROJECT_API_TOKEN (env or headers X-Seranking-Data-Api-Token / X-Seranking-Project-Api-Token).',
    });
  }

  const sessionId = getSessionId(req);

  // DELETE: terminate session (per MCP spec)
  if (req.method === 'DELETE' && sessionId) {
    const entry = sessions.get(sessionId);
    sessions.delete(sessionId);
    if (entry) void closeSession(entry).catch(console.error);
    return res.status(202).end();
  }

  // Existing session: use same server/transport for GET and subsequent POSTs
  if (sessionId) {
    const entry = sessions.get(sessionId);
    if (!entry) {
      return res.status(404).json({ error: 'Session not found or expired' });
    }
    const tokensWithSession: RequestTokens = { ...requestTokens, sessionId };
    entry.lastTokens = tokensWithSession;
    return runWithRequestTokens(tokensWithSession, async () => {
      try {
        await entry.transport.handleRequest(req, res, req.body);
      } catch (err) {
        console.error('MCP Server Error (session):', err, req.method, req.url);
        if (!res.headersSent) res.status(500).json({ error: 'Internal server error' });
      }
    });
  }

  // New session: initialize (first POST without session id)
  await runWithRequestTokens(requestTokens, async () => {
    const server = new McpServer({ name: 'ser-data-api-mcp-server', version: '1.0.0' });
    new SeoApiMcpServer(server).init();

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      retryInterval: 2000, // hint for client SSE reconnect backoff (ms)
    });

    // Capture session id from response header so we can store the session for later requests
    const originalSetHeader = res.setHeader.bind(res);
    res.setHeader = function (name: string, value: string | number | string[]) {
      const v = Array.isArray(value) ? value[0] : String(value);
      if (name.toLowerCase() === SESSION_HEADER && v) {
        sessions.set(v, { server, transport, lastTokens: requestTokens });
      }
      return originalSetHeader(name, value);
    };

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      console.error(
        'MCP Server Error:',
        err,
        req.method,
        req.url,
        'headers:',
        JSON.stringify(req.headers),
        'body:',
        JSON.stringify(req.body),
      );
      const sid = getSessionId(req);
      if (sid) sessions.delete(sid);
      if (!res.headersSent) res.status(500).json({ error: 'Internal server error' });
    }
  });
});

app.get('/', (_req, res) => {
  res.json({
    name: 'SE Ranking Data API MCP Server',
    version: '1.0.0',
    endpoints: { mcp: '/mcp' },
    status: 'running',
  });
});

const server = app.listen(PORT, HOST, () => {
  /* eslint-disable no-console */
  console.log(`MCP HTTP server running on http://${HOST}:${PORT}`);
  console.log(`MCP endpoint: http://${HOST}:${PORT}/mcp`);
  /* eslint-enable no-console */
});

// Keep SSE (GET /mcp) connections open: avoid server closing idle event streams.
// Default keepAliveTimeout (e.g. 5s) can cause "SSE stream disconnected: TypeError: terminated" in clients.
server.keepAliveTimeout = 72_000; // 72s, above common proxy timeouts (60s)
server.headersTimeout = 73_000; // must be > keepAliveTimeout (Node requirement)
