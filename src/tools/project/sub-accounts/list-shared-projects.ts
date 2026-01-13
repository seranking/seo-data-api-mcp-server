import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ListSharedProjects extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('listSharedProjects'),
            {
                title: 'List Shared Projects',
                description: 'Project Tool: Get a list of website IDs that are shared with a sub-account.',
                inputSchema: {
                    id: z.number().int().describe('Unique sub-account ID'),
                },
            },
            async (params: { id: number }) =>
                this.makeGetRequest(`/users/${params.id}/shared-sites`, {}),
        );
    }
}
