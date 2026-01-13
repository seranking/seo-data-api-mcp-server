import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

export class GetAuditReport extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getAuditReport'),
      {
        title: 'Get Audit Report',
        description:
          'Data Tool: Retrieves the full, detailed report for a completed website audit. Includes health score, domain properties, and broken down checks.',
        inputSchema: {
          audit_id: z
            .number()
            .int()
            .describe('Unique identifier of the audit for which to retrieve the report.'),
        },
      },
      async (params) => this.makeGetRequest('/v1/site-audit/audits/report', params),
    );
  }
}
