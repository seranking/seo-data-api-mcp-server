import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ListProjectGroups extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('listProjectGroups'),
            {
                title: 'List Project Groups',
                description: 'Project Tool: Requires a project ID. Get a list of all project groups from a user account.',
                inputSchema: {},
            },
            async () => this.makeGetRequest('/site-groups', {}),
        );
    }
}
