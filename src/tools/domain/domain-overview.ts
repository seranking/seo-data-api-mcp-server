import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from "../base-tool.js";

export class DomainOverview extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'domainOverview',
      {
        title: 'Domain Overview',
        description: 'Fetch domain overview (v1/domain/overview)',
        inputSchema: {
          domain: z
            .string()
            .min(1, 'domain is required')
            .describe('The domain for which to retrieve database data.'),
        },
      },
      async (params) => this.makeGetRequest('/v1/domain/overview', params),
    );
  }
}
