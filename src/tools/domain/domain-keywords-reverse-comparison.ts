import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from './../base-tool.js';

export class DomainKeywordsReverseComparison extends BaseTool {
  readonly COLS = [
    'keyword',
    'volume',
    'cpc',
    'competition',
    'kei',
    'total_sites',
    'position',
    'url',
    'price',
    'traffic',
    'compare_position',
    'compare_url',
    'compare_price',
    'compare_traffic',
  ];

  registerTool(server: McpServer): void {
    server.registerTool(
      'domainKeywordsReverseComparison',
      {
        title: 'Domain Keywords Reverse Comparison',
        description: 'Compare keywords across domains (v1/domain/keywords/comparison)',
        inputSchema: {
          source: z
            .string()
            .min(1, 'source is required')
            .max(2)
            .describe('Alpha-2 country code of the regional keyword database.'),
          domain: z
            .string()
            .min(1, 'domain is required')
            .describe('The primary domain for the comparison.'),
          compare: z
            .string()
            .min(1, 'compare is required')
            .describe('The competitor domain to compare against the primary domain.'),
          type: z
            .enum(['organic', 'adv'])
            .optional()
            .default('organic')
            .describe(
              'Specifies whether to compare keywords based on organic search traffic or paid search (advertising) traffic.',
            ),
          page: z
            .number()
            .int()
            .positive()
            .optional()
            .default(1)
            .describe('For paginated results, specifies the page number of keywords to retrieve.'),
          limit: z
            .number()
            .int()
            .positive()
            .max(1000)
            .optional()
            .default(100)
            .describe('The maximum number of keywords to return per page.'),
          cols: z
            .string()
            .optional()
            .refine((val?: string | null) => this.isValidCommaSeparatedList(this.COLS, val), {
              message: 'cols must be a comma-separated list of supported columns',
            })
            .describe(
              'A comma-separated list of specific response parameter names to include in the output. If omitted, a default set of relevant columns is returned for the comparison.',
            ),
          order_field: z
            .enum([
              'keyword',
              'volume',
              'cpc',
              'competition',
              'difficulty',
              'position',
              'price',
              'traffic',
            ])
            .optional()
            .default('keyword')
            .describe('Specifies the field by which to sort the results.'),
          order_type: z
            .enum(['asc', 'desc'])
            .optional()
            .default('asc')
            .describe('Specifies the sort order for the results.'),
        },
      },
      async (params) => {
        const changedParams = {
          ...params,
          domain: params.compare,
          compare: params.domain,
          diff: 1,
        };
        return this.makeGetRequest('/v1/domain/keywords/comparison', changedParams);
      },
    );
  }
}
