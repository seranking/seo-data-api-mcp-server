import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class UpdateSearchEngine extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('updateSearchEngine'),
            {
                title: 'Update Search Engine',
                description: 'Project Tool: Update an existing search engine in a project.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    site_engine_id: z.number().int().describe('Unique search engine ID within the project (not global ID)'),
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
            async ({ site_id, site_engine_id, ...params }: { site_id: number; site_engine_id: number;[key: string]: any }) => 
                // PUT https://api4.seranking.com/sites/{site_id}/search-engines/{site_engine_id}
                 this.makePutRequest(`/sites/${site_id}/search-engines/${site_engine_id}`, params)
            ,
        );
    }
}
