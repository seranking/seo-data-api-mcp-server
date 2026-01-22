import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export class Prompts {
    registerPrompts(server: McpServer): void {
        server.registerPrompt(
            'serp-analysis',
            {
                title: 'SERP Analysis',
                description: 'Compare SERP results across two locations',
                argsSchema: {
                    keyword: z.string().min(1).describe('The search query (e.g., "yoga studio")'),
                    location1: z.string().min(1).describe('First location (e.g., "Barcelona")'),
                    location2: z.string().min(1).describe('Second location (e.g., "Sant Cugat del Valles")'),
                    language: z.string().optional().describe('Language code (default: es)'),
                    device: z.enum(['desktop', 'mobile']).optional().describe('Device type (default: desktop)'),
                },
            },
            ({ keyword, location1, location2, language, device }) => {
                const resolvedLanguage = language ?? 'es';
                const resolvedDevice = device ?? 'desktop';
                return {
                    messages: [
                        {
                            role: 'user',
                            content: {
                                type: 'text',
                                text: `Using seo data api mcp, create two SERP tasks for the query "${keyword}" in ${location1} and ${location2} on Google ${resolvedDevice}, ${resolvedLanguage}. When both are done, give me:
1. The top 10 organic domains per city.
2. The overlap between the lists.
3. Unique competitors per city with a one line positioning note for each.`,
                            },
                        },
                    ],
                };
            },
        );

        server.registerPrompt(
            'backlink-gap',
            {
                title: 'Backlink Gap Analysis',
                description: 'Find backlink opportunities by analyzing competitor referring domains',
                argsSchema: {
                    my_domain: z.string().min(1).describe('Your domain (e.g., jivamuktiyogabarcelona.com)'),
                    competitors: z.string().min(1).describe('Comma-separated list of top 3 competitors'),
                    min_domain_trust: z.coerce.number().optional().describe('Minimum Domain Trust (default: 25)'),
                },
            },
            ({ my_domain, competitors, min_domain_trust }) => {
                const resolvedMinDomainTrust = min_domain_trust ?? 25;
                return {
                    messages: [
                        {
                            role: 'user',
                            content: {
                                type: 'text',
                                text: `For the following competitors (${competitors}):
1. Fetch their backlinks, dofollow only and Domain Trust at least ${resolvedMinDomainTrust}.
2. Compare against ${my_domain} and keep only the domains that do not link to me.
3. Return a table with referring domain, DT, sample anchor, and why it is relevant for my business (local fit, topical fit, or competitive parity).`,
                            },
                        },
                    ],
                };
            },
        );

        server.registerPrompt(
            'domain-traffic-competitors',
            {
                title: 'Domain Traffic & Competitors',
                description: 'Analyze domain organic traffic and identify top competitors',
                argsSchema: {
                    domain: z.string().min(1).describe('The domain to analyze (e.g., wix.com)'),
                },
            },
            ({ domain }) => ({
                messages: [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `Using the Data API via MCP, for ${domain} return:
1. Global and country level organic traffic and top countries.
2. The top ten organic competitors sorted by number of shared keywords.
3. A short recommendation on where to focus, based on countries where competitors are strong and we are weak.`,
                        },
                    },
                ],
            }),
        );

        server.registerPrompt(
            'keyword-clusters',
            {
                title: 'Keyword Clustering',
                description: 'Generate keyword clusters with search volume and content recommendations',
                argsSchema: {
                    market: z.string().min(1).describe('Target market (e.g., US)'),
                    seed_keywords: z.string().min(1).describe('Comma-separated list of seed keywords'),
                },
            },
            ({ market, seed_keywords }) => ({
                messages: [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `Target market is ${market}. Seeds are:
${seed_keywords
                              .split(',')
                              .map((k) => k.trim())
                              .join('\n')}

Using MCP, please:
1. Pull related and similar keywords with ${market} search volume.
2. Clean and deduplicate.
3. Cluster by intent or theme.
4. Return a table with cluster, priority keywords, estimated volume and suggested H1 and H2 ideas.`,
                        },
                    },
                ],
            }),
        );

        server.registerPrompt(
            'ai-share-of-voice',
            {
                title: 'AI Share of Voice',
                description: 'Analyze AI share of voice across LLM engines for your domain versus competitors',
                argsSchema: {
                    domain: z.string().min(1).describe('Your domain (e.g., wix.com)'),
                    competitors: z.string().min(1).describe('Comma-separated list of competitors (e.g., weebly.com, hostinger.com)'),
                    country: z.string().optional().describe('Target country code (default: us)'),
                    llm_engines: z
                        .string()
                        .min(1)
                        .describe('Comma-separated list of AI engines to analyze (e.g., ai-overview, chatgpt, gemini). Options: ai-overview, chatgpt, perplexity, gemini, ai-mode'),
                },
            },
            ({ domain, competitors, country, llm_engines }) => {
                const resolvedCountry = country ?? 'us';
                return {
                    messages: [
                        {
                            role: 'user',
                            content: {
                                type: 'text',
                                text: `For ${domain} versus competitors ${competitors} in ${resolvedCountry} using ${llm_engines}, use the AI Search tools via MCP to:
1. Estimate share of voice across the main AI surfaces you support.
2. List topics or prompt patterns where competitors are mentioned more often than us.
3. Recommend five actions to close those gaps, like content angles, structured data, or partnerships with frequently cited sources.`,
                            },
                        },
                    ],
                };
            },
        );
    }
}
