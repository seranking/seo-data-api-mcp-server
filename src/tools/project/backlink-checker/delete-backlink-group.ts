import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class DeleteBacklinkGroup extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('deleteBacklinkGroup'),
            {
                title: 'Delete Backlink Group',
                description: 'Project Tool: Delete a backlink group.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    group_id: z.number().int().describe('Backlink group ID to delete'),
                },
            },
            async (params: { site_id: number; group_id: number }) =>
                this.makeDeleteRequest(`/backlink-groups/${params.site_id}`, { id: params.group_id }),
        );
    }
}
