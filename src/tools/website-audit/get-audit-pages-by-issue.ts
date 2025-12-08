import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class GetAuditPagesByIssue extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            'getAuditPagesByIssue',
            {
                title: 'Get Audit Pages By Issue',
                description:
                    'Retrieves a paginated list of all URLs affected by a specific issue within a given audit.',
                inputSchema: {
                    audit_id: z.number().int().describe('Unique identifier of the audit report.'),
                    code: z.string().describe('Unique code for the issue (e.g., title_duplicate).'),
                    limit: z.number().int().optional().default(100).describe('Number of URLs to return in the list.'),
                    offset: z.number().int().optional().default(0).describe('Starting position (offset) for the list of URLs.'),
                },
            },
            async (params) => {
                return this.makeGetRequest('/v1/site-audit/audits/issue-pages', params);
            },
        );
    }
}
