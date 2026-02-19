import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../../base-tool.js';

export class ListLlmEngines extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('listLlmEngines'),
            {
                title: 'List LLM Engines',
                description: 'Project Tool: Get all LLM engines configured for a site in AI Result Tracker.',
                inputSchema: {
                    site_id: z.number().int().describe('Site ID'),
                },
            },
            async (params: { site_id: number }) =>
                this.makeGetRequest(`/sites/${params.site_id}/airt/llm`, {}),
        );
    }
}
