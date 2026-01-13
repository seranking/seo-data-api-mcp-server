import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ListKeywords extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('listKeywords'),
            {
                title: 'List Keywords',
                description: 'Project Tool: Get a list of keywords with target pages for a project.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    site_engine_id: z.number().int().optional().describe('Search engine ID (optional). If passed, first_check_date will be returned.'),
                },
            },
            async ({ site_id, ...params }: { site_id: number;[key: string]: any }) => 
                // GET https://api4.seranking.com/sites/{site_id}/keywords
                 this.makeGetRequest(`/sites/${site_id}/keywords`, params)
            ,
        );
    }
}
