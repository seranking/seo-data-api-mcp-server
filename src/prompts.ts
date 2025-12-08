import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export class Prompts {
  registerPrompts(server: McpServer): void {
    server.prompt(
      'serp-analysis',
      {
        keyword: z.string().describe('The search query (e.g., "yoga studio")'),
        location1: z.string().describe('First location (e.g., "Barcelona")'),
        location2: z.string().describe('Second location (e.g., "Sant Cugat del Valles")'),
        language: z.string().default('es').describe('Language code (default: es)'),
        device: z.string().default('desktop').describe('Device type (default: desktop)'),
      },
      ({ keyword, location1, location2, language, device }) => ({
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Using seo data api mcp, create two SERP tasks for the query "${keyword}" in ${location1} and ${location2} on Google ${device}, ${language}. When both are done, give me:
1. The top 10 organic domains per city.
2. The overlap between the lists.
3. Unique competitors per city with a one line positioning note for each.`,
            },
          },
        ],
      }),
    );

    server.prompt(
      'backlink-gap',
      {
        my_domain: z.string().describe('Your domain (e.g., jivamuktiyogabarcelona.com)'),
        competitors: z.string().describe('Comma-separated list of top 3 competitors'),
        min_domain_trust: z.string().default('25').describe('Minimum Domain Trust (default: 25)'),
      },
      ({ my_domain, competitors, min_domain_trust }) => ({
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `For the following competitors (${competitors}):
1. Fetch their backlinks, dofollow only and Domain Trust at least ${min_domain_trust}.
2. Compare against ${my_domain} and keep only the domains that do not link to me.
3. Return a table with referring domain, DT, sample anchor, and why it is relevant for my business (local fit, topical fit, or competitive parity).`,
            },
          },
        ],
      }),
    );

    server.prompt(
      'domain-traffic-competitors',
      {
        domain: z.string().describe('The domain to analyze (e.g., wix.com)'),
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

    server.prompt(
      'keyword-clusters',
      {
        market: z.string().describe('Target market (e.g., US)'),
        seed_keywords: z.string().describe('Comma-separated list of seed keywords'),
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

    server.prompt(
      'ai-share-of-voice',
      {
        domain: z.string().describe('Your domain (e.g., wix.com)'),
        competitors: z
          .string()
          .describe('Comma-separated list of competitors (e.g., weebly.com, hostinger.com)'),
        country: z.string().default('us').describe('Target country code (default: us)'),
        llm_engines: z
          .string()
          .describe(
            'Comma-separated list of AI engines to analyze (e.g., ai-overview, chatgpt, gemini). Options: ai-overview, chatgpt, perplexity, gemini, ai-mode',
          ),
      },
      ({ domain, competitors, country, llm_engines }) => ({
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `For ${domain} versus competitors ${competitors} in ${country} using ${llm_engines}, use the AI Search tools via MCP to:
1. Estimate share of voice across the main AI surfaces you support.
2. List topics or prompt patterns where competitors are mentioned more often than us.
3. Recommend five actions to close those gaps, like content angles, structured data, or partnerships with frequently cited sources.`,
            },
          },
        ],
      }),
    );
  }
}
