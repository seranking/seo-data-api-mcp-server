import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class AddPlanTask extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('addPlanTask'),
            {
                title: 'Add Marketing Plan Task',
                description: 'Project Tool: Add a new task to the marketing plan for a website.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    title: z.string().describe('Task title/name'),
                    text: z.string().describe('Task description'),
                    for_all: z.boolean().optional().describe('Apply task to all projects'),
                },
            },
            async (params: { site_id: number; title: string; text: string; for_all?: boolean }) => {
                const { site_id, ...body } = params;
                return this.makeJsonPostRequest(`/checklist/${site_id}/task`, body);
            },
        );
    }
}
