import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../../base-tool.js';

export class SaveSiteBrand extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('saveSiteBrand'),
            {
                title: 'Save Site Brand',
                description: 'Project Tool: Configure brand for a site in AI Result Tracker. Overwrites existing brand. Brand is shared across all AI search engines.',
                inputSchema: {
                    site_id: z.number().int().describe('Site ID'),
                    brand: z.string().min(1).max(255).describe('Brand name to save (non-empty, max 255 characters)'),
                },
            },
            async (params: { site_id: number; brand: string }) =>
                this.makeJsonPostRequest(`/sites/${params.site_id}/airt/brands`, { brand: params.brand }),
        );
    }
}
