import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class GetReferringSubnetsCount extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'getReferringSubnetsCount',
      {
        title: 'Get Referring Subnets Count',
        description: 'Returns the number of unique subnets/C-blocks linking to a target.',
        inputSchema: {
          target: z.string().describe('Aim of the request: root domain, host, or URL.'),
          mode: z.enum(['domain', 'host', 'url']).optional().default('host'),
        },
      },
      async (params) => this.makeGetRequest('/v1/backlinks/referring-subnets/count', params),
    );
  }
}
