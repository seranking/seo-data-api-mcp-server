import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class DeleteDisavowedBacklink extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('deleteDisavowedBacklink'),
            {
                title: 'Delete Disavowed Backlink',
                description: 'Project Tool: Remove a backlink from the disavowed backlinks list.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    disavow_link_id: z.number().int().describe('Disavowed backlink ID to delete'),
                },
            },
            async (params: { site_id: number; disavow_link_id: number }) =>
                this.makeDeleteRequest(`/backlink-disavow/${params.site_id}`, { id: params.disavow_link_id }),
        );
    }
}
