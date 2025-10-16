import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from "../base-tool.js";
import { INTENTS } from './constants.js';

export class DomainAioKeywordsByBrand extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'domainAioKeywordsByBrand',
      {
        title: 'AIO Keywords by Brand',
        description:
          'Fetch AI Overviews domain keywords by brand (v1/domain/aio/keywords-by-brand)',
        inputSchema: {
          source: z
            .string()
            .min(1, 'source is required')
            .max(2)
            .describe('The alpha-2 country code for the regional database. Example: us'),
          brand: z
            .string()
            .min(1, 'target is required')
            .describe('The brand name to search for in AIO snippets. Example: SE Ranking.'),
          scope: z
            .enum(['base_domain', 'domain', 'url'])
            .default('base_domain')
            .describe(
              'The scope of the analysis. Can be base_domain (domain and all subdomains), domain (specific host), or url (exact URL).',
            ),
          sort: z
            .enum(['volume', 'type', 'snippet_length'])
            .optional()
            .default('volume')
            .describe(
              'The field to sort the results by. Available values: volume, type, snippet_length.',
            ),
          sort_order: z
            .enum(['asc', 'desc'])
            .optional()
            .default('desc')
            .describe('The order for sorting. Available values: asc, desc.'),
          offset: z
            .number()
            .int()
            .min(0)
            .optional()
            .default(0)
            .describe('The starting position for paginated results.'),
          limit: z
            .number()
            .int()
            .positive()
            .optional()
            .default(100)
            .describe('The maximum number of keywords to return per page.'),
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
      async (params) => this.makeGetRequest('/v1/domain/aio/keywords-by-brand', params),
    );
  }
}
