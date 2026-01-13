import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class UpdateProjectGroup extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('updateProjectGroup'),
            {
                title: 'Update Project Group',
                description: 'Project Tool: Requires a project ID. Rename a project group.',
                inputSchema: {
                    group_id: z.number().int().describe('ID of the project group to rename'),
                    name: z.string().min(1).describe('New project group name'),
                },
            },
            async ({ group_id, name }: { group_id: number; name: string }) => 
                // PUT https://api4.seranking.com/site-groups/{group_id}
                // Body: {"name": "new name"}
                // Using makeJsonPostRequest but with 'PUT' method if supported, or assuming BaseTool handles PUT.
                // Looking at BaseTool, there is no makePutRequest, but there is makePatchRequest.
                // I need to use generic request or implement makePutRequest. 
                // Or re-use makeJsonRequestWithPut from update-project.ts logic ? 
                // Actually base-tool needs a PUT helper.
                // For now I will use this.request directly which is protected.

                 this.request(`/site-groups/${group_id}`, 'PUT', { name })
            ,
        );
    }
}
