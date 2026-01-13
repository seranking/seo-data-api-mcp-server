import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

export class ExportBacklinksData extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('exportBacklinksData'),
      {
        title: 'Export Backlinks Data',
        description:
          'Data Tool: Retrieves large-scale backlinks asynchronously, returning a task ID to check status later.',
        inputSchema: {
          target: z.string().describe('Aim of the request: root domain, host, or URL.'),
          mode: z.enum(['domain', 'host', 'url']).optional().default('host'),
        },
      },
      async (params) => this.makeGetRequest('/v1/backlinks/export', params),
    );
  }
}
