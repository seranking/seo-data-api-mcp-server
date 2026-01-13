import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetAdsStats extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getAdsStats'),
            {
                title: 'Get Ads Stats',
                description: 'Project Tool: Requires a project ID. Get total number of top and bottom advertisements by day.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('Start date (YYYY-MM-DD)'),
                    date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('End date (YYYY-MM-DD)'),
                    site_engine_ids: z.array(z.number().int()).optional().describe('Filter by search engine IDs'),
                    keywords_ids: z.array(z.number().int()).optional().describe('Filter by keyword IDs'),
                },
            },
            async ({ site_id, ...params }: { site_id: number;[key: string]: any }) => this.makeGetRequest(`/sites/${site_id}/ads`, params),
        );
    }
}
