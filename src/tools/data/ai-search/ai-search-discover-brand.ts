import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';
import { commonSchemas } from '../../schemas.js';

/**
 * AiSearchDiscoverBrand
 * - Calls SE Ranking AI Search "Discover Brand" endpoint: /v1/ai-search/discover-brand
 * - Identifies and returns the brand name associated with a given target domain, subdomain, or URL.
 */
export class GetAiDiscoverBrand extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getAiDiscoverBrand'),
      {
        title: 'AI Search Discover Brand',
        description:
          'Data Tool: Identifies and returns the brand name associated with a given target domain, subdomain, or URL. Useful for determining what brand name to use in other AI search queries.',
        inputSchema: {
          target: commonSchemas.target.describe(
            'The target to analyze. Can be a root domain, subdomain, or a specific URL.',
          ),
          scope: z
            .enum(['domain', 'base_domain', 'url'])
            .default('domain')
            .describe(
              'The scope of the analysis. Can be base_domain (aggregate by registrable domain, includes all subdomains), domain (exact host only, no subdomain aggregation), or url (exact URL including path and query).',
            ),
          source: commonSchemas.source.describe(
            'Alpha-2 country code for the regional prompt database (e.g., us for United States results).',
          ),
        },
      },
      async (params) => this.makeGetRequest('/v1/ai-search/discover-brand', params),
    );
  }
}
