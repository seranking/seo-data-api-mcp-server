import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetSummary extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getSummary'),
            {
                title: 'Get Summary',
                description: "Project Tool: Requires a project ID. Get a project's summary statistics.",
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                },
            },
            async ({ site_id }: { site_id: number }) => this.makeGetRequest(`/sites/${site_id}/stat`, {}),
        );
    }
}
