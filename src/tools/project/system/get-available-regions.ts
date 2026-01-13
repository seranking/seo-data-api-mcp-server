import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetAvailableRegions extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getAvailableRegions'),
            {
                title: 'Get Available Regions',
                description: 'Project Tool: Get the list of all available regions supported by Google search engine.',
                inputSchema: {
                    // No parameters required for this endpoint
                },
            },
            async () => 
                // Endpoint: GET /system/google-regions
                // Note: The curl example shows both a 'token' query param and Authorization header.
                // BaseTool handles the Authorization header automatically.
                 this.makeGetRequest('/system/google-regions', {})
            ,
        );
    }
}
