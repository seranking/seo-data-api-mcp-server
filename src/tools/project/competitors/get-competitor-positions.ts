import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetCompetitorPositions extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getCompetitorPositions'),
            {
                title: 'Get Competitor Positions',
                description: 'Project Tool: Requires a competitor ID. Get statistics on the positions of competitor keywords that were added to the project.',
                inputSchema: {
                    competitor_id: z.number().describe('Competitor ID'),
                    date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('Time period start date (yyyy-mm-dd)'),
                    date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('Time period end date (yyyy-mm-dd)'),
                    site_engine_id: z.number().optional().describe('Search engine ID. If not specified, data for all search engines will be returned.'),
                    with_serp_features: z.boolean().optional().describe('Google SERP features found in keyword search results'),
                },
            },
            async (args: { competitor_id: number; date_from?: string; date_to?: string; site_engine_id?: number; with_serp_features?: boolean }) => {
                const { competitor_id, ...params } = args;
                return this.makeGetRequest(`/competitors/${competitor_id}/positions`, params);
            },
        );
    }
}
