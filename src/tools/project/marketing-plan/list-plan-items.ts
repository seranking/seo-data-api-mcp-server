import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ListPlanItems extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('listPlanItems'),
            {
                title: 'List Marketing Plan Items',
                description: 'Project Tool: Get a list of all marketing plan sections, items, and notes for a website.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                },
            },
            async (params: { site_id: number }) =>
                this.makeGetRequest(`/checklist/${params.site_id}`, {}),
        );
    }
}
