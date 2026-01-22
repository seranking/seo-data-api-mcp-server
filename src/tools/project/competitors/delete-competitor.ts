import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class DeleteCompetitor extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('deleteCompetitor'),
            {
                title: 'Delete Competitor',
                description: 'Project Tool: Requires a competitor ID. Remove a competitor website from a user project.',
                inputSchema: {
                    competitor_id: z.number().describe('Incorrect competitor id'),
                },
            },
            async (args: { competitor_id: number }) => this.makeDeleteRequest(`/competitors/${args.competitor_id}`, {}),
        );
    }
}
