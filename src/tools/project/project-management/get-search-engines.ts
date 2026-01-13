import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetSearchEngines extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getSearchEngines'),
            {
                title: 'Get Search Engines',
                description: 'Project Tool: Requires a project ID. Get a list of search engines employed by a project.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                },
            },
            async ({ site_id }: { site_id: number }) => 
                // GET https://api4.seranking.com/sites/{site_id}/search-engines
                 this.makeGetRequest(`/sites/${site_id}/search-engines`, {})
            ,
        );
    }
}
