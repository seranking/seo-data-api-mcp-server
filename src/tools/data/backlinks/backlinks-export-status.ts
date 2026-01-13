import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

export class GetBacklinksExportStatus extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getBacklinksExportStatus'),
      {
        title: 'Get Backlinks Export Status',
        description:
          'Data Tool: Checks the status of an asynchronous backlinks export task. Returns task status (queued_for_processing, processing, complete) and download URL when complete.',
        inputSchema: {
          task_id: z
            .string()
            .min(1, 'task_id is required')
            .describe('The task ID returned from the exportBacklinksData method (e.g., "1_878619").'),
        },
      },
      async (params) => this.makeGetRequest('/v1/backlinks/export/status', params),
    );
  }
}
