import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class AddSerpTasks extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      'addSerpTasks',
      {
        title: 'Add SERP tasks',
        description:
          'Adds one or more search queries to the queue for SERP analysis. Note that SERP tasks usually take 60 seconds to finish.',
        inputSchema: {
          search_engine: z.enum(['google']).default('google').describe('Search engine'),
          device: z.enum(['desktop']).default('desktop').describe('Device type'),
          language_code: z
            .string()
            .min(2, 'language_code is required and must be alpha-2 language code')
            .max(2, 'language_code must be alpha-2 language code')
            .describe('Language code'),
          location_id: z
            .number()
            .int()
            .positive()
            .describe('Location ID from SERP locations method'),
          query: z
            .array(z.string().min(1, 'query is empty').max(1000, 'too many queries'))
            .describe('List of queries'),
          tag: z.string().max(255, 'tag is too long (max 255 chars)').optional().describe('Tag'),
        },
      },
      async (params: {
        search_engine: string;
        device: string;
        language_code: string;
        location_id: number;
        query: string[];
        tag?: string | undefined;
      }) => {
        const { search_engine, device, language_code, location_id, query, tag } = params;
        const form: Record<string, unknown> = {};
        if (search_engine) form.search_engine = search_engine;
        if (device) form.device = device;
        if (language_code) form.language_code = language_code;
        if (language_code) form.language_code = language_code;
        if (location_id) form.location_id = location_id;
        if (query) form.query = query;
        if (tag) form.tag = tag;
        return this.makePostRequest('/v1/serp/classic/tasks', {}, form);
      },
    );
  }
}
