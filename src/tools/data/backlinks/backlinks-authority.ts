import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';
import { OUTPUT_FORMATS } from './constants.js';

export class GetBacklinksAuthority extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getBacklinksAuthority'),
      {
        title: 'Backlinks Authority',
        description:
          'Data Tool: Fetch authority metrics for a target (domain, host or URL) (v1/backlinks/authority)',
        inputSchema: {
          target: z
            .string()
            .min(1, 'target is required')
            .describe('Target to assess authority: root domain, host (subdomain), or full URL.'),
          output: z
            .enum(OUTPUT_FORMATS)
            .optional()
            .default('json')
            .describe('Response format. Default: json.'),
        },
      },
      async (params) => this.makeGetRequest('/v1/backlinks/authority', params),
    );
  }
}
