import 'dotenv/config';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { hostHeaderValidation } from '@modelcontextprotocol/sdk/server/middleware/hostHeaderValidation.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';

import { DATA_API_TOKEN, PROJECT_API_TOKEN } from './constants.js';
import { runWithRequestTokens } from './request-token-context.js';
import { SeoApiMcpServer } from './seo-api-mcp-server.js';

function extractTokenFromHeader(authorization?: string) {
  const m = authorization?.match(/^Bearer\s+(.+)$/i);
  return m?.[1]?.trim();
}

function isAuthenticationRequired(req: express.Request) {
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
  app.use((_req, _res, next) => next());
} else {
  const extraHosts = allowedHostsEnv?.split(',').map((h) => h.trim()).filter(Boolean) ?? [];
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

// catch all requests for MCP requests
app.all('/mcp', async (req, res) => {
  const bearer = extractTokenFromHeader(req.headers.authorization);
  const token = bearer || DATA_API_TOKEN || PROJECT_API_TOKEN;

  if (isAuthenticationRequired(req) && !token) {
    console.warn('Empty token! MCP request received:', req.method, req.url);
    return res.status(401).json({ error: 'Missing API Token (Bearer of DATA/PROJECT env)' });
  }

  // Pass token from request (Bearer) or env into request context so tools use it
  const requestTokens = {
    dataApiToken: bearer || DATA_API_TOKEN || undefined,
    projectApiToken: bearer || PROJECT_API_TOKEN || undefined,
  };

  await runWithRequestTokens(requestTokens, async () => {
    const server = new McpServer({ name: 'ser-data-api-mcp-server', version: '1.0.0' });

    new SeoApiMcpServer(server).init();

    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

    let cleaned = false;

    const cleanup = async () => {
      if (cleaned) return;
      cleaned = true;
      try {
        await transport.close();
      } catch { }
      try {
        await server.close();
      } catch { }
    };

    res.on('close', () => {
      void cleanup().catch(console.error);
    });

    res.on('finish', () => {
      void cleanup().catch(console.error);
    });

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

      void cleanup().catch(console.error);

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

app.listen(PORT, HOST, () => {
  /* eslint-disable no-console */
  console.log(`MCP HTTP server running on http://${HOST}:${PORT}`);
  console.log(`MCP endpoint: http://${HOST}:${PORT}/mcp`);
  /* eslint-enable no-console */
});
