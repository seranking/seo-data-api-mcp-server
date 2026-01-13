import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ListProjects extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('listProjects'),
            {
                title: 'List Projects',
                description: 'Project Tool: Requires a project ID. Get a list of all user projects.',
                inputSchema: {},
            },
            async () => this.makeGetRequest('/sites', {}),
        );
    }
}
