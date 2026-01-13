import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class AddTag extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('addTag'),
            {
                title: 'Add Tag',
                description: 'Project Tool: Requires a project ID. Add a tag to the site and attach it to a link and/or domain.',
                inputSchema: {
                    site_id: z.number().int().describe('Website ID'),
                    name: z.string().min(1).describe('Tag Name'),
                    urls: z.array(z.string()).optional().describe('List of links the tag is added to'),
                    domains: z.array(z.string()).optional().describe('List of domains the tag is added to'),
                },
            },
            async (params: { site_id: number; name: string; urls?: string[]; domains?: string[] }) => 
                // POST /sites/{site_id}/url-tags
                 this.makeJsonPostRequest(`/sites/${params.site_id}/url-tags`, {
                    name: params.name,
                    urls: params.urls,
                    domains: params.domains,
                })
            ,
        );
    }
}
