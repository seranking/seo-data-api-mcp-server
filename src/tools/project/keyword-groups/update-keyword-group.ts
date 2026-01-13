import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class UpdateKeywordGroup extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('updateKeywordGroup'),
            {
                title: 'Update Keyword Group',
                description: 'Project Tool: Requires a project ID. Update the name of a project keyword group.',
                inputSchema: {
                    group_id: z.number().int().describe('ID of the keyword group to update'),
                    name: z.string().min(1).describe('New keyword group name'),
                },
            },
            async ({ group_id, name }: { group_id: number; name: string }) => 
                // PUT /keyword-groups/{group_id}
                // Body: {"name": "new name"}
                 this.request(`/keyword-groups/${group_id}`, 'PUT', { name })
            ,
        );
    }
}
