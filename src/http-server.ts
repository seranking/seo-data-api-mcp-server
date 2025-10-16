import 'dotenv/config';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';

import { SERANKING_API_TOKEN } from './constants.js';
import { DataApiMcpServer } from './data-api-mcp-server.js';

function extractTokenFromHeader(authorization?: string) {
  const m = authorization?.match(/^Bearer\s+(.+)$/i);
  return m?.[1]?.trim();
}

function isAuthenticationRequired(req: express.Request) {
  return req.body.method !== 'tools/list';
}

const app = express();

app.use(express.json());

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
  const token = bearer || SERANKING_API_TOKEN;

  if (isAuthenticationRequired(req) && !token) {
    console.warn('Empty token! MCP request received:', req.method, req.url);
    return res.status(401).json({ error: 'Missing SERANKING_API_TOKEN (Bearer or env)' });
  }

  const server = new McpServer({ name: 'ser-data-api-mcp-server', version: '1.0.0' });

  // here we set up the token provider for the DataApiMcpServer, which is fetched from the request
  new DataApiMcpServer(server, { getToken: () => token }).init();

  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

  let cleaned = false;

  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    try {
      transport.close();
    } catch {}
    try {
      server.close();
    } catch {}
  };

  res.on('close', cleanup);
  res.on('finish', cleanup);

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

    cleanup();

    if (!res.headersSent) res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (_req, res) => {
  res.json({
    name: 'SE Ranking Data API MCP Server',
    version: '1.0.0',
    endpoints: { mcp: '/mcp' },
    status: 'running',
  });
});

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  /* eslint-disable no-console */
  console.log(`MCP HTTP server running on http://${HOST}:${PORT}`);
  console.log(`MCP endpoint: http://${HOST}:${PORT}/mcp`);
  /* eslint-enable no-console */
});
