import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class RunBacklinkGscImport extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('runBacklinkGscImport'),
            {
                title: 'Run Backlink GSC Import',
                description: 'Project Tool: Start a backlink import from Google Search Console. Returns a token to check import status.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                },
            },
            async (params: { site_id: number }) =>
                this.makeJsonPostRequest(`/backlinks/${params.site_id}/import-gsc`, {}),
        );
    }
}
