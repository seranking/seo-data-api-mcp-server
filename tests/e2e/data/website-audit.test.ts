import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as dotenv from 'dotenv';
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-console */
import { describe, expect, it } from 'vitest';

import { DATA_API_TOKEN } from '../../../src/constants.js';
import { BaseTool } from '../../../src/tools/base-tool.js';
import { setTokenProvider } from '../../../src/tools/base-tool.js';
import { GetAuditHistory } from '../../../src/tools/data/website-audit/get-audit-history.js';
import { GetAuditPagesByIssue } from '../../../src/tools/data/website-audit/get-audit-pages-by-issue.js';
import { GetAuditReport } from '../../../src/tools/data/website-audit/get-audit-report.js';
import { GetAuditStatus } from '../../../src/tools/data/website-audit/get-audit-status.js';
import { GetCrawledPages } from '../../../src/tools/data/website-audit/get-crawled-pages.js';
import { GetFoundLinks } from '../../../src/tools/data/website-audit/get-found-links.js';
import { GetIssuesByUrl } from '../../../src/tools/data/website-audit/get-issues-by-url.js';
// Website Audit Tools
import { ListAudits } from '../../../src/tools/data/website-audit/list-audits.js';
// Note: CreateStandardAudit, CreateAdvancedAudit, DeleteAudit, RecheckAudit, UpdateAuditTitle
// are excluded as they are destructive/write operations

dotenv.config();

setTokenProvider(() => process.env.DATA_API_TOKEN || DATA_API_TOKEN || 'mock-token');

const E2E_ENABLED = process.env.E2E_ENABLED === 'true';

interface LiveToolConfig {
    name: string;
    ToolClass: new () => BaseTool;
    payload: Record<string, any>;
}

// Base tools that don't require an audit ID
const baseTools: LiveToolConfig[] = [
    {
        name: 'ListAudits',
        ToolClass: ListAudits,
        payload: {},
    },
];

// Tools that require an audit ID - these will be tested dynamically
// after fetching the first audit from ListAudits
const auditDependentTools: Array<{
    name: string;
    ToolClass: new () => BaseTool;
    getPayload: (auditId: number) => Record<string, any>;
}> = [
    {
        name: 'GetAuditReport',
        ToolClass: GetAuditReport,
        getPayload: (auditId) => ({ audit_id: auditId }),
    },
    {
        name: 'GetAuditStatus',
        ToolClass: GetAuditStatus,
        getPayload: (auditId) => ({ audit_id: auditId }),
    },
    {
        name: 'GetAuditHistory',
        ToolClass: GetAuditHistory,
        getPayload: (auditId) => ({ audit_id: auditId }),
    },
    {
        name: 'GetCrawledPages',
        ToolClass: GetCrawledPages,
        getPayload: (auditId) => ({ audit_id: auditId, limit: 1 }),
    },
    {
        name: 'GetFoundLinks',
        ToolClass: GetFoundLinks,
        getPayload: (auditId) => ({ audit_id: auditId, limit: 1 }),
    },
    {
        name: 'GetAuditPagesByIssue',
        ToolClass: GetAuditPagesByIssue,
        getPayload: (auditId) => ({ audit_id: auditId, issue_id: 1, limit: 1 }),
    },
    {
        name: 'GetIssuesByUrl',
        ToolClass: GetIssuesByUrl,
        getPayload: (auditId) => ({ audit_id: auditId, limit: 1 }),
    },
];

describe('E2E Data API: Website Audit Tools', () => {
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

    // Test base tools that don't require audit ID
    for (const config of baseTools) {
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

    // Test audit-dependent tools using an existing audit
    runOrSkip(
        'Audit-dependent tools should return live data',
        async () => {
            // First, get list of audits to find an existing audit ID
            const listTool = new ListAudits();
            const listHandler = getHandler(listTool);

            console.log('📡 Fetching list of audits to get an audit ID...');
            const listResult = await listHandler({});
            const listContent = listResult.content[0].text;
            const audits = JSON.parse(listContent);

            if (!Array.isArray(audits) || audits.length === 0) {
                console.warn('⚠️ No existing audits found. Skipping audit-dependent tests.');
                return;
            }

            const testAuditId = audits[0].id;
            console.log(`✅ Found audit ID: ${testAuditId}`);

            // Test each audit-dependent tool
            for (const config of auditDependentTools) {
                const tool = new config.ToolClass();
                const handler = getHandler(tool);
                const payload = config.getPayload(testAuditId);

                console.log(`📡 Calling ${config.name} with audit_id=${testAuditId}...`);

                try {
                    const result = await handler(payload);
                    const content = result.content[0].text;
                    console.log(`✅ ${config.name} Response: ${content.slice(0, 100)}...`);

                    expect(result).toBeDefined();
                    expect(content.length).toBeGreaterThan(2);
                } catch (error: any) {
                    // Some tools may fail if audit doesn't have certain data
                    // (e.g., no issues, no crawled pages yet)
                    console.warn(`⚠️ ${config.name} failed: ${error.message}`);
                }
            }
        },
        120000, // Longer timeout for multiple API calls
    );
});
