import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class GetPageAuthority extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            'getPageAuthority',
            {
                title: 'Get Page Authority',
                description:
                    'Returns information about the InLink Rank (Page Authority) for a target URL.',
                inputSchema: {
                    target: z.string().describe('Aim of the request: root domain, host, or URL.'),
                },
            },
            async (params) => {
                return this.makeGetRequest('/v1/backlinks/authority/page', params);
            },
        );
    }
}
