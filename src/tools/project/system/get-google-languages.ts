import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetGoogleLanguages extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getGoogleLanguages'),
            {
                title: 'Get Google Languages',
                description: 'Project Tool: Get a complete list of possible languages for the Google search engine with their codes.',
                inputSchema: {},
            },
            async () => this.makeGetRequest('/system/google-langs', {}),
        );
    }
}
