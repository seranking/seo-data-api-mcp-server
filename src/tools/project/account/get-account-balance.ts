import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { ApiType, BaseTool } from '../../base-tool.js';

export class GetAccountBalance extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getAccountBalance'),
            {
                title: 'Get Account Balance',
                description: 'Project Tool: Get the current account balance including currency and currency code.',
                inputSchema: {},
            },
            async () => this.makeGetRequest('/account/balance', {}),
        );
    }
}
