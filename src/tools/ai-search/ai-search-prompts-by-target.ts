import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { AISearchFilterObject } from '../../validation-partials/json-filters-partials.js';
import { BaseTool } from '../base-tool.js';

export class GetAiPromptsByTarget extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'getAiPromptsByTarget',
      {
        title: 'AI Search: Get Prompts by Target (SE Ranking)',
        description:
          'Retrieves a list of prompts (queries) that mention the specified target in AI search results.',
        inputSchema: {
          engine: z
            .string()
            .min(1, 'engine is required')
            .describe("Type of LLM engine (e.g. 'chatgpt', 'perplexity', 'ai-mode', etc.)."),
          target: z
            .string()
            .min(1, 'target is required')
            .describe('The target to retrieve prompts for (domain, host, or URL).'),
          source: z
            .string()
            .min(2, 'source is required')
            .max(2, 'source must be alpha-2 code')
            .describe("Alpha-2 country code of the regional prompt database (e.g. 'US')."),
          scope: z
            .enum(['domain', 'base_domain', 'url'])
            .default('base_domain')
            .describe(
              'The scope of the analysis. Can be base_domain (domain and all subdomains), domain (specific host), or url (exact URL).',
            ),
          sort: z
            .enum(['volume', 'type', 'snippet_length'])
            .optional()
            .default('volume')
            .describe('The field to sort the results by. Options: volume, type, snippet_length.'),
          sort_order: z
            .enum(['desc', 'asc'])
            .optional()
            .default('desc')
            .describe(
              "Sort order ('asc' for ascending, 'desc' for descending). Default is 'desc'.",
            ),
          limit: z
            .number()
            .int()
            .min(1)
            .optional()
            .default(20)
            .describe('Maximum number of prompts to return.'),
          offset: z
            .number()
            .int()
            .min(0)
            .optional()
            .default(0)
            .describe('Offset for pagination (starting index).'),

          ...AISearchFilterObject,
        },
      },
      async (params) => this.makeGetRequest('/v1/ai-search/prompts-by-target', params),
    );
  }
}
