import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { commonSchemas } from '../schemas.js';
import { BaseTool } from "../base-tool.js";

/**
 * AiSearchOverview
 * - Calls SE Ranking AI Search “Overview” endpoint: /v1/ai-search/overview
 * - Uses request parameters exactly as per docs (target, scope, source, engine).
 * - Returns high-level overview metrics and trend time series.
 */
export class GetAiOverview extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'getAiOverview',
      {
        title: 'AI Search Overview (SE Ranking)',
        description:
          "Retrieves a high-level overview of a domain's performance in AI search engines. Returns aggregated data if no engine is specified, or engine-specific data if an engine is provided.",
        inputSchema: {
          target: commonSchemas.target.describe(
            'The target to analyze for LLM performance. Can be a root domain, subdomain, or a specific URL.',
          ),
          scope: z
            .enum(['domain', 'base_domain', 'url'])
            .default('base_domain')
            .describe(
              'The scope of the analysis. Can be base_domain (domain and all subdomains), domain (specific host), or url (exact URL).',
            ),
          source: commonSchemas.source.describe(
            'Alpha-2 country code for the regional prompt database (e.g., us for United States results).',
          ),
          engine: commonSchemas.engine.optional().describe(
            'The LLM to query (e.g., ai-overview, chatgpt, perplexity, gemini, ai-mode). If omitted, returns aggregated data across all engines.',
          ),
          brand: z.string().optional().describe('Brand name to search for. If omitted, uses the internally determined brand for the domain.'),
        },
      },
      async (params) => {
        const { engine } = params;
        const endpoint = engine
          ? '/v1/ai-search/overview/by-engine/time-series'
          : '/v1/ai-search/overview/aggregated/time-series';
        return this.makeGetRequest(endpoint, params);
      },
    );
  }
}
