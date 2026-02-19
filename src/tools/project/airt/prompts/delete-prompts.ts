import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../../base-tool.js';

export class DeletePrompts extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('deletePrompts'),
            {
                title: 'Delete Prompts',
                description: 'Project Tool: Delete prompts (keywords) from a specific LLM engine in AI Result Tracker by their k2site_llm_id.',
                inputSchema: {
                    site_id: z.number().int().describe('Site ID'),
                    llm_id: z.number().int().describe('LLM Engine ID'),
                    k2site_llm_ids: z.array(z.number().int()).min(1).describe('Array of k2site_llm_id values to delete'),
                },
            },
            async (params: { site_id: number; llm_id: number; k2site_llm_ids: number[] }) =>
                this.makeJsonDeleteRequest(`/sites/${params.site_id}/airt/llm/${params.llm_id}/prompts`, { k2site_llm_ids: params.k2site_llm_ids }),
        );
    }
}
