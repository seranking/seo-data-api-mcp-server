import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ProjectListAudits extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('listAudits'),
            {
                title: 'List Audits',
                description:
                    'Project Tool: Retrieves a list of all website audits associated with your account, providing key details and statistics for each.',
                inputSchema: {
                    limit: z
                        .number()
                        .int()
                        .optional()
                        .default(100)
                        .describe('Number of audits to return. Default: 100.'),
                    offset: z
                        .number()
                        .int()
                        .optional()
                        .default(0)
                        .describe('Starting position (offset) for the list. Default: 0.'),
                    search: z
                        .string()
                        .optional()
                        .describe("Filters the list by a search term matching the audit's title or URL."),
                    date_start: z
                        .string()
                        .optional()
                        .describe('Start date for filtering audits (YYYY-MM-DD).'),
                    date_end: z
                        .string()
                        .optional()
                        .describe('End date for filtering audits (YYYY-MM-DD).'),
                },
            },
            async (params) => this.makeGetRequest('/audit/list', params),
        );
    }
}
