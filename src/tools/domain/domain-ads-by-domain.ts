import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class GetDomainAdsByDomain extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'getDomainAdsByDomain',
      {
        title: 'Domain Ads by Domain',
        description: 'Retrieves paid ads for a specific domain.',
        inputSchema: {
          source: z
            .string()
            .min(1, 'source is required')
            .max(2)
            .describe('Alpha-2 country code of the regional keyword database.'),
          domain: z
            .string()
            .min(1, 'domain is required')
            .describe('The specific domain for which to retrieve its paid ad data.'),
          from: z
            .string()
            .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'from must be in YYYY-MM format')
            .optional()
            .describe(
              'The starting year and month for the data retrieval period, formatted as “YYYY-MM” (e.g., “2017-01”).',
            ),
          to: z
            .string()
            .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'to must be in YYYY-MM format')
            .optional()
            .describe(
              'The ending year and month for the data retrieval period, formatted as “YYYY-MM”.',
            ),
          page: z
            .number()
            .int()
            .positive()
            .optional()
            .default(1)
            .describe(
              'For paginated results, specifies the page number of domains advertising on this keyword to retrieve.',
            ),
          limit: z
            .number()
            .int()
            .positive()
            .max(100)
            .optional()
            .default(100)
            .describe(
              'The maximum number of domains (advertising on the keyword) to return per page.',
            ),
        },
      },
      async (params) => this.makeGetRequest('/v1/domain/ads', params),
    );
  }
}
