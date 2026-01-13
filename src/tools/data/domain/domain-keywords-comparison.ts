import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

export class GetDomainKeywordsComparison extends BaseTool {
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
      this.toolName('getDomainKeywordsComparison'),
      {
        title: 'Domain Keywords Comparison',
        description:
          "Data Tool: Analyzes and compares the keyword rankings of two websites: `domain` and `compare`. It can find keywords they have in common (`diff=0`) or identify a 'keyword gap' (`diff=1`)—keywords for which the `domain` ranks, but the `compare` domain does not. To find keywords the `compare` domain has but `domain` misses, swap the values of `domain` and `compare`.",
        inputSchema: {
          source: z
            .string()
            .min(1, 'source is required')
            .max(2)
            .describe('Alpha-2 country code of the regional keyword database.'),
          domain: z
            .string()
            .min(1, 'domain is required')
            .describe(
              'The primary domain for the analysis. For a keyword gap analysis (`diff=1`), this will be the domain that HAS the keywords. Required if `url` is not provided.',
            )
            .optional(),
          url: z
            .string()
            .url()
            .optional()
            .describe(
              'The primary full URL for the analysis. If provided, `domain` is ignored. Required if `domain` is not provided.',
            ),
          compare: z
            .string()
            .min(1, 'compare is required')
            .describe(
              'The secondary domain or full URL for comparison. Must match the type of the primary parameter (`domain` or `url`). For a keyword gap analysis (`diff=1`), this will be the entity that is MISSING the keywords.',
            ),
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
          diff: z
            .number()
            .int()
            .min(0)
            .max(1)
            .optional()
            .default(0)
            .describe(
              'Controls the comparison mode. `0` = Common keywords (intersection): keywords both domains rank for. `1` = Keyword gap (difference): keywords the `domain` ranks for, but `compare` does not.',
            ),
          order_field: z
            .enum(['keyword', 'volume', 'cpc', 'competition', 'difficulty', 'position'])
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
      async (params) => this.makeGetRequest('/v1/domain/keywords/comparison', params),
    );
  }
}
