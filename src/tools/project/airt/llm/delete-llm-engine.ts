import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../../base-tool.js';

export class DeleteLlmEngine extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('deleteLlmEngine'),
            {
                title: 'Delete LLM Engine',
                description: 'Project Tool: Remove an LLM engine from a site in AI Result Tracker.',
                inputSchema: {
                    site_id: z.number().int().describe('Site ID'),
                    id: z.number().int().describe('LLM Engine ID'),
                },
            },
            async (params: { site_id: number; id: number }) =>
                this.makeDeleteRequest(`/sites/${params.site_id}/airt/llm/${params.id}`, {}),
        );
    }
}
