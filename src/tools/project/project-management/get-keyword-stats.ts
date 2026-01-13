import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetKeywordStats extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getKeywordStats'),
            {
                title: 'Get Keyword Stats',
                description: 'Project Tool: Requires a project ID. Get keyword ranking statistics for a specified time period.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('Start date (YYYY-MM-DD)'),
                    date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('End date (YYYY-MM-DD)'),
                    site_engine_id: z.number().int().optional().describe('Search engine ID filter'),
                    in_top: z.number().int().optional().describe('Filter by top position (e.g. 10 for TOP 10)'),
                    with_landing_pages: z.enum(['0', '1']).optional().describe('Include URL info (1)'),
                    with_serp_features: z.enum(['0', '1']).optional().describe('Include SERP features (1)'),
                },
            },
            async ({ site_id, ...params }: { site_id: number;[key: string]: any }) => this.makeGetRequest(`/sites/${site_id}/positions`, params),
        );
    }
}
