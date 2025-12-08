
import { describe, expect, it } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as dotenv from 'dotenv';

// Import "Safe" Read-Only Tools (No prerequisites like Audit ID or Task ID)
import { GetAiOverview } from '../../src/tools/ai-search/ai-search-overview.js';
import { GetBacklinksSummary } from '../../src/tools/backlinks/backlinks-summary.js';
import { GetBacklinksAnchors } from '../../src/tools/backlinks/backlinks-anchors.js';
import { GetBacklinksRefDomains } from '../../src/tools/backlinks/backlinks-refdomains.js';
import { GetDomainAuthority } from '../../src/tools/backlinks/backlinks-authority-domain.js';
import { GetDomainCompetitors } from '../../src/tools/domain/domain-competitors.js';
import { GetDomainKeywords } from '../../src/tools/domain/domain-keywords.js';
import { GetDomainOverviewWorldwide } from '../../src/tools/domain/domain-overview-worldwide.js';
import { GetSimilarKeywords } from '../../src/tools/keywords/keywords-similar.js';
import { GetRelatedKeywords } from '../../src/tools/keywords/keywords-related.js';
import { BaseTool, setTokenProvider } from '../../src/tools/base-tool.js';

dotenv.config();

const E2E_ENABLED = process.env.E2E_ENABLED === 'true';

interface LiveToolConfig {
    name: string;
    ToolClass: new () => BaseTool;
    payload: Record<string, any>;
}

// Configuration for safe, standalone tools
const safeTools: LiveToolConfig[] = [
    // { name: 'GetAiOverview', ToolClass: GetAiOverview, payload: { target: 'openai.com', source: 'us', scope: 'domain' } },
    // { name: 'GetBacklinksSummary', ToolClass: GetBacklinksSummary, payload: { target: 'github.com' } },
    { name: 'GetBacklinksAnchors', ToolClass: GetBacklinksAnchors, payload: { target: 'github.com', limit: 1 } },
    { name: 'GetBacklinksRefDomains', ToolClass: GetBacklinksRefDomains, payload: { target: 'github.com', limit: 1 } },
    { name: 'GetDomainAuthority', ToolClass: GetDomainAuthority, payload: { target: 'github.com' } },
    { name: 'GetDomainCompetitors', ToolClass: GetDomainCompetitors, payload: { domain: 'google.com', source: 'us', limit: 1 } },
    { name: 'GetDomainKeywords', ToolClass: GetDomainKeywords, payload: { domain: 'google.com', source: 'us', limit: 1 } },
    { name: 'GetDomainOverviewWorldwide', ToolClass: GetDomainOverviewWorldwide, payload: { domain: 'google.com' } },
    { name: 'GetSimilarKeywords', ToolClass: GetSimilarKeywords, payload: { keyword: 'seo', source: 'us', limit: 1 } },
    { name: 'GetRelatedKeywords', ToolClass: GetRelatedKeywords, payload: { keyword: 'seo', source: 'us', limit: 1 } },
];

describe('End-to-End Read-Only Coverage', () => {
    const runOrSkip = E2E_ENABLED ? it : it.skip;

    if (!E2E_ENABLED) {
        console.warn('⚠️ E2E tests are skipped. Set E2E_ENABLED=true to run them.');
    } else {
        // Wire up the token provider
        setTokenProvider(() => process.env.SERANKING_API_TOKEN);
    }

    const getHandler = (tool: any) => {
        let handler: any;
        const mockRegister = {
            registerTool: (_name: string, _def: any, cb: any) => { handler = cb; },
        } as unknown as McpServer;
        tool.register(mockRegister);
        return handler;
    };

    for (const config of safeTools) {
        runOrSkip(`${config.name} should return live data`, async () => {
            const tool = new config.ToolClass();
            const handler = getHandler(tool);

            console.log(`📡 Calling ${config.name} with live API...`);
            const result = await handler(config.payload);

            // Log first 100 chars of output to prove it's real
            const content = (result as any).content[0].text;
            console.log(`✅ ${config.name} Response: ${content.slice(0, 100)}...`);

            expect(result).toBeDefined();
            expect(content.length).toBeGreaterThan(10);
        }, 60000); // 60s timeout
    }
});
