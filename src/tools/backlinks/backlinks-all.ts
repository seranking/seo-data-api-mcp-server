import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from "../base-tool.js";
import { MODES, OUTPUT_FORMATS, URL_FILTER_MODES } from './constants.js';

export class BacklinksAll extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'backlinksAll',
      {
        title: 'Backlinks All',
        description:
          'Retrieves a comprehensive list of backlinks for the specified target, with extensive filtering and sorting options.',
        inputSchema: {
          target: z
            .string()
            .min(1, 'target is required')
            .describe('Target to analyze: root domain, host (subdomain), or full URL.'),
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
            .max(10000)
            .optional()
            .default(100)
            .describe('Max results to return (1–10,000). Default: 100.'),
          per_domain: z
            .number()
            .int()
            .positive()
            .min(1)
            .max(100)
            .optional()
            .describe(
              'Number of backlinks per referring domain to return. If omitted, returns all backlinks (may exceed 100).',
            ),
          output: z
            .enum(OUTPUT_FORMATS)
            .optional()
            .default('json')
            .describe('Response format. Default: json.'),
          order_by: z
            .enum(['date_found', 'domain_inlink_rank', 'inlink_rank'])
            .optional()
            .default('date_found')
            .describe(
              "Sort field: 'date_found' (most recent first), 'domain_inlink_rank', or 'inlink_rank'.",
            ),
          inlink_rank_from: z
            .number()
            .int()
            .positive()
            .min(0)
            .max(100)
            .optional()
            .describe('Min InLink Rank filter (0–100).'),
          inlink_rank_to: z
            .number()
            .int()
            .positive()
            .min(0)
            .max(100)
            .optional()
            .describe('Max InLink Rank filter (0–100).'),
          domain_inlink_rank_from: z
            .number()
            .int()
            .positive()
            .min(0)
            .max(100)
            .optional()
            .describe('Min Domain InLink Rank filter (0–100).'),
          domain_inlink_rank_to: z
            .number()
            .int()
            .positive()
            .min(0)
            .max(100)
            .optional()
            .describe('Max Domain InLink Rank filter (0–100).'),
          url_from_filter: z
            .string()
            .max(2063)
            .optional()
            .describe("Substring to filter 'url_from' by (ASCII, max 2063 chars)."),
          url_from_filter_mode: z
            .enum(URL_FILTER_MODES)
            .optional()
            .default('contains')
            .describe("How to match 'url_from_filter'. Default: contains."),
          url_to_filter: z
            .string()
            .max(2063)
            .optional()
            .describe("Substring to filter 'url_to' by (ASCII, max 2063 chars)."),
          url_to_filter_mode: z
            .enum(URL_FILTER_MODES)
            .optional()
            .default('contains')
            .describe("How to match 'url_to_filter'. Default: contains."),
          anchor_filter: z
            .string()
            .max(2063)
            .optional()
            .describe("Substring to filter 'anchor' by (ASCII, max 2063 chars)."),
          anchor_filter_mode: z
            .enum(URL_FILTER_MODES)
            .optional()
            .default('contains')
            .describe("How to match 'anchor_filter'. Default: contains."),
          nofollow_filter: z
            .enum(['nofollow_only', 'dofollow_only'])
            .optional()
            .describe(
              "Backlink type filter: 'nofollow_only' or 'dofollow_only'. If omitted, returns all.",
            ),
        },
      },
      async (params) => this.makeGetRequest('/v1/backlinks/all', params),
    );
  }
}
