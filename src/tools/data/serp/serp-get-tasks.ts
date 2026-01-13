import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { BaseTool } from '../../base-tool.js';

export class GetSerpTasks extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getSerpTasks'),
      {
        title: 'List SERP tasks',
        description: 'Data Tool: Retrieves a list of all SERP tasks added to the queue in the last 24 hours.',
        inputSchema: {},
      },
      async (params) => this.makeGetRequest('/v1/serp/classic/tasks', params),
    );
  }
}
