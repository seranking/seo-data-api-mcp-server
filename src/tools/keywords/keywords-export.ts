import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class KeywordsExport extends BaseTool {
  readonly COLS = ['keyword', 'volume', 'cpc', 'competition', 'difficulty', 'history_trend'];

  registerTool(server: McpServer): void {
    server.registerTool(
      'keywordsExport',
      {
        title: 'Export Keywords Metrics',
        description:
          'Bulk retrieve metrics for a list of keywords (v1/keywords/export, POST form-data; source in query)',
        inputSchema: {
          source: z
            .string()
            .min(1, 'source is required')
            .max(2)
            .describe('Alpha-2 country code of the regional keyword database.'),
          keywords: z
            .array(z.string().min(1))
            .min(1, 'at least one keyword is required')
            .max(5000, 'maximum of 5000 keywords per call')
            .describe(
              'For a single keyword, use one keywords[] parameter. Repeat the keywords[] to analyze multiple keywords. A maximum of 5,000 keywords can be submitted per call.',
            ),
          sort: z
            .enum(['volume', 'cpc', 'difficulty', 'competition', 'history_trend'])
            .optional()
            .default('cpc')
            .describe(
              'The field by which the returned list of keywords should be sorted. Common sortable fields include volume, cpc, difficulty, competition.',
            ),
          sort_order: z
            .enum(['asc', 'desc'])
            .optional()
            .default('desc')
            .describe('The order of sorting for the sort field.'),
          cols: z
            .string()
            .optional()
            .refine((val?: string | null) => this.isValidCommaSeparatedList(this.COLS, val), {
              message: 'cols must be a comma-separated list of supported columns',
            })
            .default('keyword, volume, cpc, competition, difficulty, history_trend')
            .describe(
              'A comma-separated list of specific response parameter names to include in the output for each keyword. If omitted, all available data points are returned.',
            ),
        },
      },
      async (params: {
        source: string;
        sort: 'volume' | 'cpc' | 'competition' | 'difficulty' | 'history_trend';
        keywords: string[];
        sort_order: 'asc' | 'desc';
        cols: string;
      }) => {
        const { source, keywords, sort, sort_order, cols } = params;
        const form: Record<string, unknown> = {};
        // API expects repeated form fields named keywords[]
        form['keywords[]'] = keywords;
        if (sort) form.sort = sort;
        if (sort_order) form.sort_order = sort_order;
        if (cols) form.cols = cols;
        return this.makePostRequest('/v1/keywords/export', { source }, form);
      },
    );
  }
}
