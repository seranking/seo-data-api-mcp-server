import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';
import { INTENTS, SERP_FEATURE_CODES } from './constants.js';

export class GetLongTailKeywords extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getLongTailKeywords'),
      {
        title: 'Longtail Keywords',
        description: 'Data Tool: Retrieves a list of long-tail variations for the seed keyword.',
        inputSchema: {
          source: z
            .string()
            .min(1, 'source is required')
            .max(2)
            .describe('Alpha-2 country code of the regional keyword database.'),
          keyword: z
            .string()
            .min(1, 'keyword is required')
            .describe('The seed keyword for which to find similar keywords.'),
          limit: z
            .number()
            .int()
            .positive()
            .optional()
            .describe('Maximum number of keywords to return per page.'),
          offset: z.number().int().min(0).optional().describe('Starting offset for pagination.'),
          sort: z
            .enum(['keyword', 'volume', 'cpc', 'difficulty', 'competition'])
            .optional()
            .describe('The field by which the returned list of keywords should be sorted.'),
          sort_order: z
            .enum(['asc', 'desc'])
            .optional()
            .describe('The order of sorting for the sort field.'),
          filter_volume_from: z
            .number()
            .int()
            .min(0)
            .optional()
            .describe('Minimum monthly search volume.'),
          filter_volume_to: z
            .number()
            .int()
            .min(0)
            .optional()
            .describe('Maximum monthly search volume.'),
          filter_difficulty_from: z
            .number()
            .int()
            .min(0)
            .max(100)
            .optional()
            .describe('Minimum keyword difficulty score (0-100).'),
          filter_difficulty_to: z
            .number()
            .int()
            .min(0)
            .max(100)
            .optional()
            .describe('Maximum keyword difficulty score (0-100).'),
          filter_cpc_from: z.number().min(0).optional().describe('Minimum Cost Per Click.'),
          filter_cpc_to: z.number().min(0).optional().describe('Maximum Cost Per Click.'),
          filter_competition_from: z
            .number()
            .min(0)
            .max(1)
            .optional()
            .describe('Minimum competition score (0.0-1.0).'),
          filter_competition_to: z
            .number()
            .min(0)
            .max(1)
            .optional()
            .describe('Maximum competition score (0.0-1.0).'),
          filter_keyword_count_from: z
            .number()
            .int()
            .min(1)
            .optional()
            .describe('Minimum number of words in the keyword.'),
          filter_keyword_count_to: z
            .number()
            .int()
            .min(1)
            .optional()
            .describe('Maximum number of words in the keyword.'),
          filter_characters_count_from: z
            .number()
            .int()
            .min(1)
            .optional()
            .describe('Minimum character length of the keyword.'),
          filter_characters_count_to: z
            .number()
            .int()
            .min(1)
            .optional()
            .describe('Maximum character length of the keyword.'),
          filter_serp_features: z
            .string()
            .optional()
            .refine(
              (val?: string | null) => this.isValidCommaSeparatedList(SERP_FEATURE_CODES, val),
              {
                message:
                  'filter_serp_features must be a comma-separated list of supported SERP feature codes',
              },
            )
            .describe('Comma-separated list of SERP features to filter by.'),
          filter_intents: z
            .string()
            .optional()
            .refine((val?: string | null) => this.isValidCommaSeparatedList(INTENTS, val), {
              message: 'filter_intents must be a comma-separated list of supported intents (I, N, T, C, L)',
            })
            .describe(
              'Comma-separated list of search intent codes: I=Informational, N=Navigational, T=Transactional, C=Commercial, L=Local.',
            ),
          filter_multi_keyword_included: z
            .string()
            .optional()
            .describe(
              'Comma-separated list of words that MUST appear in the keyword (AND logic).',
            ),
          filter_multi_keyword_excluded: z
            .string()
            .optional()
            .describe(
              'Comma-separated list of words that must NOT appear in the keyword.',
            ),
        },
      },
      async (params) => this.makeGetRequest('/v1/keywords/longtail', this.transformFilterParams(params)),
    );
  }
}
