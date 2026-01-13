import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as dotenv from 'dotenv';
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-console */
import { describe, expect, it } from 'vitest';

import { DATA_API_TOKEN } from '../../../src/constants.js';
import { BaseTool } from '../../../src/tools/base-tool.js';
import { setTokenProvider } from '../../../src/tools/base-tool.js';
// AI Search Tools
import { GetAiDiscoverBrand } from '../../../src/tools/data/ai-search/ai-search-discover-brand.js';
import { GetAiOverview } from '../../../src/tools/data/ai-search/ai-search-overview.js';
import { GetAiPromptsByBrand } from '../../../src/tools/data/ai-search/ai-search-prompts-by-brand.js';
import { GetAiPromptsByTarget } from '../../../src/tools/data/ai-search/ai-search-prompts-by-target.js';

dotenv.config();

setTokenProvider(() => process.env.DATA_API_TOKEN || DATA_API_TOKEN || 'mock-token');

const E2E_ENABLED = process.env.E2E_ENABLED === 'true';

interface LiveToolConfig {
    name: string;
    ToolClass: new () => BaseTool;
    payload: Record<string, any>;
}

const TEST_TARGET = 'openai.com';
const TEST_SOURCE = 'us';
const TEST_ENGINE = 'chatgpt';

const safeTools: LiveToolConfig[] = [
    {
        name: 'GetAiDiscoverBrand',
        ToolClass: GetAiDiscoverBrand,
        payload: { target: TEST_TARGET, source: TEST_SOURCE, scope: 'domain' },
    },
    {
        name: 'GetAiOverview',
        ToolClass: GetAiOverview,
        payload: { target: TEST_TARGET, source: TEST_SOURCE, scope: 'domain' },
    },
    {
        name: 'GetAiPromptsByTarget',
        ToolClass: GetAiPromptsByTarget,
        payload: {
            target: TEST_TARGET,
            source: TEST_SOURCE,
            engine: TEST_ENGINE,
            scope: 'domain',
            limit: 1
        },
    },
    {
        name: 'GetAiPromptsByBrand',
        ToolClass: GetAiPromptsByBrand,
        payload: {
            brand: 'openai',
            source: TEST_SOURCE,
            engine: TEST_ENGINE,
            limit: 1
        },
    },
];

describe('E2E Data API: AI Search Tools', () => {
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
                expect(content.length).toBeGreaterThan(2);
            },
            60000,
        );
    }
});
