import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class GetDistributionOfDomainAuthority extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            'getDistributionOfDomainAuthority',
            {
                title: 'Get Distribution of Domain Authority',
                description:
                    'Returns information about the distribution of Domain InLink Rank (Domain Authority) of all the domains that reference a specific target.',
                inputSchema: {
                    target: z.string().describe('Aim of the request: root domain, host, or URL.'),
                    mode: z.enum(['domain', 'host', 'url']).optional().default('host'),
                    histogramMode: z.enum(['domain', 'host']).optional().default('host')
                        .describe('Mode of aggregation: domain (unique domains) or host (unique hosts).'),
                },
            },
            async (params) => {
                return this.makeGetRequest(
                    '/v1/backlinks/authority/domain/distribution',
                    params,
                );
            },
        );
    }
}
