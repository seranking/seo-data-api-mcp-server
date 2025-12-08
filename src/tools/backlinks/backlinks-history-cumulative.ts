import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class GetCumulativeBacklinksHistory extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            'getCumulativeBacklinksHistory',
            {
                title: 'Get Cumulative Backlinks History',
                description:
                    'Returns a number of live backlinks for every day within the specified date range for the specified target.',
                inputSchema: {
                    target: z.string().describe('Aim of the request: only full page URL is supported.'),
                    mode: z.enum(['domain', 'host', 'url']).optional().default('host'),
                    date_from: z.string().optional().describe('Start date in YYYY-MM-DD format (inclusive range).'),
                    date_to: z.string().optional().describe('End date in YYYY-MM-DD format (inclusive range).'),
                },
            },
            async (params) => {
                return this.makeGetRequest('/v1/backlinks/history/cumulative', params);
            },
        );
    }
}
