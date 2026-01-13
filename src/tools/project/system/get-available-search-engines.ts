import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetAvailableSearchEngines extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getAvailableSearchEngines'),
            {
                title: 'Get Available Search Engines',
                description: 'Project Tool: Get the list of all available search engines supported by the system.',
                inputSchema: {
                    // No parameters required for this endpoint
                },
            },
            async () => 
                // Endpoint: GET /system/search-engines
                 this.makeGetRequest('/system/search-engines', {})
            ,
        );
    }
}
