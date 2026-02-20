import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ProjectUpdateAuditTitle extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('updateAuditTitle'),
            {
                title: 'Update Audit Title',
                description:
                    'Project Tool: Change the title of an existing website audit report.',
                inputSchema: {
                    audit_id: z.number().int().describe('Unique identifier of the audit.'),
                    title: z
                        .string()
                        .max(300)
                        .describe('The new title for the audit report. Max 300 characters.'),
                },
            },
            async (params: { audit_id: number; title: string }) => {
                const { audit_id, ...body } = params;
                return this.makeJsonPostRequest(`/audit/${audit_id}/edit`, body);
            },
        );
    }
}
