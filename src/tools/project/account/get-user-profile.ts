import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetUserProfile extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getUserProfile'),
            {
                title: 'Get User Profile',
                description: 'Project Tool: Get information about the currently logged in user including email, name, language, and avatar.',
                inputSchema: {},
            },
            async () => this.makeGetRequest('/account/profile', {}),
        );
    }
}
