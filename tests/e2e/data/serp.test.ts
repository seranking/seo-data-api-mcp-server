import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as dotenv from 'dotenv';
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-console */
import { describe, expect, it } from 'vitest';

import { DATA_API_TOKEN } from '../../../src/constants.js';
import { BaseTool } from '../../../src/tools/base-tool.js';
import { setTokenProvider } from '../../../src/tools/base-tool.js';
// SERP Tools
import { GetSerpHtmlDump } from '../../../src/tools/data/serp/serp-get-html-dump.js';
import { GetSerpLocations } from '../../../src/tools/data/serp/serp-get-locations.js';
import { GetSerpTaskAdvancedResults } from '../../../src/tools/data/serp/serp-get-task-advanced-results.js';
import { GetSerpTaskResults } from '../../../src/tools/data/serp/serp-get-task-results.js';
import { GetSerpTasks } from '../../../src/tools/data/serp/serp-get-tasks.js';
// Note: AddSerpTasks is excluded as it's a write operation

dotenv.config();

setTokenProvider(() => process.env.DATA_API_TOKEN || DATA_API_TOKEN || 'mock-token');

const E2E_ENABLED = process.env.E2E_ENABLED === 'true';

interface LiveToolConfig {
    name: string;
    ToolClass: new () => BaseTool;
    payload: Record<string, any>;
}

const safeTools: LiveToolConfig[] = [
    {
        name: 'GetSerpLocations',
        ToolClass: GetSerpLocations,
        payload: {},
    },
    {
        name: 'GetSerpTasks',
        ToolClass: GetSerpTasks,
        payload: {},
    },
];

// Tools that require task IDs from GetSerpTasks
const taskIdDependentTools = {
    listTasks: GetSerpTasks,
    taskResults: GetSerpTaskResults,
    taskAdvancedResults: GetSerpTaskAdvancedResults,
    htmlDump: GetSerpHtmlDump,
};

describe('E2E Data API: SERP Tools', () => {
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

    // Chained test: Get SERP tasks list, then validate all task-dependent endpoints
    runOrSkip(
        'Task-dependent SERP tools should return data when tasks exist',
        async () => {
            // Step 1: Get list of tasks
            const listTool = new taskIdDependentTools.listTasks();
            const listHandler = getHandler(listTool);

            console.log('📡 Fetching SERP tasks list...');
            const listResult = await listHandler({});
            const listText = String(listResult.content[0].text);
            const tasks = JSON.parse(listText) as Array<{ id?: number; status?: string }>;

            // Find a completed task (status !== 'processing')
            const completedTask = Array.isArray(tasks)
                ? tasks.find((t) => t.status !== 'processing' && t.id)
                : null;

            if (!completedTask || !completedTask.id) {
                console.log('⚠️ No completed SERP tasks found, skipping task-dependent tests');
                return;
            }

            const taskId = completedTask.id;
            console.log(`✅ Found completed task with ID: ${taskId}`);

            // Step 2: Test GetSerpTaskResults
            const taskResultsTool = new taskIdDependentTools.taskResults();
            const taskResultsHandler = getHandler(taskResultsTool);

            console.log('📡 Fetching SERP task results...');
            const taskResultsResult = await taskResultsHandler({ task_id: taskId });

            expect(taskResultsResult).toBeDefined();
            expect(taskResultsResult.content[0].text.length).toBeGreaterThan(0);
            console.log(`✅ GetSerpTaskResults Response received (${String(taskResultsResult.content[0].text).slice(0, 100)}...)`);

            // Step 3: Test GetSerpTaskAdvancedResults
            const advancedResultsTool = new taskIdDependentTools.taskAdvancedResults();
            const advancedResultsHandler = getHandler(advancedResultsTool);

            console.log('📡 Fetching SERP task advanced results...');
            const advancedResultsResult = await advancedResultsHandler({ task_id: taskId });

            expect(advancedResultsResult).toBeDefined();
            expect(advancedResultsResult.content[0].text.length).toBeGreaterThan(0);
            console.log(`✅ GetSerpTaskAdvancedResults Response received (${String(advancedResultsResult.content[0].text).slice(0, 100)}...)`);

            // Step 4: Test GetSerpHtmlDump
            const htmlTool = new taskIdDependentTools.htmlDump();
            const htmlHandler = getHandler(htmlTool);

            console.log('📡 Fetching SERP HTML dump...');
            const htmlResult = await htmlHandler({ task_id: taskId });

            expect(htmlResult).toBeDefined();
            expect(htmlResult.content[0].text.length).toBeGreaterThan(0);
            console.log(`✅ GetSerpHtmlDump Response received (${String(htmlResult.content[0].text).length} chars)`);
        },
        180000,
    );
});
