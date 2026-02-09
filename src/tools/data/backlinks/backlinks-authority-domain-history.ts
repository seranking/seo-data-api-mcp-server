import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

export class GetDomainAuthorityHistory extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getDomainAuthorityHistory'),
      {
        title: 'Get Domain Authority History',
        description:
          'Data Tool: Returns historical Domain InLink Rank (Domain Authority) values for a target domain. The target is always resolved to its PLD (pay-level domain) regardless of whether a root domain, host, or URL is provided.',
        inputSchema: {
          target: z.string().describe('Domain, host, or URL (PLD is extracted).'),
          date_from: z.string().optional().describe('Start date in YYYY-MM-DD format.'),
          date_to: z.string().optional().describe('End date in YYYY-MM-DD format.'),
          granularity: z
            .enum(['by_day', 'by_week', 'by_month'])
            .optional()
            .default('by_day')
            .describe('Granularity at which to return data: by_day, by_week, or by_month.'),
        },
      },
      async (params) => this.makeGetRequest('/v1/backlinks/authority/domain/history', params),
    );
  }
}
