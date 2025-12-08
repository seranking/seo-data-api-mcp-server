import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class GetNewLostRefDomainsCount extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            'getNewLostRefDomainsCount',
            {
                title: 'Get New and Lost Referring Domains Count',
                description:
                    'Returns the number of referring domains, at least one backlink from which was newly found or lost in the specified date range, broken down by day.',
                inputSchema: {
                    target: z.string().describe('Aim of the request: root domain, host, or URL.'),
                    mode: z.enum(['domain', 'host', 'url']).optional().default('host'),
                    new_lost_type: z.enum(['new', 'lost', '']).optional().default('')
                        .describe('Indicates whether the count of new or lost refdomain should be returned. Empty returns both.'),
                    date_from: z.string().optional().describe('Start date in YYYY-MM-DD format.'),
                    date_to: z.string().optional().describe('End date in YYYY-MM-DD format.'),
                },
            },
            async (params) => {
                return this.makeGetRequest(
                    '/v1/backlinks/refdomains/history/count',
                    params,
                );
            },
        );
    }
}
