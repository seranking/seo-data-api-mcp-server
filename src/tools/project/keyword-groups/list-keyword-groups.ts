import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ListKeywordGroups extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('listKeywordGroups'),
            {
                title: 'List Keyword Groups',
                description: 'Project Tool: Requires a project ID. Get a list of keyword groups for a specified project.',
                inputSchema: {
                    site_id: z.number().int().describe('ID of the project'),
                },
            },
            async ({ site_id }: { site_id: number }) => 
                // GET /keyword-groups/{site_id}
                 this.makeGetRequest(`/keyword-groups/${site_id}`, {})
            ,
        );
    }
}
