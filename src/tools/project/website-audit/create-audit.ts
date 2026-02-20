import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ApiType, BaseTool } from '../../base-tool.js';

export class ProjectCreateAudit extends BaseTool {
    protected apiType = ApiType.PROJECT;

    registerTool(server: McpServer): void {
        server.registerTool(
            this.toolName('createAudit'),
            {
                title: 'Create Audit',
                description:
                    'Project Tool: Launches a website audit that crawls the HTML of a website. Be aware of the page crawl limit included in your plan.',
                inputSchema: {
                    domain: z.string().describe('The domain to be audited (e.g., domain.com).'),
                    title: z
                        .string()
                        .max(300)
                        .optional()
                        .describe('Custom title for the audit report. Max 300 characters. Defaults to the domain.'),
                    settings: z
                        .object({
                            source_site: z
                                .literal(1)
                                .or(z.literal(0))
                                .optional()
                                .describe('Scan all pages by following internal links from the homepage. 0=no, 1=yes. Default: 1.'),
                            source_sitemap: z
                                .literal(1)
                                .or(z.literal(0))
                                .optional()
                                .describe('Scan the sitemap.xml file. 0=no, 1=yes. Default: 1.'),
                            source_subdomain: z
                                .literal(1)
                                .or(z.literal(0))
                                .optional()
                                .describe('Scan subdomains. If 0, subdomain links are treated as external. Default: 0.'),
                            source_file: z
                                .literal(1)
                                .or(z.literal(0))
                                .optional()
                                .describe('Use a custom list of pages for the audit. 0=no, 1=yes. Default: 0.'),
                            check_robots: z
                                .literal(1)
                                .or(z.literal(0))
                                .optional()
                                .describe('Follow robots.txt directives. 0=no, 1=yes. Default: 1.'),
                            ignore_noindex: z
                                .literal(1)
                                .or(z.literal(0))
                                .optional()
                                .describe('Ignore pages with a noindex tag. 0=no, 1=yes. Default: 0.'),
                            ignore_nofollow: z
                                .literal(1)
                                .or(z.literal(0))
                                .optional()
                                .describe('Ignore links with a nofollow attribute. 0=no, 1=yes. Default: 0.'),
                            ignore_params: z
                                .literal(0)
                                .or(z.literal(1))
                                .or(z.literal(2))
                                .optional()
                                .describe('Ignore URL parameters. 0=none, 1=all, 2=custom list. Default: 0.'),
                            custom_params: z
                                .string()
                                .optional()
                                .describe('Comma-separated list of URL parameters to ignore when ignore_params is 2.'),
                            user_agent: z
                                .number()
                                .int()
                                .min(0)
                                .max(13)
                                .optional()
                                .describe('User-Agent for crawl. 0=SE Ranking bot, 1=Googlebot, 7=Chrome Windows, etc. Default: 0.'),
                            csr: z
                                .literal(1)
                                .or(z.literal(0))
                                .optional()
                                .describe('Client-Side Rendering. Set to 1 to enable JavaScript rendering for SPAs. Default: 0.'),
                            login: z.string().optional().describe('Login for Basic HTTP Authentication.'),
                            password: z.string().optional().describe('Password for Basic HTTP Authentication.'),
                            max_pages: z
                                .number()
                                .int()
                                .min(1)
                                .max(300000)
                                .optional()
                                .describe('Maximum number of pages to crawl. Default: 1000.'),
                            max_depth: z
                                .number()
                                .int()
                                .min(1)
                                .max(100)
                                .optional()
                                .describe('Maximum crawl depth. Default: 10.'),
                            max_req: z
                                .number()
                                .int()
                                .min(1)
                                .max(500)
                                .optional()
                                .describe('Maximum requests per second. Default: 500.'),
                            max_redirects: z
                                .number()
                                .int()
                                .min(1)
                                .max(50)
                                .optional()
                                .describe('Maximum redirects to follow. Default: 5.'),
                            max_size: z
                                .number()
                                .int()
                                .min(1)
                                .max(100000)
                                .optional()
                                .describe('Maximum page size in kilobytes. Default: 3000.'),
                            min_title_len: z
                                .number()
                                .int()
                                .min(1)
                                .max(10000)
                                .optional()
                                .describe('Minimum length for the <title> tag. Default: 20.'),
                            max_title_len: z
                                .number()
                                .int()
                                .min(1)
                                .max(10000)
                                .optional()
                                .describe('Maximum length for the <title> tag. Default: 65.'),
                            min_description_len: z
                                .number()
                                .int()
                                .min(1)
                                .max(10000)
                                .optional()
                                .describe('Minimum length for the meta description. Default: 1.'),
                            max_description_len: z
                                .number()
                                .int()
                                .min(1)
                                .max(10000)
                                .optional()
                                .describe('Maximum length for the meta description. Default: 158.'),
                            min_words: z
                                .number()
                                .int()
                                .min(1)
                                .max(10000)
                                .optional()
                                .describe('Minimum word count per page. Default: 250.'),
                            max_h1_len: z
                                .number()
                                .int()
                                .min(1)
                                .max(10000)
                                .optional()
                                .describe('Maximum length for <h1> tags. Default: 100.'),
                            max_h2_len: z
                                .number()
                                .int()
                                .min(1)
                                .max(10000)
                                .optional()
                                .describe('Maximum length for <h2> tags. Default: 100.'),
                            allow: z
                                .string()
                                .optional()
                                .describe('Only crawl URLs that start with this path. Use newlines to separate multiple paths.'),
                            disallow: z
                                .string()
                                .optional()
                                .describe('Do not crawl URLs that start with this path. Use newlines to separate multiple paths.'),
                            hide: z
                                .string()
                                .optional()
                                .describe('Hide URLs and resources starting with this path from the report. Use newlines to separate.'),
                            schedule_type: z
                                .enum(['manual', 'week', 'month'])
                                .optional()
                                .describe('How often the audit should automatically re-run. Default: manual.'),
                            schedule_day: z
                                .number()
                                .int()
                                .min(1)
                                .max(31)
                                .optional()
                                .describe('Day of the month to run when schedule_type is month. Default: 1.'),
                            schedule_wdays: z
                                .array(z.number().int().min(1).max(7))
                                .optional()
                                .describe('Days of the week (1-7) to run when schedule_type is week.'),
                            schedule_hour: z
                                .number()
                                .int()
                                .min(0)
                                .max(23)
                                .optional()
                                .describe('Hour of the day (UTC) to start the scheduled audit. Default: 0.'),
                            schedule_repeat: z
                                .literal(1)
                                .or(z.literal(0))
                                .optional()
                                .describe('Enable repeated re-crawls at a regular interval. 0=no, 1=yes. Default: 0.'),
                            schedule_repeat_interval: z
                                .number()
                                .int()
                                .optional()
                                .describe('Interval in weeks between repeated audits when schedule_repeat is 1. Default: 2.'),
                            send_report: z
                                .literal(1)
                                .or(z.literal(0))
                                .optional()
                                .describe('Send an email report when the audit completes. 0=no, 1=yes. Default: 1.'),
                            report_emails: z
                                .string()
                                .optional()
                                .describe('Comma-separated list of email addresses for the audit report.'),
                        })
                        .optional()
                        .describe('Object containing specific audit settings. Only include parameters you want to override.'),
                },
            },
            async (params: { domain: string; title?: string; settings?: Record<string, unknown> }) =>
                this.makeJsonPostRequest('/audit/', params),
        );
    }
}
