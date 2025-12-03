import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { commonSchemas } from '../schemas.js';
import { BaseTool } from "../base-tool.js";

export class DomainOverview extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'domainOverview',
      {
        title: 'Domain Overview',
        description: 'Retrieves an overview of domain metrics for a specific region.',
        inputSchema: {
          domain: commonSchemas.domain,
        },
      },
      async (params) => this.makeGetRequest('/v1/domain/overview', params),
    );
  }
}
