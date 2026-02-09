import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

export class GetDomainAuthorityHistogram extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getDomainAuthorityHistogram'),
      {
        title: 'Get Domain Authority Histogram',
        description:
          'Data Tool: Returns a bucketed histogram of Domain InLink Rank (Domain Authority) for referring domains linking to the target.',
        inputSchema: {
          target: z.string().describe('Aim of the request: domain, host, or URL.'),
          mode: z.enum(['domain', 'host', 'url']).optional().default('host'),
        },
      },
      async (params) => this.makeGetRequest('/v1/backlinks/authority/domain/histogram', params),
    );
  }
}
