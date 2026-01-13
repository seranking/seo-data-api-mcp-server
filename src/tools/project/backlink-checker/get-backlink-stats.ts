import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetBacklinkStats extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getBacklinkStats'),
            {
                title: 'Get Backlink Statistics',
                description: 'Project Tool: Get backlink statistics for a website including total count, anchors, IPs, domains, dofollow/nofollow counts.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                },
            },
            async (params: { site_id: number }) =>
                this.makeGetRequest(`/backlinks/${params.site_id}/stat`, {}),
        );
    }
}
