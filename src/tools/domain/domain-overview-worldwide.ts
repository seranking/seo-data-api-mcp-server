import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class GetDomainOverviewWorldwide extends BaseTool {
  readonly FIELDS = ['price', 'traffic', 'keywords', 'positions_diff', 'positions_tops'];

  registerTool(server: McpServer): void {
    server.registerTool(
      'getDomainOverviewWorldwide',
      {
        title: 'Domain Overview Worldwide',
        description: 'Retrieves an aggregated worldwide overview of domain metrics.',
        inputSchema: {
          domain: z
            .string()
            .min(1, 'domain is required')
            .describe('The domain name for which to retrieve worldwide statistics.'),
          currency: z
            .string()
            .max(3)
            .optional()
            .default('USD')
            .describe(
              'An ISO 4217 currency code to be used for any monetary values (like traffic cost) returned in the response.',
            ),
          fields: z
            .string()
            .optional()
            .refine((val?: string | null) => this.isValidCommaSeparatedList(this.FIELDS, val), {
              message: 'fields must be a comma-separated list of supported fields',
            })
            .default('price, traffic, keywords')
            .describe(
              'A comma-separated list specifying which data fields or categories to include in the response. This allows for tailoring the response to only the needed information.',
            ),
          show_zones_list: z
            .number()
            .int()
            .min(0)
            .max(1)
            .optional()
            .default(0)
            .describe(
              'A boolean-like value (“1” for true, “0” for false) to determine if the response should include a detailed breakdown of statistics for each individual regional zone (country) in addition to the aggregated worldwide statistics.',
            ),
        },
      },
      async (params) => this.makeGetRequest('/v1/domain/overview/worldwide', params),
    );
  }
}
