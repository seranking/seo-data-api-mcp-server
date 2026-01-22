import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetCompetitorTop100 extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getCompetitorTop100'),
            {
                title: 'Get Competitor Top 100',
                description: 'Project Tool: Requires a project ID (site_id). Get a list of the top 100 results for the keywords that are tracked in a project.',
                inputSchema: {
                    site_id: z.number().describe('Unique project ID'),
                    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Date (yyyy-mm-dd)'),
                    site_engine_id: z.number().describe('Search engine ID'),
                    keyword_id: z.number().describe('The ID of the keyword added to the project'),
                    top: z.number().min(0).max(100).optional().describe('Maximum position (0..100)'),
                },
            },
            async (args: { site_id: number; date: string; site_engine_id: number; keyword_id: number; top?: number }) => {
                const { site_id, ...params } = args;
                return this.makeGetRequest(`/competitors/top100/${site_id}/`, params);
            },
        );
    }
}
