import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

export class GetReferringIps extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getReferringIps'),
      {
        title: 'Get Referring IPs',
        description:
          'Data Tool: Returns information about IPv4 addresses that belong to backlinks that point to a target.',
        inputSchema: {
          target: z.string().describe('Aim of the request: root domain, host, or URL.'),
          mode: z.enum(['domain', 'host', 'url']).optional().default('host'),
          order_by: z.enum(['backlinks', 'refdomains']).optional().default('backlinks'),
          limit: z.number().int().min(1).max(10000).optional().default(100),
        },
      },
      async (params) => this.makeGetRequest('/v1/backlinks/referring-ips', params),
    );
  }
}
