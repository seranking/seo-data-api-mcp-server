import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class MoveBacklinksToGroup extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('moveBacklinksToGroup'),
            {
                title: 'Move Backlinks to Group',
                description: 'Project Tool: Move backlinks from one group to another. Can move individual backlinks or entire groups.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    target_group_id: z.number().int().describe('Target backlink group ID to move to'),
                    backlink_ids: z.array(z.number().int()).optional().describe('Array of backlink IDs to move'),
                    group_ids: z.array(z.number().int()).optional().describe('Array of backlink group IDs to move'),
                },
            },
            async (params: {
                site_id: number;
                target_group_id: number;
                backlink_ids?: number[];
                group_ids?: number[];
            }) => {
                const { site_id, target_group_id, backlink_ids, group_ids } = params;
                return this.makeJsonPostRequest(`/backlink-groups/${site_id}/move`, {
                    id: target_group_id,
                    backlink_ids,
                    group_ids,
                });
            },
        );
    }
}
