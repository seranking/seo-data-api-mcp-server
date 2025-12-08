import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class GetAuditHistory extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'getAuditHistory',
      {
        title: 'Get Audit History',
        description:
          'Retrieves a historical snapshot of a specific audit run, providing the full context of that audit.',
        inputSchema: {
          audit_id: z.number().int().describe('Unique identifier of the audit.'),
          date: z
            .string()
            .describe('Specific date of the historical audit to retrieve (YYYY-MM-DD).'),
        },
      },
      async (params) => this.makeGetRequest('/v1/site-audit/audits/history', params),
    );
  }
}
