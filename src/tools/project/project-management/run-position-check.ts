import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class RunPositionCheck extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('runPositionCheck'),
            {
                title: 'Run Position Check',
                description: 'Project Tool: Requires a project ID. Run a ranking position check for specified keywords or for the entire project.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    site_engine_id: z.number().int().optional().describe('Unique project search engine ID. Run check for this search engine.'),
                    keywords: z
                        .array(
                            z.object({
                                site_engine_id: z.number().int().describe('Project search engine ID'),
                                keyword_id: z.number().int().describe('Unique keyword ID'),
                            }),
                        )
                        .optional()
                        .describe('Array of specific keywords to check. If provided, site_engine_id param is ignored.'),
                },
            },
            async ({ site_id, ...params }: {
                site_id: number;
                site_engine_id?: number;
                keywords?: Array<{ site_engine_id: number; keyword_id: number }>;
            }) =>
                // POST https://api4.seranking.com/sites/{site_id}/recheck
                this.makeJsonPostRequest(`/sites/${site_id}/recheck`, params)
            ,
        );
    }
}
