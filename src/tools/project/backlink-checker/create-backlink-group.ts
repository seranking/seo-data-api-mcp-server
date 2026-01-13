import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class CreateBacklinkGroup extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('createBacklinkGroup'),
            {
                title: 'Create Backlink Group',
                description: 'Project Tool: Create a new group for organizing backlinks.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    name: z.string().describe('Name for the new backlink group'),
                },
            },
            async (params: { site_id: number; name: string }) => {
                const { site_id, name } = params;
                return this.makeJsonPostRequest(`/backlink-groups/${site_id}`, { name });
            },
        );
    }
}
