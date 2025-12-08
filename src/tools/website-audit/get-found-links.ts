import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class GetFoundLinks extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'getFoundLinks',
      {
        title: 'Get Found Links',
        description:
          'Returns a paginated list of every hyperlink discovered across the entire site during the audit.',
        inputSchema: {
          audit_id: z.number().int().describe('Unique identifier of the audit.'),
          page_type: z
            .enum(['internal', 'external', 'all'])
            .optional()
            .default('all')
            .describe('Filters links by type.'),
          limit: z.number().int().optional().describe('Number of links to return in the list.'),
          offset: z.number().int().optional().describe('Starting position for the list of links.'),
          filter: z
            .array(
              z.object({
                param: z.string().describe('The field you want to filter on (e.g., status).'),
                value: z.union([z.string(), z.number()]).describe('The value to match.'),
                type: z
                  .enum(['and', 'or'])
                  .optional()
                  .describe('The logical operator to connect this condition to the previous one.'),
              }),
            )
            .optional()
            .describe('Array of filter objects to build complex queries.'),
        },
      },
      async (params) => {
        const { filter, ...rest } = params;
        const queryParams: Record<string, unknown> = { ...rest };

        if (filter) {
          filter.forEach((f, index) => {
            queryParams[`filter[${index}][param]`] = f.param;
            queryParams[`filter[${index}][value]`] = f.value;
            if (f.type) {
              queryParams[`filter[${index}][type]`] = f.type;
            }
          });
        }

        return this.makeGetRequest('/v1/site-audit/audits/links', queryParams);
      },
    );
  }
}
