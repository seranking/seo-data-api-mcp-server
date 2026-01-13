import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class DeleteSubAccount extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('deleteSubAccount'),
            {
                title: 'Delete Sub-Account',
                description: 'Project Tool: Delete a user sub-account.',
                inputSchema: {
                    id: z.number().int().describe('Unique sub-account ID to delete'),
                },
            },
            async (params: { id: number }) =>
                this.makeDeleteRequest(`/users/${params.id}`, {}),
        );
    }
}
