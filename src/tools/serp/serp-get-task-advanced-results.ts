import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from "../base-tool.js";

export class SerpGetTaskAdvancedResults extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'serpGetTaskAdvancedResult',
      {
        title: 'Get SERP task status and advanced results',
        description:
          "Retrieve the status or advanced results of a SERP task previously added to the Add SERP tasks endpoint. If the SERP results have not yet been collected, the method returns the status.",
        inputSchema: {
          task_id: z
            .number()
            .int()
            .positive()
            .describe(
              'The unique ID of the query task from the Add SERP tasks method.',
            ),
        },
      },
      async (params) => this.makeGetRequest('/v1/serp/classic/tasks/results_advanced', params),
    );
  }
}
