import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from "../base-tool.js";

export class SerpGetTasks extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'serpGetTasks',
      {
        title: 'List SERP tasks',
        description:
          'Retrieves a list of all SERP tasks added to the queue in the last 24 hours.',
        inputSchema: {
        },
      },
      async (params) => this.makeGetRequest('/v1/serp/classic/tasks', params),
    );
  }
}
