import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../../base-tool.js';

export class GetLlmStatistics extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getLlmStatistics'),
            {
                title: 'Get LLM Statistics',
                description: 'Project Tool: Get statistics for an LLM engine in AI Result Tracker, including presence stats, AIO presence, and organic overlap.',
                inputSchema: {
                    site_id: z.number().int().describe('Site ID'),
                    id: z.number().int().describe('LLM Engine ID'),
                    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('Start date (YYYY-MM-DD format)'),
                    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('End date (YYYY-MM-DD format)'),
                    top: z.number().int().min(0).max(100).optional().describe('Top N positions to analyze (0-100, 0 = all positions)'),
                },
            },
            async (params: {
                site_id: number;
                id: number;
                from?: string;
                to?: string;
                top?: number;
            }) => {
                const { site_id, id, ...queryParams } = params;
                return this.makeGetRequest(`/sites/${site_id}/airt/llm/${id}/statistics`, queryParams);
            },
        );
    }
}
