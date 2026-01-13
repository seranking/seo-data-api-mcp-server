import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';
import { MODES, OUTPUT_FORMATS } from './constants.js';

export class GetNewLostBacklinksCount extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getNewLostBacklinksCount'),
            {
                title: 'Get Daily New and Lost Backlinks Count',
                description:
                    'Data Tool: Returns a number of (newly) found or lost backlinks for every day within the specified date range.',
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
                    new_lost_type: z
                        .enum(['new', 'lost', ''])
                        .optional()
                        .default('')
                        .describe(
                            "Indicates whether to count 'new', 'lost', or both (empty).",
                        ),
                    date_from: z
                        .string()
                        .optional()
                        .describe('Start date in YYYY-MM-DD format (inclusive). Default: yesterday.'),
                    date_to: z
                        .string()
                        .optional()
                        .describe('End date in YYYY-MM-DD format (inclusive). Default: today.'),
                    link_type: z
                        .enum(['href', 'redirect', ''])
                        .optional()
                        .default('')
                        .describe("Type: 'href', 'redirect', or empty (all)."),
                    anchor_type: z
                        .enum(['text', 'image', 'undefined', ''])
                        .optional()
                        .default('')
                        .describe("Anchor type: 'text', 'image', 'undefined', or empty (all)."),
                    dofollow: z
                        .enum(['dofollow', 'nofollow', 'undefined', ''])
                        .optional()
                        .default('')
                        .describe(
                            "Attribute: 'dofollow', 'nofollow', 'undefined', or empty (all).",
                        ),
                    url_from: z
                        .string()
                        .optional()
                        .describe('Filter by referring page URL (domain/subdomain).'),
                    output: z
                        .enum(OUTPUT_FORMATS)
                        .optional()
                        .default('json')
                        .describe('Response format. Default: json.'),
                },
            },
            async (params) => this.makeGetRequest('/v1/backlinks/history/count', params),
        );
    }
}
