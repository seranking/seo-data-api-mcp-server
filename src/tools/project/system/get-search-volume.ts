import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetSearchVolume extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getSearchVolume'),
            {
                title: 'Get Search Volume',
                description: 'Project Tool: Get search volume data for a specified region and keyword list (max 10 keywords per request).',
                inputSchema: {
                    region_id: z.number().int().describe('Region ID (use getVolumeRegions to get available regions)'),
                    keywords: z.array(z.string()).max(10).describe('Array of keywords (max 10)'),
                },
            },
            async (params: { region_id: number; keywords: string[] }) => {
                const queryParams: Record<string, unknown> = {
                    regionid: params.region_id,
                    'keyword[]': params.keywords,
                };
                return this.makeGetRequest('/system/volume', queryParams);
            },
        );
    }
}
