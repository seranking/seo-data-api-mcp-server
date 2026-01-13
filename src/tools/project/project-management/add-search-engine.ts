import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class AddSearchEngine extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('addSearchEngine'),
            {
                title: 'Add Search Engine to Project',
                description: 'Project Tool: Add a new search engine to a project.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    search_engine_id: z.number().int().describe('Search engine ID (refer to getAvailableSearchEngines)'),
                    region_name: z.string().optional().describe('Geographical name (region / city) in English. Only for Google'),
                    lang_code: z.string().optional().describe('Language code'),
                    merge_map: z.enum(['0', '1', '2']).optional().describe('Take Google Maps SERPs into account. 0 – don’t take into account, 1 – take into account, 2 – take into account and display separately.'),
                    business_name: z.string().optional().describe('Business name for Google Maps SERPs'),
                    phone: z.string().optional().describe('Company phone number for Google Maps SERPs'),
                    paid_results: z.enum(['0', '1']).optional().describe('Track rankings in Google Ads (1 – yes, 0 – no)'),
                    featured_snippet: z.enum(['0', '1']).optional().describe('Take Featured snippet into account (1 – take into account, 0 – don’t take into account)'),
                    region_id: z.number().int().optional().describe('Region ID (refer to getSerpLocations)'),
                },
            },
            async ({ site_id, ...params }: { site_id: number;[key: string]: any }) => 
                // POST https://api4.seranking.com/sites/{site_id}/search-engines
                 this.makeJsonPostRequest(`/sites/${site_id}/search-engines`, params)
            ,
        );
    }
}
