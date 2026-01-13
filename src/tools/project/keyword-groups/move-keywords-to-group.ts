import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class MoveKeywordsToGroup extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('moveKeywordsToGroup'),
            {
                title: 'Move Keywords to Group',
                description: 'Project Tool: Requires a project ID. Transfer project keywords from one group to another.',
                inputSchema: {
                    group_id: z.number().int().describe('ID of the destination keyword group'),
                    keywords_ids: z.array(z.number().int()).describe('Array of the IDs of keywords to be transferred'),
                },
            },
            async ({ group_id, keywords_ids }: { group_id: number; keywords_ids: number[] }) => 
                // POST /keyword-groups/{group_id}/keywords
                // Body: {"keywords_ids": [1,2,3,4,5]}
                 this.makeJsonPostRequest(`/keyword-groups/${group_id}/keywords`, { keywords_ids })
            ,
        );
    }
}
