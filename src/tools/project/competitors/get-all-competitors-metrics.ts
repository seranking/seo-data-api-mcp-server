import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetAllCompetitorsMetrics extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getAllCompetitorsMetrics'),
            {
                title: 'Get All Competitors Metrics',
                description: 'Project Tool: Requires a project ID (site_id). Get data on the sites that were ranked in the TOP 10 for each of the tracked queries. The history is stored for 14 days.',
                inputSchema: z.object({
                    site_id: z.number().describe('Unique project ID'),
                    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Date when the list of sites from the TOP 10 was received (yyyy-mm-dd)'),
                    site_engine_id: z.number().describe('The ID of the search_engine specified in the project'),
                    group_id: z.number().optional().describe('Keyword group ID. If not specified, data for all keyword groups will be returned.'),
                    tags: z.array(z.number()).optional().describe('Array of tags'),
                }),
            },
            async (args: { site_id: number; date: string; site_engine_id: number; group_id?: number; tags?: number[] }) => {
                const { site_id, ...params } = args;
                return this.makeGetRequest(`/competitors/all/${site_id}/`, params);
            },
        );
    }
}
