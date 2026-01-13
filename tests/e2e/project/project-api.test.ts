import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as dotenv from 'dotenv';
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-console */
import { describe, expect, it } from 'vitest';

import { BaseTool } from '../../../src/tools/base-tool.js';
import { GetSummary } from '../../../src/tools/project/project-management/get-summary.js';
import { ListProjects } from '../../../src/tools/project/project-management/list-projects.js';

dotenv.config();

const E2E_ENABLED = process.env.E2E_ENABLED === 'true';
const HAS_PROJECT_TOKEN = !!process.env.PROJECT_API_TOKEN;

interface LiveToolConfig {
    name: string;
    ToolClass: new () => BaseTool;
    payload: Record<string, any>;
}

// Configuration for safe, read-only tools
const projectTools: LiveToolConfig[] = [
    {
        name: 'ListProjects',
        ToolClass: ListProjects,
        payload: {},
    },
    // We can't easily test GetSummary without a known site_id.
    // Ideally, valid ListProjects output would provide a site_id for the next test.
];

describe('End-to-End Project (v4) Coverage', () => {
    const runOrSkip = E2E_ENABLED && HAS_PROJECT_TOKEN ? it : it.skip;

    if (!E2E_ENABLED) {
        console.warn('⚠️ E2E tests are skipped. Set E2E_ENABLED=true to run them.');
    } else if (!HAS_PROJECT_TOKEN) {
        console.warn('⚠️ Project API tests are skipped. Set PROJECT_API_TOKEN to run them.');
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

    runOrSkip('ListProjects should return live data', async () => {
        const config = projectTools[0];
        const tool = new config.ToolClass();
        const handler = getHandler(tool);

        console.log(`📡 Calling ${config.name} with live API...`);
        const result = await handler(config.payload);

        // Log first 100 chars
        const content = result.content[0].text;
        console.log(`✅ ${config.name} Response: ${content.slice(0, 100)}...`);

        expect(result).toBeDefined();
        const data = JSON.parse(content);
        expect(Array.isArray(data)).toBe(true);

        if (data.length > 0) {
            const siteId = data[0].id;
            console.log(`ℹ️ Found project ID: ${siteId}, testing GetSummary...`);

            // Chained test: GetSummary
            const summaryTool = new GetSummary();
            const summaryHandler = getHandler(summaryTool);
            const summaryResult = await summaryHandler({ site_id: siteId });
            const summaryContent = summaryResult.content[0].text;
            console.log(`✅ GetSummary Response: ${summaryContent.slice(0, 100)}...`);
            expect(summaryResult).toBeDefined();
        } else {
            console.warn('⚠️ No projects found, skipping GetSummary test.');
        }
    }, 60000);
});
