import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { SeoApiMcpServer } from './seo-api-mcp-server.js';

const server = new McpServer({
  name: 'ser-data-api-mcp-server',
  version: '1.0.0',
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('SER Data API MCP Server running on stdio');
}

new SeoApiMcpServer(server).init();

runServer().catch((error) => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
