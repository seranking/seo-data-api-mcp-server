import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class GetCrawledPages extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            'getCrawledPages',
            {
                title: 'Get Crawled Pages',
                description:
                    'Returns a paginated list of all URLs found during an audit, providing a complete sitemap as discovered by the crawler.',
                inputSchema: {
                    audit_id: z.number().int().describe('Unique identifier of the audit report.'),
                    limit: z.number().int().optional().default(100).describe('Number of pages to return in the list.'),
                    offset: z.number().int().optional().default(0).describe('Starting position for the list of pages.'),
                },
            },
            async (params) => {
                return this.makeGetRequest('/v1/site-audit/audits/pages', params);
            },
        );
    }
}
