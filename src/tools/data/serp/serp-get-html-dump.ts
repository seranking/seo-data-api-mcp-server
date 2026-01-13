import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

/**
 * GetSerpHtmlDump
 * - Calls SE Ranking SERP "Get HTML dump" endpoint: /v1/serp/classic/tasks/html
 * - Returns a ZIP file containing the raw HTML of the SERP results page.
 * - Useful for debugging or archiving the actual SERP page content.
 */
export class GetSerpHtmlDump extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getSerpHtmlDump'),
      {
        title: 'Get SERP HTML Dump',
        description:
          'Data Tool: Retrieves the raw HTML dump of a completed SERP task as a ZIP file. Returns binary ZIP data containing the SERP HTML page(s). Useful for debugging, archiving, or parsing the actual SERP page content.',
        inputSchema: {
          task_id: z
            .number()
            .int()
            .positive()
            .describe('The unique ID of the query task from the Add SERP tasks method.'),
        },
      },
      async (params) => this.makeGetRequest('/v1/serp/classic/tasks/html', params),
    );
  }
}
