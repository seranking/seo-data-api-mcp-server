import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class RecheckAudit extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'recheckAudit',
      {
        title: 'Recheck Audit',
        description:
          'Launches a new crawl of a previously completed audit, using the same settings.',
        inputSchema: {
          audit_id: z
            .union([z.number(), z.string()])
            .describe('Unique identifier of the audit to recheck.'),
          type: z
            .enum(['standard', 'advanced'])
            .describe('Type of the audit to recheck (Standard or Advanced).'),
        },
      },
      async (params) => {
        const { audit_id, type } = params;
        const endpoint = `/v1/site-audit/audits/recheck/${type}`;
        // makePostRequest typically sends FormData. The endpoint expects query param audit_id and likely empty body.
        // We pass { audit_id } as query params and {} as form params.
        return this.makePostRequest(endpoint, { audit_id }, {});
      },
    );
  }
}
