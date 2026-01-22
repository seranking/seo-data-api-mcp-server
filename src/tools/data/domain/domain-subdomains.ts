import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../../base-tool.js';

export class GetDomainSubdomains extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('getDomainSubdomains'),
            {
                title: 'Domain Subdomains',
                description:
                    'Data Tool: Retrieves a list of subdomains for a specified domain, along with search performance metrics.',
                inputSchema: {
                    target: z
                        .string()
                        .min(1, 'target is required')
                        .describe('The root domain to analyze (e.g., example.com).'),
                    scope: z
                        .enum(['base_domain', 'domain'])
                        .describe(
                            'Scope of analysis: `base_domain` (aggregate subdomains under the registrable domain) or `domain` (aggregate subdomains under the specified host).',
                        ),
                    source: z
                        .string()
                        .min(1, 'source is required')
                        .max(2)
                        .describe('Alpha-2 country code of the regional keyword database.'),
                    type: z
                        .enum(['organic', 'adv'])
                        .optional()
                        .default('organic')
                        .describe(
                            'Specifies whether to retrieve data for organic search or paid search (advertising).',
                        ),
                    order_field: z
                        .enum(['keywords_count', 'traffic_sum', 'traffic_percent', 'price_sum'])
                        .optional()
                        .default('keywords_count')
                        .describe('The field by which the returned subdomain list should be sorted.'),
                    order_type: z
                        .enum(['asc', 'desc'])
                        .optional()
                        .default('desc')
                        .describe('Sorting order: `asc` or `desc`.'),
                    offset: z
                        .number()
                        .int()
                        .min(0)
                        .optional()
                        .describe('Starting position for the paginated list.'),
                    limit: z
                        .number()
                        .int()
                        .positive()
                        .max(1000)
                        .optional()
                        .default(100)
                        .describe('The maximum number of subdomains to return per page.'),
                    filter_domain_url: z
                        .string()
                        .optional()
                        .describe(
                            'JSON string specifying the subdomain or host text that must be included.',
                        ),
                    filter_domain_traffic_percent_from: z
                        .number()
                        .min(0)
                        .optional()
                        .describe(
                            'Minimum percentage of the total domain traffic contributed by the subdomain to be included in the results.',
                        ),
                    filter_domain_traffic_percent_to: z
                        .number()
                        .min(0)
                        .optional()
                        .describe(
                            'Maximum percentage of the total domain traffic contributed by the subdomain to be included in the results.',
                        ),
                    filter_keywords_count_from: z
                        .number()
                        .int()
                        .min(0)
                        .optional()
                        .describe(
                            'Minimum number of ranking keywords for the subdomain to be included in the results.',
                        ),
                    filter_keywords_count_to: z
                        .number()
                        .int()
                        .min(0)
                        .optional()
                        .describe(
                            'Maximum number of ranking keywords for the subdomain to be included in the results.',
                        ),
                    filter_traffic_sum_from: z
                        .number()
                        .int()
                        .min(0)
                        .optional()
                        .describe(
                            'Minimum estimated monthly traffic for the subdomain to be included in the results.',
                        ),
                    filter_traffic_sum_to: z
                        .number()
                        .int()
                        .min(0)
                        .optional()
                        .describe(
                            'Maximum estimated monthly traffic for the subdomain to be included in the results.',
                        ),
                    filter_price_sum_from: z
                        .number()
                        .min(0)
                        .optional()
                        .describe(
                            'Minimum estimated traffic value (PPC equivalent) for the subdomain to be included in the results.',
                        ),
                    filter_price_sum_to: z
                        .number()
                        .min(0)
                        .optional()
                        .describe(
                            'Maximum estimated traffic value (PPC equivalent) for the subdomain to be included in the results.',
                        ),
                },
            },
            async (params) => this.makeGetRequest('/v1/domain/subdomains', this.transformFilterParams(params)),
        );
    }
}
