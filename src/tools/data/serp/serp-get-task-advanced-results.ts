import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

export class GetSerpTaskAdvancedResults extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getSerpTaskAdvancedResults'),
      {
        title: 'Get SERP task status and advanced results',
        description:
          'Data Tool: Retrieves the status or advanced results of a specific SERP task. Note that SERP tasks usually take 60 seconds to finish. If the task is still running, returns {"status": "processing"}. If complete, returns the full JSON results including "items". Returns ALL SERP item types (Maps, Reviews, AI Overview, etc.). Costs 10 credits for the 1st call.',
        inputSchema: {
          task_id: z
            .number()
            .int()
            .positive()
            .describe('The unique ID of the query task from the Add SERP tasks method.'),
        },
      },
      async (params) => this.makeGetRequest('/v1/serp/classic/tasks/results_advanced', params),
    );
  }
}
