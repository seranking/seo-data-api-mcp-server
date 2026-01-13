import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class DeleteTag extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('deleteTag'),
            {
                title: 'Delete Tag',
                description: 'Project Tool: Requires a project ID. Delete a tag.',
                inputSchema: {
                    site_id: z.number().int().describe('Website ID'),
                    tag_id: z.number().int().describe('Tag ID'),
                },
            },
            async (params: { site_id: number; tag_id: number }) => 
                // DELETE /sites/{site_id}/url-tags/{tag_id}
                 this.makeDeleteRequest(`/sites/${params.site_id}/url-tags/${params.tag_id}`, {})
            ,
        );
    }
}
