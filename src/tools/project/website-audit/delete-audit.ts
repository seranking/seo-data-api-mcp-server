import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ProjectDeleteAudit extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('deleteAudit'),
            {
                title: 'Delete Audit',
                description:
                    'Project Tool: Permanently deletes a website audit report and all associated data. This action cannot be undone.',
                inputSchema: {
                    audit_id: z.number().int().describe('Unique identifier of the audit to delete.'),
                },
            },
            async (params: { audit_id: number }) =>
                this.makeJsonPostRequest(`/audit/${params.audit_id}/delete`, {}),
        );
    }
}
