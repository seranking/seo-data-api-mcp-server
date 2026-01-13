import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class CreateProjectGroup extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('createProjectGroup'),
            {
                title: 'Create Project Group',
                description: 'Project Tool: Requires a project ID. Add a new project group to a user account.',
                inputSchema: {
                    name: z.string().min(1).describe('Name of the project group to be added'),
                },
            },
            async (params: { name: string }) => this.makeJsonPostRequest('/site-groups', params),
        );
    }
}
