import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ListTags extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('listTags'),
            {
                title: 'List Tags',
                description: 'Project Tool: Requires a project ID. Get a list of landing page tags that are added to domains and/or links.',
                inputSchema: {
                    site_id: z.number().int().describe('Website ID'),
                },
            },
            async (params: { site_id: number }) => 
                // GET /sites/{site_id}/url-tags
                 this.makeGetRequest(`/sites/${params.site_id}/url-tags`, {})
            ,
        );
    }
}
