import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class AddDisavowedBacklinks extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('addDisavowedBacklinks'),
            {
                title: 'Add Disavowed Backlinks',
                description: 'Project Tool: Add a list of URLs to the disavowed backlinks list.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    list: z.array(z.string().url()).describe('Array of backlink URLs to disavow'),
                },
            },
            async (params: { site_id: number; list: string[] }) => {
                const { site_id, list } = params;
                return this.makeJsonPostRequest(`/backlink-disavow/${site_id}`, { list });
            },
        );
    }
}
