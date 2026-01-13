import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class UpdateTag extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('updateTag'),
            {
                title: 'Update Tag',
                description: 'Project Tool: Requires a project ID. Adding tags to a domain and/or link. The tags will be added to all the links and domains submitted in the request. All previously added tags will be removed for these links and domains.',
                inputSchema: {
                    site_id: z.number().int().describe('Website ID'),
                    tag_ids: z.array(z.number().int()).optional().describe('List of Tag IDs'),
                    urls: z.array(z.string()).optional().describe('List of links'),
                    domains: z.array(z.string()).optional().describe('List of domains'),
                },
            },
            async (params: { site_id: number; tag_ids?: number[]; urls?: string[]; domains?: string[] }) => 
                // PUT /sites/{site_id}/url-tags
                 this.makePutRequest(`/sites/${params.site_id}/url-tags`, {
                    tag_ids: params.tag_ids,
                    urls: params.urls,
                    domains: params.domains,
                })
            ,
        );
    }
}
