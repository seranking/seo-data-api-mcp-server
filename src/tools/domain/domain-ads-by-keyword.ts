import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from "../base-tool.js";

export class GetDomainAdsByKeyword extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'getDomainAdsByKeyword',
      {
        title: 'Domain Ads by Keyword',
        description: 'Retrieves paid ads for a specific keyword.',
        inputSchema: {
          source: z
            .string()
            .min(1, 'source is required')
            .max(2)
            .describe('Alpha-2 country code of the regional keyword database.'),
          keyword: z
            .string()
            .min(1, 'keyword is required')
            .describe('The specific keyword for which to retrieve paid ad data.'),
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
