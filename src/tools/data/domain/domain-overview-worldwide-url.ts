import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

export class GetUrlOverviewWorldwide extends BaseTool {
    readonly FIELDS = ['keywords', 'traffic', 'price'];

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getUrlOverviewWorldwide'),
            {
                title: 'URL Overview Worldwide',
                description:
                    'Data Tool: Retrieves an aggregated worldwide overview of organic and paid traffic metrics for a specific URL.',
                inputSchema: {
                    url: z
                        .string()
                        .url()
                        .describe('The full URL to analyze (including protocol).'),
                    fields: z
                        .string()
                        .optional()
                        .refine((val?: string | null) => this.isValidCommaSeparatedList(this.FIELDS, val), {
                            message: 'fields must be a comma-separated list of supported metrics',
                        })
                        .describe(
                            'A comma-separated list of metrics to include in the response. Accepted values: `keywords`, `traffic`, `price`.',
                        ),
                },
            },
            async (params) => this.makeGetRequest('/v1/domain/overview/worldwide/url', params),
        );
    }
}
