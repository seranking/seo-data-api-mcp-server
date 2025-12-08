
import { describe, expect, it } from 'vitest';
import { GetAiOverview } from '../../src/tools/ai-search/ai-search-overview.js';
import { GetBacklinksSummary } from '../../src/tools/backlinks/backlinks-summary.js';
import { GetDomainOverviewWorldwide } from '../../src/tools/domain/domain-overview-worldwide.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as dotenv from 'dotenv';

// Load environment variables for the test process
dotenv.config();

const E2E_ENABLED = process.env.E2E_ENABLED === 'true';

describe('End-to-End Smoke Tests', () => {
    // Determine strictness: skip tests if not enabled
    const runOrSkip = E2E_ENABLED ? it : it.skip;

    if (!E2E_ENABLED) {
        console.warn('⚠️ E2E tests are skipped. Set E2E_ENABLED=true to run them.');
    }

    const mockServer = {
        registerTool: (_name: string, _def: any, _cb: any) => { },
    } as unknown as McpServer;

    // Helper to get helper response text cleanly
    const getText = (res: any) => {
        if (res && res.content && res.content[0] && res.content[0].text) {
            return res.content[0].text;
        }
        return JSON.stringify(res);
    };

    runOrSkip('GetAiOverview should return data for openai.com', async () => {
        const tool = new GetAiOverview();
        tool.register(mockServer);

        const result = await tool.handler({
            target: 'openai.com',
            source: 'us',
            scope: 'domain',
        });

        const text = getText(result);
        console.log('GetAiOverview Result:', text.slice(0, 200) + '...');

        expect(result).toBeDefined();
        expect(text).toContain('openai.com');
    });

    runOrSkip('GetBacklinksSummary should return data for github.com', async () => {
        const tool = new GetBacklinksSummary();
        tool.register(mockServer);

        const result = await tool.handler({
            target: 'github.com',
            limit: 1 // Minimal load
        });

        const text = getText(result);
        console.log('GetBacklinksSummary Result:', text.slice(0, 200) + '...');

        expect(result).toBeDefined();
        // The API usually returns json, so we check for some expected key or value
        expect(text).toContain('total_backlinks');
    });

    runOrSkip('GetDomainOverviewWorldwide should return data for google.com', async () => {
        const tool = new GetDomainOverviewWorldwide();
        tool.register(mockServer);

        const result = await tool.handler({
            domain: 'google.com',
            source: 'us'
        });

        const text = getText(result);
        console.log('GetDomainOverviewWorldwide Result:', text.slice(0, 200) + '...');

        expect(result).toBeDefined();
        expect(text).toContain('google.com');
    });
});
