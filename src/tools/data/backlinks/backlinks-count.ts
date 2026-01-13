import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';
import { MODES, OUTPUT_FORMATS } from './constants.js';

export class GetBacklinksCount extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getBacklinksCount'),
            {
                title: 'Get Total Backlinks Count',
                description:
                    'Data Tool: Returns the total number of backlinks for the target. Supports batch requests.',
                inputSchema: {
                    target: z
                        .union([
                            z.string().min(1, 'target cannot be empty'),
                            z.array(z.string().min(1)).min(1, 'targets array cannot be empty'),
                        ])
                        .describe(
                            'Target to analyze: root domain, host (subdomain), or URL. Can be a single string or an array.',
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
            async (params) => this.makeGetRequest('/v1/backlinks/count', params),
        );
    }
}
