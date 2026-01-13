import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class DeleteKeywordGroup extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('deleteKeywordGroup'),
            {
                title: 'Delete Keyword Group',
                description: 'Project Tool: Requires a project ID. Delete a project keyword group.',
                inputSchema: {
                    group_id: z.number().int().describe('ID of the keyword group to delete'),
                },
            },
            async ({ group_id }: { group_id: number }) => 
                // DELETE /keyword-groups/{group_id}
                 this.makeDeleteRequest(`/keyword-groups/${group_id}`, {})
            ,
        );
    }
}
