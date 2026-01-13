import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as dotenv from 'dotenv';
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-console */
import { describe, expect, it } from 'vitest';

import { DATA_API_TOKEN } from '../../../src/constants.js';
import { BaseTool } from '../../../src/tools/base-tool.js';
import { setTokenProvider } from '../../../src/tools/base-tool.js';
// Keywords Tools
import { ExportKeywords } from '../../../src/tools/data/keywords/keywords-export.js';
import { GetLongTailKeywords } from '../../../src/tools/data/keywords/keywords-longtail.js';
import { GetKeywordQuestions } from '../../../src/tools/data/keywords/keywords-questions.js';
import { GetRelatedKeywords } from '../../../src/tools/data/keywords/keywords-related.js';
import { GetSimilarKeywords } from '../../../src/tools/data/keywords/keywords-similar.js';

dotenv.config();

setTokenProvider(() => process.env.DATA_API_TOKEN || DATA_API_TOKEN || 'mock-token');

const E2E_ENABLED = process.env.E2E_ENABLED === 'true';

interface LiveToolConfig {
    name: string;
    ToolClass: new () => BaseTool;
    payload: Record<string, any>;
}

const TEST_KEYWORD = 'seo';
const TEST_SOURCE = 'us';

const safeTools: LiveToolConfig[] = [
    {
        name: 'GetSimilarKeywords',
        ToolClass: GetSimilarKeywords,
        payload: { keyword: TEST_KEYWORD, source: TEST_SOURCE, limit: 1 },
    },
    {
        name: 'GetRelatedKeywords',
        ToolClass: GetRelatedKeywords,
        payload: { keyword: TEST_KEYWORD, source: TEST_SOURCE, limit: 1 },
    },
    {
        name: 'GetKeywordQuestions',
        ToolClass: GetKeywordQuestions,
        payload: { keyword: TEST_KEYWORD, source: TEST_SOURCE, limit: 1 },
    },
    {
        name: 'GetLongTailKeywords',
        ToolClass: GetLongTailKeywords,
        payload: { keyword: TEST_KEYWORD, source: TEST_SOURCE, limit: 1 },
    },
    {
        name: 'ExportKeywords',
        ToolClass: ExportKeywords,
        payload: { keywords: [TEST_KEYWORD, 'marketing'], source: TEST_SOURCE },
    },
];

describe('E2E Data API: Keywords Tools', () => {
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
