import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ProjectGetAuditPagesByIssue extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getAuditPagesByIssue'),
            {
                title: 'Get Audit Pages By Issue',
                description:
                    'Project Tool: Retrieves a paginated list of all URLs affected by a specific issue within a given audit. Use the issue code from the audit report.',
                inputSchema: {
                    audit_id: z.number().int().describe('Unique identifier of the audit.'),
                    code: z
                        .string()
                        .describe('The unique code for the issue (e.g., title_duplicate, http4xx).'),
                    limit: z
                        .number()
                        .int()
                        .optional()
                        .default(100)
                        .describe('Number of URLs to return. Default: 100.'),
                    offset: z
                        .number()
                        .int()
                        .optional()
                        .default(0)
                        .describe('Starting position for the list. Default: 0.'),
                },
            },
            async ({ audit_id, ...params }: { audit_id: number; code: string; limit?: number; offset?: number }) =>
                this.makeGetRequest(`/audit/${audit_id}/links`, params),
        );
    }
}
