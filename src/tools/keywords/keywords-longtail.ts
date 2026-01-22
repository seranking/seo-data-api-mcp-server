import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from "../base-tool.js";
import { SERP_FEATURE_CODES } from './constants.js';

export class KeywordsLongtail extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'keywordsLongtail',
      {
        title: 'Longtail Keywords',
        description: 'Retrieves a list of long-tail variations for the seed keyword.',
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
          'filter.volume.from': z
            .number()
            .int()
            .min(0)
            .optional()
            .describe('Minimum monthly search volume.'),
          'filter.volume.to': z
            .number()
            .int()
            .min(0)
            .optional()
            .describe('Maximum monthly search volume.'),
          'filter.difficulty.from': z
            .number()
            .int()
            .min(0)
            .max(100)
            .optional()
            .describe('Minimum keyword difficulty score (0-100).'),
          'filter.difficulty.to': z
            .number()
            .int()
            .min(0)
            .max(100)
            .optional()
            .describe('Maximum keyword difficulty score (0-100).'),
          'filter.cpc.from': z.number().min(0).optional().describe('Minimum Cost Per Click.'),
          'filter.cpc.to': z.number().min(0).optional().describe('Maximum Cost Per Click.'),
          'filter.competition.from': z
            .number()
            .min(0)
            .max(1)
            .optional()
            .describe('Minimum competition score (0.0-1.0).'),
          'filter.competition.to': z
            .number()
            .min(0)
            .max(1)
            .optional()
            .describe('Maximum competition score (0.0-1.0).'),
          'filter.keyword_count.from': z
            .number()
            .int()
            .min(1)
            .optional()
            .describe('Minimum number of words in the keyword.'),
          'filter.keyword_count.to': z
            .number()
            .int()
            .min(1)
            .optional()
            .describe('Maximum number of words in the keyword.'),
          'filter.characters_count.from': z
            .number()
            .int()
            .min(1)
            .optional()
            .describe('Minimum character length of the keyword.'),
          'filter.characters_count.to': z
            .number()
            .int()
            .min(1)
            .optional()
            .describe('Maximum character length of the keyword.'),
          'filter.serp_features': z
            .string()
            .optional()
            .refine(
              (val?: string | null) => this.isValidCommaSeparatedList(SERP_FEATURE_CODES, val),
              {
                message:
                  'filter[serp_features] must be a comma-separated list of supported SERP feature codes',
              },
            )
            .describe('Comma-separated list of SERP features to filter by.'),
        },
      },
      async (params) => this.makeGetRequest('/v1/keywords/longtail', params),
    );
  }
}
