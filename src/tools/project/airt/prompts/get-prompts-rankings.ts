import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../../base-tool.js';

export class GetPromptsRankings extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getPromptsRankings'),
            {
                title: 'Get Prompts Rankings',
                description: 'Project Tool: Retrieve ranking data for all prompts tracked by an LLM engine in AI Result Tracker, including positions, URLs, search volume, and organic-AI overlap.',
                inputSchema: {
                    site_id: z.number().int().describe('Site ID'),
                    llm_id: z.number().int().describe('LLM Engine ID'),
                    date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('Start date (YYYY-MM-DD format)'),
                    date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('End date (YYYY-MM-DD format)'),
                    limit: z.number().int().min(1).max(1000).optional().describe('Number of items per page (1-1000, default 100)'),
                    offset: z.number().int().min(0).optional().describe('Offset from the beginning of the list'),
                },
            },
            async (params: {
                site_id: number;
                llm_id: number;
                date_from?: string;
                date_to?: string;
                limit?: number;
                offset?: number;
            }) => {
                const { site_id, llm_id, ...queryParams } = params;
                return this.makeGetRequest(`/sites/${site_id}/airt/llm/${llm_id}/prompts/rankings`, queryParams);
            },
        );
    }
}
