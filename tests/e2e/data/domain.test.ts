import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as dotenv from 'dotenv';
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-console */
import { describe, expect, it } from 'vitest';

import { DATA_API_TOKEN } from '../../../src/constants.js';
import { BaseTool } from '../../../src/tools/base-tool.js';
import { setTokenProvider } from '../../../src/tools/base-tool.js';
// Domain Tools
import { GetDomainAdsByDomain } from '../../../src/tools/data/domain/domain-ads-by-domain.js';
import { GetDomainAdsByKeyword } from '../../../src/tools/data/domain/domain-ads-by-keyword.js';
import { GetDomainCompetitors } from '../../../src/tools/data/domain/domain-competitors.js';
import { GetDomainKeywords } from '../../../src/tools/data/domain/domain-keywords.js';
import { GetDomainKeywordsComparison } from '../../../src/tools/data/domain/domain-keywords-comparison.js';
import { GetDomainOverviewDatabases } from '../../../src/tools/data/domain/domain-overview-db.js';
import { GetDomainOverviewHistory } from '../../../src/tools/data/domain/domain-overview-history.js';
import { GetDomainOverviewWorldwide } from '../../../src/tools/data/domain/domain-overview-worldwide.js';
import { GetUrlOverviewWorldwide } from '../../../src/tools/data/domain/domain-overview-worldwide-url.js';
import { GetDomainPages } from '../../../src/tools/data/domain/domain-pages.js';
import { GetDomainSubdomains } from '../../../src/tools/data/domain/domain-subdomains.js';

dotenv.config();

setTokenProvider(() => process.env.DATA_API_TOKEN || DATA_API_TOKEN || 'mock-token');

const E2E_ENABLED = process.env.E2E_ENABLED === 'true';

interface LiveToolConfig {
    name: string;
    ToolClass: new () => BaseTool;
    payload: Record<string, any>;
}

const TEST_DOMAIN = 'google.com';
const TEST_SOURCE = 'us';

const safeTools: LiveToolConfig[] = [
    // Domain overview
    {
        name: 'GetDomainOverviewWorldwide',
        ToolClass: GetDomainOverviewWorldwide,
        payload: { domain: TEST_DOMAIN },
    },
    {
        name: 'GetUrlOverviewWorldwide',
        ToolClass: GetUrlOverviewWorldwide,
        payload: { url: `https://${TEST_DOMAIN}` },
    },
    {
        name: 'GetDomainOverviewDatabases',
        ToolClass: GetDomainOverviewDatabases,
        payload: { domain: TEST_DOMAIN, source: TEST_SOURCE },
    },
    {
        name: 'GetDomainOverviewHistory',
        ToolClass: GetDomainOverviewHistory,
        payload: { domain: TEST_DOMAIN, source: TEST_SOURCE },
    },

    // Domain analysis
    {
        name: 'GetDomainCompetitors',
        ToolClass: GetDomainCompetitors,
        payload: { domain: TEST_DOMAIN, source: TEST_SOURCE, limit: 1 },
    },
    {
        name: 'GetDomainKeywords',
        ToolClass: GetDomainKeywords,
        payload: { domain: TEST_DOMAIN, source: TEST_SOURCE, limit: 1 },
    },
    {
        name: 'GetDomainKeywordsComparison',
        ToolClass: GetDomainKeywordsComparison,
        payload: {
            domain: TEST_DOMAIN,
            compare: 'bing.com',
            source: TEST_SOURCE,
            limit: 1
        },
    },
    {
        name: 'GetDomainPages',
        ToolClass: GetDomainPages,
        payload: { target: TEST_DOMAIN, source: TEST_SOURCE, scope: 'base_domain', limit: 1 },
    },
    {
        name: 'GetDomainSubdomains',
        ToolClass: GetDomainSubdomains,
        payload: { target: TEST_DOMAIN, source: TEST_SOURCE, scope: 'base_domain', limit: 1 },
    },

    // Ads data
    {
        name: 'GetDomainAdsByDomain',
        ToolClass: GetDomainAdsByDomain,
        payload: { domain: 'amazon.com', source: TEST_SOURCE, limit: 1 },
    },
    // Note: GetDomainAdsByKeyword may return empty results for some keywords
    {
        name: 'GetDomainAdsByKeyword',
        ToolClass: GetDomainAdsByKeyword,
        payload: { keyword: 'buy iphone', source: TEST_SOURCE, limit: 1 },
    },
];

describe('E2E Data API: Domain Tools', () => {
    const runOrSkip = E2E_ENABLED ? it : it.skip;

    if (!E2E_ENABLED) {
        console.warn('⚠️ E2E tests are skipped. Set E2E_ENABLED=true to run them.');
    }

    const getHandler = (tool: any) => {
        let handler: any;
        const mockRegister = {
            registerTool: (_name: string, _def: any, cb: any) => {
                handler = cb;
            },
        } as unknown as McpServer;
        tool.register(mockRegister);
        return handler;
    };

    for (const config of safeTools) {
        runOrSkip(
            `${config.name} should return live data`,
            async () => {
                const tool = new config.ToolClass();
                const handler = getHandler(tool);

                console.log(`📡 Calling ${config.name} with live API...`);
                const result = await handler(config.payload);

                const content = result.content[0].text;
                console.log(`✅ ${config.name} Response: ${content.slice(0, 100)}...`);

                expect(result).toBeDefined();
                // Allow empty arrays [] which have length 2
                expect(content.length).toBeGreaterThanOrEqual(2);
            },
            60000,
        );
    }
});
