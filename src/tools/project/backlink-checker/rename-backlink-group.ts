import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class RenameBacklinkGroup extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('renameBacklinkGroup'),
            {
                title: 'Rename Backlink Group',
                description: 'Project Tool: Change the name of a backlink group.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    group_id: z.number().int().describe('Backlink group ID to rename'),
                    name: z.string().describe('New name for the backlink group'),
                },
            },
            async (params: { site_id: number; group_id: number; name: string }) => {
                const { site_id, group_id, name } = params;
                return this.makePutRequest(`/backlink-groups/${site_id}`, { id: group_id, name });
            },
        );
    }
}
