import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ListBacklinkGroups extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('listBacklinkGroups'),
            {
                title: 'List Backlink Groups',
                description: 'Project Tool: Get a list and count of backlink groups for a website.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                },
            },
            async (params: { site_id: number }) =>
                this.makeGetRequest(`/backlink-groups/${params.site_id}`, {}),
        );
    }
}
