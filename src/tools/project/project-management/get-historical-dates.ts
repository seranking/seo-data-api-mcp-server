import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetHistoricalDates extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getHistoricalDates'),
            {
                title: 'Get Historical Dates',
                description: 'Project Tool: Returns standard comparison dates (e.g., yesterday, last month, etc.) available for reporting.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    site_engine_id: z.number().int().describe('Search engine ID filter'),
                },
            },
            async ({ site_id, ...params }: { site_id: number;[key: string]: any }) => 
                // GET https://api4.seranking.com/sites/{site_id}/historicalDates
                 this.makeGetRequest(`/sites/${site_id}/historicalDates`, params)
            ,
        );
    }
}
