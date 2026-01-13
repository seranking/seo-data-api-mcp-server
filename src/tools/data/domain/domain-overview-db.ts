import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

export class GetDomainOverviewDatabases extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getDomainOverviewDatabases'),
      {
        title: 'Domain Overview DB',
        description: 'Data Tool: Fetch domain overview by database (v1/domain/overview/db)',
        inputSchema: {
          source: z
            .string()
            .min(1, 'source is required')
            .max(2)
            .describe('Alpha-2 country code of the regional keyword database. '),
          domain: z
            .string()
            .min(1, 'domain is required')
            .describe('The domain for which to retrieve the keyword statistics.'),
          with_subdomains: z
            .number()
            .int()
            .min(0)
            .max(1)
            .optional()
            .default(1)
            .describe(
              'A flag to determine whether data for subdomains should be included in the analysis.',
            ),
          url: z
            .string()
            .optional()
            .describe(
              'Specific URL to analyze instead of the root domain. If provided, the domain parameter is ignored.',
            ),
        },
      },
      async (params) => this.makeGetRequest('/v1/domain/overview/db', params),
    );
  }
}
