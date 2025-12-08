import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class ListNewLostReferringDomains extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'listNewLostReferringDomains',
      {
        title: 'List New and Lost Referring Domains',
        description:
          'Returns a list of referring domains, at least one backlink from which was (newly) found or lost in the specified date range for the specified target.',
        inputSchema: {
          target: z.string().describe('Aim of the request: root domain, host, or URL.'),
          mode: z.enum(['domain', 'host', 'url']).optional().default('host'),
          new_lost_type: z
            .enum(['new', 'lost', ''])
            .optional()
            .default('')
            .describe('Indicates whether the refdomain is new or lost. Empty returns both.'),
          date_from: z.string().optional().describe('Start date in YYYY-MM-DD format.'),
          date_to: z.string().optional().describe('End date in YYYY-MM-DD format.'),
          order_by: z
            .enum(['new_lost_date', 'domain_inlink_rank', 'inlink_rank'])
            .optional()
            .default('new_lost_date'),
          limit: z.number().int().min(1).max(10000).optional().default(100),
        },
      },
      async (params) => this.makeGetRequest('/v1/backlinks/refdomains/history', params),
    );
  }
}
