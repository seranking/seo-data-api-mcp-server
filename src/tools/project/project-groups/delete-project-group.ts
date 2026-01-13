import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class DeleteProjectGroup extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('deleteProjectGroup'),
            {
                title: 'Delete Project Group',
                description: 'Project Tool: Requires a project ID. Delete a project group.',
                inputSchema: {
                    group_id: z.number().int().describe('ID of the project group to delete'),
                },
            },
            async ({ group_id }: { group_id: number }) => this.makeDeleteRequest(`/site-groups/${group_id}`, {}),
        );
    }
}
