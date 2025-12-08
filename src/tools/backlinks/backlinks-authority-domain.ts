import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class GetDomainAuthority extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'getDomainAuthority',
      {
        title: 'Get Domain Authority',
        description:
          'Returns information about the domain InLink Rank (Domain Authority) of the target page’s root domain.',
        inputSchema: {
          target: z.string().describe('Aim of the request: root domain, host, or URL.'),
        },
      },
      async (params) => this.makeGetRequest('/v1/backlinks/authority/domain', params),
    );
  }
}
