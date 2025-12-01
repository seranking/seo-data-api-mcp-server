import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from "../base-tool.js";
import { MODES, OUTPUT_FORMATS } from './constants.js';

export class BacklinksSummary extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'backlinksSummary',
      {
        title: 'Backlinks Summary',
        description:
          'Retrieves a summary of backlink metrics for one or multiple targets (domains, subdomains, or URLs).',
        inputSchema: {
          target: z
            .union([
              z.string().min(1, 'target cannot be empty'),
              z.array(z.string().min(1)).min(1, 'targets array cannot be empty'),
            ])
            .describe(
              'Single target or an array of targets (root domain, host, or full URL). When omitted, it defaults to [domain, competitor] if both are provided.',
            ),
          mode: z
            .enum(MODES)
            .optional()
            .default('host')
            .describe(
              "Scope of analysis: 'domain' (*.example.com/* incl. subdomains), 'host' (www.example.com/* only), or 'url' (single URL). Default: host.",
            ),
          output: z
            .enum(OUTPUT_FORMATS)
            .optional()
            .default('json')
            .describe('Response format. Default: json.'),
        },
      },

      async (params) => this.makeGetRequest('/v1/backlinks/summary', params),
    );
  }
}
