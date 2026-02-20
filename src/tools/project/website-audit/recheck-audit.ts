import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ProjectRecheckAudit extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('recheckAudit'),
            {
                title: 'Recheck Audit',
                description:
                    'Project Tool: Initiates a new crawl for a previously completed audit using the same settings. Consumes the same credits as creating a new audit.',
                inputSchema: {
                    audit_id: z.number().int().describe('Unique identifier of the audit to recheck.'),
                },
            },
            async (params: { audit_id: number }) =>
                this.makeJsonPostRequest(`/audit/${params.audit_id}/recheck`, {}),
        );
    }
}
