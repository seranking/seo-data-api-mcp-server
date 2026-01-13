import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

export class GetIssuesByUrl extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getIssuesByUrl'),
      {
        title: 'Get Issues By URL',
        description:
          'Data Tool: Retrieves a detailed list of all issues (errors, warnings, and notices) that were found on a single, specific page within an audit.',
        inputSchema: {
          audit_id: z.number().int().describe('Unique identifier of the audit.'),
          url_id: z
            .number()
            .int()
            .optional()
            .describe('Unique identifier of the page. Either url_id or url must be provided.'),
          url: z
            .string()
            .optional()
            .describe('Full page URL. Either url or url_id must be provided.'),
        },
      },
      async (params) => this.makeGetRequest('/v1/site-audit/audits/issues', params),
    );
  }
}
