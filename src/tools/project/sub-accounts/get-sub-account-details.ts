import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetSubAccountDetails extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getSubAccountDetails'),
            {
                title: 'Get Sub-Account Details',
                description: 'Project Tool: Get extended information about a sub-account including settings, access permissions, and limits.',
                inputSchema: {
                    id: z.number().int().describe('Unique sub-account ID'),
                },
            },
            async (params: { id: number }) =>
                this.makeGetRequest(`/users/${params.id}`, {}),
        );
    }
}
