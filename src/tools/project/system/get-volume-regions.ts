import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetVolumeRegions extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getVolumeRegions'),
            {
                title: 'Get Volume Regions',
                description: 'Project Tool: Get a list of all regions where SE Ranking can run a keyword search volume check.',
                inputSchema: {},
            },
            async () => this.makeGetRequest('/system/volume-regions', {}),
        );
    }
}
