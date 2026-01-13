import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetBacklinkGscImportStatus extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getBacklinkGscImportStatus'),
            {
                title: 'Get Backlink GSC Import Status',
                description: 'Project Tool: Get the status of a backlink import from Google Search Console.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    token: z.string().describe('Import task token obtained from runBacklinkGscImport'),
                },
            },
            async (params: { site_id: number; token: string }) => {
                const { site_id, token } = params;
                return this.makeGetRequest(`/backlinks/${site_id}/import-gsc`, { token });
            },
        );
    }
}
