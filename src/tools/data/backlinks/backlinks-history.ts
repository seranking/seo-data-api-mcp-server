import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';
import { MODES, OUTPUT_FORMATS } from './constants.js';

export class ListNewLostBacklinks extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('listNewLostBacklinks'),
            {
                title: 'List New and Lost Backlinks',
                description:
                    'Data Tool: Returns a list of backlinks (newly) found or lost within the specified date range for the specified target.',
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
                        .describe("Filter: 'new', 'lost', or empty (both)."),
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
                        .describe("Type: 'href' (standard), 'redirect', or empty (all)."),
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
                    limit: z
                        .number()
                        .int()
                        .positive()
                        .min(1)
                        .max(10000)
                        .optional()
                        .default(100)
                        .describe('Max results (1-10,000). Default: 100.'),
                    order_by: z
                        .enum(['new_lost_date', 'domain_inlink_rank', 'inlink_rank'])
                        .optional()
                        .default('new_lost_date')
                        .describe(
                            "Sort by: 'new_lost_date' (recency), 'domain_inlink_rank', or 'inlink_rank'.",
                        ),
                    output: z
                        .enum(OUTPUT_FORMATS)
                        .optional()
                        .default('json')
                        .describe('Response format. Default: json.'),
                },
            },
            async (params) => this.makeGetRequest('/v1/backlinks/history', params),
        );
    }
}
