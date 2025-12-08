import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';
import { INTENTS } from './constants.js';

export class GetDomainKeywords extends BaseTool {
  readonly COLS = [
    'keyword',
    'position',
    'prev_pos',
    'volume',
    'cpc',
    'competition',
    'url',
    'kei',
    'total_sites',
    'traffic',
    'traffic_percent',
    'price',
    'block',
    'snippet_num',
    'snippets_count',
    'snippet_title',
    'snippet_description',
    'snippet_display_url',
  ];

  registerTool(server: McpServer): void {
    server.registerTool(
      'getDomainKeywords',
      {
        title: 'Domain Keywords',
        description:
          'Retrieves a list of keywords for which a domain ranks in organic or paid search.',
        inputSchema: {
          source: z
            .string()
            .min(1, 'source is required')
            .max(2)
            .describe('Alpha-2 country code of the regional keyword database.'),
          domain: z
            .string()
            .min(1, 'domain is required')
            .describe('The domain name for which to retrieve keywords.'),
          type: z
            .enum(['organic', 'adv'])
            .optional()
            .default('organic')
            .describe(
              'Specifies whether to retrieve keywords for organic search traffic or paid search (advertising) traffic.',
            ),
          order_field: z
            .enum(['traffic', 'volume', 'position', 'cpc', 'competition', 'kei'])
            .optional()
            .default('traffic')
            .describe('The field by which the returned keyword list should be sorted.'),
          order_type: z
            .enum(['asc', 'desc'])
            .optional()
            .default('desc')
            .describe('The order of sorting.'),
          page: z
            .number()
            .int()
            .positive()
            .optional()
            .default(1)
            .describe('For paginated results, specifies the page number to retrieve.'),
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
              'A comma-separated list of specific response parameter names to include in the output. If omitted, a default set of relevant columns is returned.',
            ),
          pos_change: z
            .enum(['up', 'down', 'new', 'lost', 'diff', 'same'])
            .optional()
            .describe(
              'Filters keywords based on changes in their ranking positions compared to the previous period.',
            ),
          'filter[volume][from]': z
            .number()
            .int()
            .min(0)
            .optional()
            .describe('Specifies the minimum monthly search volume for keywords to be included.'),
          'filter[volume][to]': z
            .number()
            .int()
            .min(0)
            .optional()
            .describe('Specifies the maximum monthly search volume for keywords to be included.'),
          'filter[difficulty][from]': z
            .number()
            .int()
            .min(0)
            .optional()
            .describe(
              'Specifies the minimum keyword difficulty score (typically 0-100) for keywords to be included.',
            ),
          'filter[difficulty][to]': z
            .number()
            .int()
            .min(0)
            .optional()
            .describe(
              'Specifies the maximum keyword difficulty score for keywords to be included.',
            ),
          'filter[keyword_count][from]': z
            .number()
            .int()
            .min(1)
            .optional()
            .describe('Specifies the minimum number of words in a keyword phrase.'),
          'filter[keyword_count][to]': z
            .number()
            .int()
            .min(1)
            .optional()
            .describe('Specifies the maximum number of words in a keyword phrase.'),
          'filter[intents]': z
            .string()
            .optional()
            .refine((val?: string | null) => this.isValidCommaSeparatedList(INTENTS, val), {
              message: 'filter[intents] must be a comma-separated list of supported intents',
            })
            .describe('A comma-separated list of search intent codes to filter keywords.'),
          'filter[competition][from]': z
            .number()
            .min(0)
            .max(100)
            .optional()
            .describe(
              'Specifies the minimum competition score (typically 0-1 or 0-100, depending on the metric scale) for keywords.',
            ),
          'filter[competition][to]': z
            .number()
            .optional()
            .describe('Specifies the maximum competition score for keywords.'),
          'filter[cpc][from]': z
            .number()
            .min(0)
            .optional()
            .describe('Specifies the minimum Cost Per Click (CPC) value for keywords.'),
          'filter[cpc][to]': z
            .number()
            .min(0)
            .optional()
            .describe('Specifies the maximum Cost Per Click (CPC) value for keywords.'),
          'filter[traffic][from]': z
            .number()
            .int()
            .min(0)
            .optional()
            .describe('Specifies the minimum estimated monthly traffic for keywords.'),
          'filter[traffic][to]': z
            .number()
            .int()
            .min(0)
            .optional()
            .describe('Specifies the maximum estimated monthly traffic for keywords.'),
          'filter[position][from]': z
            .number()
            .int()
            .positive()
            .optional()
            .describe('Specifies the minimum ranking position for keywords.'),
          'filter[position][to]': z
            .number()
            .int()
            .positive()
            .optional()
            .describe('Specifies the maximum ranking position for keywords.'),
          'filter[characters_count][from]': z
            .number()
            .int()
            .positive()
            .optional()
            .describe('Specifies the minimum character length for keyword phrases.'),
          'filter[characters_count][to]': z
            .number()
            .int()
            .positive()
            .optional()
            .describe('Specifies the maximum character length for keyword phrases.'),
        },
      },
      async (params) => this.makeGetRequest('/v1/domain/keywords', params),
    );
  }
}
