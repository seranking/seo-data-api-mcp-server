import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class UpdateProject extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('updateProject'),
            {
                title: 'Update Project',
                description: 'Project Tool: Requires a project ID. Change/update project settings.',
                inputSchema: {
                    site_id: z.number().int().describe('Unique site ID'),
                    title: z.string().optional().describe('Project name'),
                    url: z.string().optional().describe('Website URL'), // Docs say url is updatable? "url Website URL" in params list.
                    depth: z.enum(['100', '200']).optional().describe('Ranking position collection depth'),
                    subdomain_match: z.enum(['0', '1']).optional().describe('Take subdomains in SERPs into account'),
                    exact_url: z.enum(['0', '1']).optional().describe('Exact URL?'),
                    check_freq: z
                        .enum(['check_daily', 'check_1in3', 'check_weekly', 'check_monthly', 'manual'])
                        .optional(),
                    site_group_id: z.number().int().optional().describe('ID of the group'),
                    check_day: z.number().int().optional().describe('Day of week (1-7) or day of month (1-31)'),
                    is_active: z.enum(['0', '1']).optional().describe('Project status 1 – active, 0 – delayed'),
                },
            },
            async ({ site_id, ...params }: {
                site_id: number;
                title?: string;
                url?: string;
                depth?: '100' | '200';
                subdomain_match?: '0' | '1';
                exact_url?: '0' | '1';
                check_freq?: 'check_daily' | 'check_1in3' | 'check_weekly' | 'check_monthly' | 'manual';
                site_group_id?: number;
                check_day?: number;
                is_active?: '0' | '1';
            }) =>
                // PUT https://api4.seranking.com/sites/{site_id}
                // Body: {"title":"new site title"}
                this.makeJsonRequestWithPut(`/sites/${site_id}`, params)
            ,
        );
    }

    protected async makeJsonRequestWithPut(path: string, body: Record<string, unknown>) {
        return this.request(path, 'PUT', body);
    }
}
