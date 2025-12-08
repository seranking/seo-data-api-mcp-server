import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { BaseTool } from '../base-tool.js';

export class CreateStandardAudit extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            'createStandardAudit',
            {
                title: 'Create Standard Audit',
                description:
                    'Launches a standard website audit that crawls the HTML of a website. Suitable for most static and server-side rendered sites.',
                inputSchema: {
                    domain: z.string().describe('Domain to be audited (e.g., domain.com).'),
                    title: z
                        .string()
                        .optional()
                        .describe('Custom title for the audit report. Maximum 300 characters.'),
                    settings: z
                        .object({
                            source_site: z.literal(1).or(z.literal(0)).optional(),
                            source_sitemap: z.literal(1).or(z.literal(0)).optional(),
                            source_subdomain: z.literal(1).or(z.literal(0)).optional(),
                            source_file: z.literal(1).or(z.literal(0)).optional(),
                            check_robots: z.literal(1).or(z.literal(0)).optional(),
                            ignore_params: z.literal(0).or(z.literal(1)).or(z.literal(2)).optional(),
                            custom_params: z.string().optional(),
                            ignore_noindex: z.literal(1).or(z.literal(0)).optional(),
                            ignore_nofollow: z.literal(1).or(z.literal(0)).optional(),
                            user_agent: z.number().int().min(0).max(13).optional(),
                            login: z.string().optional(),
                            password: z.string().optional(),
                            max_pages: z.number().int().min(1).max(300000).optional(),
                            max_depth: z.number().int().min(1).max(100).optional(),
                            max_req: z.number().int().min(1).max(500).optional(),
                            max_redirects: z.number().int().min(1).max(50).optional(),
                            min_title_len: z.number().int().min(1).max(10000).optional(),
                            max_title_len: z.number().int().min(1).max(10000).optional(),
                            min_description_len: z.number().int().min(1).max(10000).optional(),
                            max_description_len: z.number().int().min(1).max(10000).optional(),
                            max_size: z.number().int().min(1).max(100000).optional(),
                            min_words: z.number().int().min(1).max(10000).optional(),
                            max_h1_len: z.number().int().min(1).max(10000).optional(),
                            max_h2_len: z.number().int().min(1).max(10000).optional(),
                            allow: z.string().optional(),
                            disallow: z.string().optional(),
                            hide: z.string().optional(),
                        })
                        .optional()
                        .describe('Object containing specific audit settings.'),
                },
            },
            async (params) => {
                // The API expects JSON body according to the curl example in the prompt.
                // The BaseTool.request/makePostRequest helper might need adjustment if it forces FormData.
                // Let's check BaseTool again.
                // The BaseTool implementation I saw earlier uses FormData for POST.
                // "For POST, we assume form data for now as per original implementation"
                // But the prompt says: --header 'Content-Type: application/json' ... --data '{ ... }'
                // So I MUST send JSON.
                // I should modify BaseTool or override the request method here?
                // Modifying BaseTool is risky for existing tools if they depend on FormData.
                // However, I can add a makeJsonPostRequest to BaseTool or just implement it here using executeRequest if I can access it.
                // executeRequest is private.
                // I should add makeJsonPostRequest to BaseTool.
                return this.makeJsonPostRequest('/v1/site-audit/audits/standard', params);
            },
        );
    }
}
