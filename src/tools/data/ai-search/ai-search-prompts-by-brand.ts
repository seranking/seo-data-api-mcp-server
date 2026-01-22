import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { AISearchFilterObject } from '../../../validation-partials/json-filters-partials.js';
import { BaseTool } from '../../base-tool.js';

export class GetAiPromptsByBrand extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getAiPromptsByBrand'),
      {
        title: 'AI Search: Get Prompts by Brand (SE Ranking)',
        description:
          'Data Tool: Retrieves a list of prompts where the specified brand is mentioned in AI search results.',
        inputSchema: {
          engine: z
            .string()
            .min(1, 'engine is required')
            .describe(
              "LLM to query (e.g., 'ai-overview', 'chatgpt', 'perplexity', 'gemini', 'ai-mode').",
            ),
          brand: z
            .string()
            .min(1, 'brand is required')
            .describe('Brand name to search for in LLM snippets.'),
          source: z
            .string()
            .min(2, 'source is required')
            .max(2, 'source must be an alpha-2 country code')
            .describe("Alpha-2 country code of the regional prompt database (e.g., 'us')."),
          sort: z
            .enum(['volume', 'type', 'snippet_length'])
            .optional()
            .default('volume')
            .describe('The field to sort the results by. Options: volume, type, snippet_length.'),
          sort_order: z
            .enum(['asc', 'desc'])
            .optional()
            .default('desc')
            .describe('Sort direction. Default: desc.'),
          limit: z
            .number()
            .int()
            .min(1)
            .max(1000)
            .optional()
            .default(100)
            .describe('Max prompts per page (1–1000). Default: 100.'),
          offset: z
            .number()
            .int()
            .min(0)
            .optional()
            .default(0)
            .describe('Starting index for pagination. Default: 0.'),

          ...AISearchFilterObject,
        },
      },
      async (params) => this.makeGetRequest('/v1/ai-search/prompts-by-brand', this.transformFilterParams(params)),
    );
  }
}
