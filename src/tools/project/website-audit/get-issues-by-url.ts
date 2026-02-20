import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ProjectGetIssuesByUrl extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getIssuesByUrl'),
            {
                title: 'Get Issues By URL',
                description:
                    'Project Tool: Retrieves a detailed list of all issues (errors, warnings, notices) found on a specific page within an audit, including full page data.',
                inputSchema: {
                    audit_id: z.number().int().describe('Unique identifier of the audit.'),
                    url_id: z
                        .number()
                        .int()
                        .optional()
                        .describe('The unique identifier of the page, obtained from the pages endpoint.'),
                    url: z.string().optional().describe('The URL of the page.'),
                },
            },
            async ({ audit_id, ...params }: { audit_id: number; url_id?: number; url?: string }) =>
                this.makeGetRequest(`/audit/${audit_id}/issues`, params),
        );
    }
}
