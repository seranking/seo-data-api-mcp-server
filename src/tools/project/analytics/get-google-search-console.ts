import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetGoogleSearchConsole extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getGoogleSearchConsole'),
            {
                title: 'Get Google Search Console Data',
                description: 'Project Tool: Get popular queries from Google Search Console for a website.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                },
            },
            async (params: { site_id: number }) =>
                this.makeGetRequest(`/analytics/${params.site_id}/google/`, {}),
        );
    }
}
