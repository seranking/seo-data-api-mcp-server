import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class DeleteAudit extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            'deleteAudit',
            {
                title: 'Delete Audit',
                description:
                    'Permanently deletes a specified website audit report and all of its associated data.',
                inputSchema: {
                    audit_id: z.number().int().describe('Unique identifier of the audit to delete.'),
                },
            },
            async (params) => {
                return this.makeDeleteRequest('/v1/site-audit/audits', params);
            },
        );
    }
}
