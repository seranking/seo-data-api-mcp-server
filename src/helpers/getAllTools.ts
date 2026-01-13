import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { McpServerMock } from '../classes/McpServerMock.js';
import { SeoApiMcpServer } from '../seo-api-mcp-server.js';

export const getAllTools = () => {
  const server = new McpServerMock();
  new SeoApiMcpServer(server as unknown as McpServer).init();
  return server.tools;
};
