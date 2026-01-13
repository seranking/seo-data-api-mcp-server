import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';
import { MODES, OUTPUT_FORMATS } from './constants.js';

export class GetBacklinksRaw extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getBacklinksRaw'),
            {
                title: 'Fetch Backlinks in Batches',
                description:
                    'Data Tool: Returns all backlinks pointing to a target using cursor-based pagination for large datasets.',
                inputSchema: {
                    target: z
                        .string()
                        .min(1, 'target is required')
                        .describe('Target to analyze: root domain, host (subdomain), or URL.'),
                    mode: z
                        .enum(MODES)
                        .optional()
                        .default('host')
                        .describe(
                            "Scope: 'domain' (incl. subdomains), 'host' (no subdomains), or 'url' (single URL). Default: host.",
                        ),
                    limit: z
                        .number()
                        .int()
                        .positive()
                        .min(1)
                        .max(100000)
                        .optional()
                        .default(10000)
                        .describe('Max results per page (1-100,000). Default: 10,000.'),
                    next: z
                        .string()
                        .optional()
                        .describe(
                            'Cursor for the next page of results. Do NOT include for the first request.',
                        ),
                    output: z
                        .enum(OUTPUT_FORMATS)
                        .optional()
                        .default('json')
                        .describe('Response format. Default: json.'),
                    order_by: z
                        .enum(['date_found', 'first.domain_inlink_rank', 'first.inlink_rank'])
                        .optional()
                        .default('date_found')
                        .describe(
                            "Sort field: 'date_found' (most recent), 'first.domain_inlink_rank', or 'first.inlink_rank'.",
                        ),
                    per_domain: z
                        .number()
                        .int()
                        .positive()
                        .min(1)
                        .max(100)
                        .optional()
                        .describe(
                            'Number of backlinks per referring domain to return. If omitted, returns all.',
                        ),
                },
            },
            async (params) => this.makeGetRequest('/v1/backlinks/raw', params),
        );
    }
}
