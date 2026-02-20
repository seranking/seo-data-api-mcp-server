import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ProjectGetFoundLinks extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getFoundLinks'),
            {
                title: 'Get Found Links',
                description:
                    'Project Tool: Returns a paginated list of every hyperlink discovered across the entire site during the audit. Supports advanced filtering.',
                inputSchema: {
                    audit_id: z.number().int().describe('Unique identifier of the audit.'),
                    page_type: z
                        .enum(['internal', 'external', 'all'])
                        .optional()
                        .default('all')
                        .describe('Filters links by type. Default: all.'),
                    limit: z.number().int().optional().describe('Number of links to return.'),
                    offset: z.number().int().optional().describe('Starting position for the list.'),
                    filter: z
                        .array(
                            z.object({
                                param: z
                                    .string()
                                    .describe('Field to filter on (status, type, source_noindex, nofollow, anchor_type).'),
                                value: z.union([z.string(), z.number()]).describe('The value to match.'),
                                type: z
                                    .enum(['and', 'or'])
                                    .optional()
                                    .describe('Logical operator to connect to the previous condition. Required for 2nd filter onwards.'),
                            }),
                        )
                        .optional()
                        .describe('Array of filter objects to build complex queries.'),
                },
            },
            async (params: {
                audit_id: number;
                page_type?: string;
                limit?: number;
                offset?: number;
                filter?: Array<{ param: string; value: string | number; type?: string }>;
            }) => {
                const { audit_id, filter, ...rest } = params;
                const queryParams: Record<string, unknown> = { ...rest };

                if (filter) {
                    filter.forEach((f, index) => {
                        queryParams[`filter[${index}][param]`] = f.param;
                        queryParams[`filter[${index}][value]`] = f.value;
                        if (f.type) {
                            queryParams[`filter[${index}][type]`] = f.type;
                        }
                    });
                }

                return this.makeGetRequest(`/audit/${audit_id}/foundlinks`, queryParams);
            },
        );
    }
}
