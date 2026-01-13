import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class DeleteKeywords extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('deleteKeywords'),
            {
                title: 'Delete Keywords',
                description: 'Project Tool: Requires a project ID. Delete keywords from a project.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    keywords_ids: z.array(z.number().int()).describe('IDs of keywords to delete'),
                },
            },
            async ({ site_id, keywords_ids }: { site_id: number; keywords_ids: number[] }) => 
                // DELETE https://api4.seranking.com/sites/{site_id}/keywords?keywords_ids[]=1...
                 this.makeDeleteRequest(`/sites/${site_id}/keywords`, { keywords_ids })
            ,
        );
    }
}
