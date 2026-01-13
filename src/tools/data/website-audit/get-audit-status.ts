import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

export class GetAuditStatus extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getAuditStatus'),
      {
        title: 'Get Audit Status',
        description:
          'Data Tool: Checks the real-time status of a specific website audit, whether it’s queued, currently processing, or already finished.',
        inputSchema: {
          audit_id: z.number().int().describe('Unique identifier of the audit to check.'),
        },
      },
      async (params) => this.makeGetRequest('/v1/site-audit/audits/status', params),
    );
  }
}
