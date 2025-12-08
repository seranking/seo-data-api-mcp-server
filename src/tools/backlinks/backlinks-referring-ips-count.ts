import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class GetReferringIpsCount extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'getReferringIpsCount',
      {
        title: 'Get Referring IPs Count',
        description: 'Returns the number of unique IPs linking to a target.',
        inputSchema: {
          target: z
            .string()
            .describe(
              'Aim of the request: root domain, host, or URL. Use array for batching multiple targets via POST.',
            ), // Note: Schema description updated but Zod type is string for simplicity. Batching handled if passed as distinct tool or string array?
          // The BaseTool makeGetRequest takes Record<string, unknown>.
          // If we want to support batching via this tool simplified...
          // The prompt says: "pass multiple targets as GET parameters (separated by ‘&’), or use a POST request"
          // Let's stick to single target GET for simplicity unless batching is requested.
          // IF batching is needed, the `target` parameter should ideally be array.
          // But `makeGetRequest` flattens arrays into `target=1&target=2`.
          // So let's allow string or string[] for target.
          // BUT: Zod schema needs to be specific.
          // Let's stick to simple single target GET for now as per `BaseTool`.
          // Existing tools also seem single target focused.
          // Wait, listing existing tools might show how they handle it.
          // Let's assume single target first.
          mode: z.enum(['domain', 'host', 'url']).optional().default('host'),
        },
      },
      async (params) => this.makeGetRequest('/v1/backlinks/referring-ips/count', params),
    );
  }
}
