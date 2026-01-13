import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

export class GetSerpLocations extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      this.toolName('getSerpLocations'),
      {
        title: 'SERP locations',
        description: "Data Tool: Retrieves available locations for SERP analysis. After getting a location_id, use 'getSerpResults' to run SERP queries.",
        inputSchema: {
          q: z.string().min(2, 'q is too short (min 2 chars)').describe('Query'),
          country_code: z
            .string()
            .min(2, 'country_code is required and must be alpha-2 country code')
            .max(2, 'country_code must be alpha-2 country code')
            .describe(
              'Alpha-2 country code for the regional prompt database (e.g., us for United States results).',
            ),
        },
      },
      async (params) => this.makeGetRequest('/v1/serp/classic/locations', params),
    );
  }
}
