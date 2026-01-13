import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class UpdateBacklinkImportSettings extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('updateBacklinkImportSettings'),
            {
                title: 'Update Backlink Import Settings',
                description: 'Project Tool: Update settings for automatic backlink import from Google Search Console.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    gsc_autoimport: z.boolean().describe('Enable or disable auto import from GSC'),
                },
            },
            async (params: { site_id: number; gsc_autoimport: boolean }) => {
                const { site_id, ...body } = params;
                return this.makePutRequest(`/backlinks/${site_id}/settings`, body);
            },
        );
    }
}
