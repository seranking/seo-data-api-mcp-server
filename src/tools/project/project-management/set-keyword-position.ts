import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class SetKeywordPosition extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('setKeywordPosition'),
            {
                title: 'Set Keyword Position',
                description: 'Project Tool: Manually set position for a project\'s keyword.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    keyword_id: z.number().int().describe('Unique keyword ID'),
                    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Date for the position (YYYY-MM-DD)'),
                    site_engine_id: z.number().int().describe('Project search engine ID'),
                    position: z.number().int().min(0).max(200).describe('Position from 0 to 200 (0 means not found)'),
                },
            },
            async ({ site_id, ...params }: { site_id: number;[key: string]: any }) => 
                // PUT https://api4.seranking.com/sites/{site_id}/position/
                 this.makePutRequest(`/sites/${site_id}/position/`, params)
            ,
        );
    }
}
