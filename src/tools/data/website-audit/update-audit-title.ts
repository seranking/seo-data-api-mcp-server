import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

export class UpdateAuditTitle extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('updateAuditTitle'),
      {
        title: 'Update Audit Title',
        description: 'Data Tool: Changes the title of an existing website audit report.',
        inputSchema: {
          audit_id: z.number().int().describe('Unique identifier of the audit to update.'),
          title: z.string().max(300).describe('New title for the audit report.'),
        },
      },
      async (params) => {
        const { audit_id, title } = params;
        return this.makePatchRequest('/v1/site-audit/audits', { audit_id }, { title });
      },
    );
  }
}
