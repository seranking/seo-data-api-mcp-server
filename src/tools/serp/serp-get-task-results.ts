import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class GetSerpTaskResults extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'getSerpTaskResults',
      {
        title: 'Get SERP task status and results',
        description:
          'Retrieves the status or standard results of a specific SERP task. Note that SERP tasks usually take 60 seconds to finish. If the task is still running, returns {"status": "processing"}. If complete, returns the full JSON results including "items". This endpoint provides results for the following SERP item types only: organic, ads, and featured_snippet.',
        inputSchema: {
          task_id: z
            .number()
            .int()
            .positive()
            .describe('The unique ID of the query task from the Add SERP tasks method.'),
        },
      },
      async (params) => this.makeGetRequest('/v1/serp/classic/tasks', params),
    );
  }
}
