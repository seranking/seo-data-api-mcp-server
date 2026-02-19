import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../../base-tool.js';

export class CreateLlmEngine extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('createLlmEngine'),
            {
                title: 'Create LLM Engine',
                description: 'Project Tool: Add a new LLM engine to a site in AI Result Tracker. Site must have a brand configured first.',
                inputSchema: {
                    site_id: z.number().int().describe('Site ID'),
                    base_name: z.enum(['chatgpt', 'google_ai_overview', 'google_ai_mode', 'perplexity', 'gemini']).describe('LLM engine type'),
                    country_code: z.string().regex(/^[a-zA-Z]{2}$/).describe('Country code (ISO 3166-1 alpha-2, e.g. "us")'),
                    region_name: z.string().optional().describe('Specific region/locality name (e.g. "New York, NY, USA")'),
                    lang_code: z.string().optional().describe('Language code (ISO 639-1, e.g. "en")'),
                },
            },
            async (params: {
                site_id: number;
                base_name: string;
                country_code: string;
                region_name?: string;
                lang_code?: string;
            }) => {
                const { site_id, ...body } = params;
                return this.makeJsonPostRequest(`/sites/${site_id}/airt/llm`, body);
            },
        );
    }
}
