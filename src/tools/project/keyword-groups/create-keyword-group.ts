import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class CreateKeywordGroup extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('createKeywordGroup'),
            {
                title: 'Create Keyword Group',
                description: 'Project Tool: Requires a project ID. Add a group for project keywords.',
                inputSchema: {
                    name: z.string().min(1).describe('Name of the project keyword group to be added'),
                    site_id: z.number().int().describe('ID of the project to which a keyword group will be added'),
                },
            },
            async (params: { name: string; site_id: number }) => 
                // POST https://api4.seranking.com/keyword-groups
                // Body: {"name": "groupname", "site_id": 1}
                 this.makeJsonPostRequest('/keyword-groups', params)
            ,
        );
    }
}
