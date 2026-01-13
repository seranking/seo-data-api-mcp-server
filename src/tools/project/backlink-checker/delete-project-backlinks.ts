import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class DeleteProjectBacklinks extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('deleteProjectBacklinks'),
            {
                title: 'Delete Project Backlinks',
                description: 'Project Tool: Delete a list of backlinks from the backlink monitor.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    backlink_ids: z.array(z.number().int()).describe('Array of backlink IDs to delete'),
                },
            },
            async (params: { site_id: number; backlink_ids: number[] }) => {
                const { site_id, backlink_ids } = params;
                return this.makeJsonPostRequest(`/backlinks/${site_id}/delete`, { backlink_ids });
            },
        );
    }
}
