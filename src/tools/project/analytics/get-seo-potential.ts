import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetSeoPotential extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getSeoPotential'),
            {
                title: 'Get SEO Potential',
                description: 'Project Tool: Assess the potential traffic volume, traffic cost, and potential number of new customers for a website.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique website ID'),
                    top_n: z.number().int().optional().describe('Calculate potential traffic volume if all queries make it to the TOP N position'),
                    lead_price: z.number().optional().describe('Estimated income from one client'),
                    conversion_rate: z.number().optional().describe('Conversion to sales rate'),
                },
            },
            async (params: { site_id: number; top_n?: number; lead_price?: number; conversion_rate?: number }) => {
                const { site_id, ...queryParams } = params;
                return this.makeGetRequest(`/analytics/${site_id}/potential/`, queryParams);
            },
        );
    }
}
