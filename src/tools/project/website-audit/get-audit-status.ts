import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ProjectGetAuditStatus extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getAuditStatus'),
            {
                title: 'Get Audit Status',
                description:
                    'Project Tool: Check the real-time status of a specific website audit (queued, processing, finished, cancelled, expired).',
                inputSchema: {
                    audit_id: z.number().int().describe('Unique identifier of the audit.'),
                },
            },
            async (params: { audit_id: number }) =>
                this.makeGetRequest(`/audit/${params.audit_id}/`, {}),
        );
    }
}
