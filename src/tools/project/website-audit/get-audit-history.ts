import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ProjectGetAuditHistory extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getAuditHistory'),
            {
                title: 'Get Audit History',
                description:
                    'Project Tool: Retrieves a historical snapshot of a specific audit run by date, including settings used, domain data, and a summary of all issues found.',
                inputSchema: {
                    audit_id: z.number().int().describe('Unique identifier of the audit.'),
                    date: z
                        .string()
                        .regex(/^\d{4}-\d{2}-\d{2}$/)
                        .describe('The specific date of the historical audit to retrieve (YYYY-MM-DD).'),
                },
            },
            async ({ audit_id, ...params }: { audit_id: number; date: string }) =>
                this.makeGetRequest(`/audit/${audit_id}/history`, params),
        );
    }
}
