import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class AddKeywords extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('addKeywords'),
            {
                title: 'Add Keywords',
                description: 'Project Tool: Requires a project ID. Add new keywords to a project.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    keywords: z
                        .array(
                            z.object({
                                keyword: z.string(),
                                group_id: z.number().int().optional(),
                                target_url: z.string().optional(),
                                is_strict: z.literal(0).or(z.literal(1)).optional(),
                                comment: z.string().optional(),
                                site_engine_ids: z.array(z.number().int()).optional(),
                            }),
                        )
                        .describe('List of keywords to add'),
                },
            },
            async ({ site_id, keywords }: { site_id: number; keywords: Array<{
                keyword: string;
                group_id?: number;
                target_url?: string;
                is_strict?: 0 | 1;
                comment?: string;
                site_engine_ids?: number[];
            }> }) =>
                // POST https://api4.seranking.com/sites/{site_id}/keywords
                // Body is array of keywords
                this.makeJsonPostRequest(`/sites/${site_id}/keywords`, keywords)
            ,
        );
    }
}
