import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

const TargetBrandSchema = z.object({
  target: z.string().describe('Domain, subdomain, or URL to analyze.'),
  brand: z.string().describe('Brand name associated with this target.'),
});

/**
 * GetAiOverviewLeaderboard
 * - Calls SE Ranking AI Search "Overview Leaderboard" endpoint: POST /v1/ai-search/overview/leaderboard
 * - Compares a primary target against up to 10 competitors across AI search engines.
 * - Returns brand presence, link presence, share of voice, and rankings.
 */
export class GetAiOverviewLeaderboard extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getAiOverviewLeaderboard'),
      {
        title: 'AI Search Comparison & Leaderboard (SE Ranking)',
        description:
          'Data Tool: Compare multiple domains/brands in AI search engines (ChatGPT, Perplexity, Gemini, AI Overview, AI Mode). Use this for AI search comparison, competitor analysis, and visibility benchmarking. Returns brand presence, link presence, share of voice rankings, and leaderboard for each domain across AI engines.',
        inputSchema: {
          primary: TargetBrandSchema.describe(
            'The primary target to analyze. Object with target (domain/subdomain/URL) and brand name.',
          ),
          competitors: z
            .array(TargetBrandSchema)
            .min(1)
            .max(10)
            .describe(
              'Array of competitor targets to compare against. Each object has target and brand. Maximum 10 competitors.',
            ),
          source: z
            .string()
            .min(2)
            .max(2)
            .describe('Alpha-2 country code for the regional prompt database (e.g., us for United States).'),
          engines: z
            .array(z.enum(['ai-overview', 'ai-mode', 'chatgpt', 'perplexity', 'gemini']))
            .min(1)
            .describe(
              "Array of AI engines to include in the analysis. Options: 'ai-overview', 'ai-mode', 'chatgpt', 'perplexity', 'gemini'.",
            ),
          scope: z
            .enum(['domain', 'base_domain', 'url'])
            .optional()
            .describe(
              'The scope of the analysis. Can be base_domain (domain and all subdomains), domain (specific host), or url (exact URL). Default: base_domain.',
            ),
        },
      },
      async (params) => {
        const { primary, competitors, source, engines, scope } = params;

        const body: Record<string, unknown> = {
          primary,
          competitors,
          source,
          engines,
        };

        if (scope) {
          body.scope = scope;
        }

        return this.makeJsonPostRequest('/v1/ai-search/overview/leaderboard', body);
      },
    );
  }
}
