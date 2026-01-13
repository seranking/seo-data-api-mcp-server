import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ImportProjectBacklinks extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('importProjectBacklinks'),
            {
                title: 'Import Project Backlinks',
                description: 'Project Tool: Import a list of backlinks to the backlink monitor for a website.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    list: z.array(z.string().url()).describe('Array of backlink URLs'),
                    group_id: z.number().int().optional().describe('Backlink group ID'),
                    price: z.number().optional().describe('Price for all backlinks'),
                    currency: z.string().optional().describe('Currency code ISO 4217 (USD, CAD, AUD, etc.)'),
                    manager: z.string().optional().describe('Manager name'),
                    charge_period: z.enum(['onetime', 'monthly', 'quarterly', '6months', 'year']).optional().describe('Charging period'),
                    charge_start: z.string().optional().describe('Payment start date (YYYY-MM-DD)'),
                },
            },
            async (params: {
                site_id: number;
                list: string[];
                group_id?: number;
                price?: number;
                currency?: string;
                manager?: string;
                charge_period?: string;
                charge_start?: string;
            }) => {
                const { site_id, ...body } = params;
                return this.makeJsonPostRequest(`/backlinks/${site_id}/list`, body);
            },
        );
    }
}
