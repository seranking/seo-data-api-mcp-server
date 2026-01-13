import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ListSubAccounts extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('listSubAccounts'),
            {
                title: 'List Sub-Accounts',
                description: 'Project Tool: Get a list of all sub-accounts of the current user.',
                inputSchema: {
                    limit: z.number().int().optional().describe('Display limit per page, default 100'),
                    offset: z.number().int().optional().describe('Selection offset'),
                },
            },
            async (params: { limit?: number; offset?: number }) =>
                this.makeGetRequest('/users', params),
        );
    }
}
