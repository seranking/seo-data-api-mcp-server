import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';
import { MODES, OUTPUT_FORMATS } from './constants.js';

export class GetBacklinksMetrics extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getBacklinksMetrics'),
            {
                title: 'Get Backlink Metrics',
                description:
                    'Data Tool: Returns key statistics for a target, such as the number of backlinks, referring domains, etc. Supports batch requests.',
                inputSchema: {
                    target: z
                        .union([
                            z.string().min(1, 'target cannot be empty'),
                            z.array(z.string().min(1)).min(1, 'targets array cannot be empty'),
                        ])
                        .describe(
                            'Target to analyze: root domain, host (subdomain), or URL. Can be a single string or an array of strings for batch processing.',
                        ),
                    mode: z
                        .enum(MODES)
                        .optional()
                        .default('host')
                        .describe(
                            "Scope: 'domain' (incl. subdomains), 'host' (no subdomains), or 'url' (single URL). Default: host.",
                        ),
                    output: z
                        .enum(OUTPUT_FORMATS)
                        .optional()
                        .default('json')
                        .describe('Response format. Default: json.'),
                },
            },
            async (params) => this.makeGetRequest('/v1/backlinks/metrics', params),
        );
    }
}
