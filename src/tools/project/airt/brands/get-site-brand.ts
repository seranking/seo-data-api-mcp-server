import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../../base-tool.js';

export class GetSiteBrand extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getSiteBrand'),
            {
                title: 'Get Site Brand',
                description: 'Project Tool: Retrieve the brand configured for a site in AI Result Tracker.',
                inputSchema: {
                    site_id: z.number().int().describe('Site ID'),
                },
            },
            async (params: { site_id: number }) =>
                this.makeGetRequest(`/sites/${params.site_id}/airt/brands`, {}),
        );
    }
}
