import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../../base-tool.js';

export class AddPrompts extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('addPrompts'),
            {
                title: 'Add Prompts',
                description: 'Project Tool: Add new prompts (keywords) to a specific LLM engine in AI Result Tracker. Duplicates are automatically skipped.',
                inputSchema: {
                    site_id: z.number().int().describe('Site ID'),
                    llm_id: z.number().int().describe('LLM Engine ID'),
                    prompts: z.array(z.string().min(1).max(255)).min(1).describe('Array of keyword strings to add (each max 255 characters)'),
                },
            },
            async (params: { site_id: number; llm_id: number; prompts: string[] }) =>
                this.makeJsonPostRequest(`/sites/${params.site_id}/airt/llm/${params.llm_id}/prompts`, { prompts: params.prompts }),
        );
    }
}
