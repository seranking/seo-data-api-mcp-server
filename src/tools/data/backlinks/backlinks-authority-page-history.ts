import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

export class GetPageAuthorityHistory extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getPageAuthorityHistory'),
      {
        title: 'Get Page Authority History',
        description:
          'Data Tool: Returns information about the historical values of InLink Rank for a specific target page.',
        inputSchema: {
          target: z.string().describe('Aim of the request: only full page URL is supported.'),
          date_from: z.string().optional().describe('Start date in YYYY-MM-DD format.'),
          date_to: z.string().optional().describe('End date in YYYY-MM-DD format.'),
          granularity: z
            .enum(['by_day', 'by_week', 'by_month'])
            .optional()
            .default('by_day')
            .describe('Granularity at which to return data.'),
        },
      },
      async (params) => this.makeGetRequest('/v1/backlinks/authority/page/history', params),
    );
  }
}
