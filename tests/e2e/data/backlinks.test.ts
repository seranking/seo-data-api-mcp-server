import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as dotenv from 'dotenv';
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-console */
import { describe, expect, it } from 'vitest';

import { DATA_API_TOKEN } from '../../../src/constants.js';
import { BaseTool } from '../../../src/tools/base-tool.js';
import { setTokenProvider } from '../../../src/tools/base-tool.js';
// Backlinks Tools
import { GetAllBacklinks } from '../../../src/tools/data/backlinks/backlinks-all.js';
import { GetBacklinksAnchors } from '../../../src/tools/data/backlinks/backlinks-anchors.js';
import { GetBacklinksAuthority } from '../../../src/tools/data/backlinks/backlinks-authority.js';
import { GetDomainAuthority } from '../../../src/tools/data/backlinks/backlinks-authority-domain.js';
import { GetDistributionOfDomainAuthority } from '../../../src/tools/data/backlinks/backlinks-authority-domain-distribution.js';
import { GetPageAuthority } from '../../../src/tools/data/backlinks/backlinks-authority-page.js';
import { GetPageAuthorityHistory } from '../../../src/tools/data/backlinks/backlinks-authority-page-history.js';
import { GetBacklinksCount } from '../../../src/tools/data/backlinks/backlinks-count.js';
import { ExportBacklinksData } from '../../../src/tools/data/backlinks/backlinks-export.js';
import { GetBacklinksExportStatus } from '../../../src/tools/data/backlinks/backlinks-export-status.js';
import { ListNewLostBacklinks } from '../../../src/tools/data/backlinks/backlinks-history.js';
import { GetNewLostBacklinksCount } from '../../../src/tools/data/backlinks/backlinks-history-count.js';
import { GetCumulativeBacklinksHistory } from '../../../src/tools/data/backlinks/backlinks-history-cumulative.js';
import { GetBacklinksIndexedPages } from '../../../src/tools/data/backlinks/backlinks-indexed-pages.js';
import { GetBacklinksMetrics } from '../../../src/tools/data/backlinks/backlinks-metrics.js';
import { GetBacklinksRaw } from '../../../src/tools/data/backlinks/backlinks-raw.js';
import { GetBacklinksRefDomains } from '../../../src/tools/data/backlinks/backlinks-refdomains.js';
import { GetTotalRefDomainsCount } from '../../../src/tools/data/backlinks/backlinks-refdomains-count.js';
import { ListNewLostReferringDomains } from '../../../src/tools/data/backlinks/backlinks-refdomains-history.js';
import { GetNewLostRefDomainsCount } from '../../../src/tools/data/backlinks/backlinks-refdomains-history-count.js';
import { GetReferringIps } from '../../../src/tools/data/backlinks/backlinks-referring-ips.js';
import { GetReferringIpsCount } from '../../../src/tools/data/backlinks/backlinks-referring-ips-count.js';
import { GetReferringSubnetsCount } from '../../../src/tools/data/backlinks/backlinks-referring-subnets-count.js';
import { GetBacklinksSummary } from '../../../src/tools/data/backlinks/backlinks-summary.js';

dotenv.config();

setTokenProvider(() => process.env.DATA_API_TOKEN || DATA_API_TOKEN || 'mock-token');

const E2E_ENABLED = process.env.E2E_ENABLED === 'true';

interface LiveToolConfig {
    name: string;
    ToolClass: new () => BaseTool;
    payload: Record<string, any>;
}

const TEST_TARGET = 'github.com';

const safeTools: LiveToolConfig[] = [
    // Basic backlink retrieval
    {
        name: 'GetAllBacklinks',
        ToolClass: GetAllBacklinks,
        payload: { target: TEST_TARGET, limit: 1 },
    },
    {
        name: 'GetBacklinksAnchors',
        ToolClass: GetBacklinksAnchors,
        payload: { target: TEST_TARGET, limit: 1 },
    },
    {
        name: 'GetBacklinksRefDomains',
        ToolClass: GetBacklinksRefDomains,
        payload: { target: TEST_TARGET, limit: 1 },
    },
    {
        name: 'GetBacklinksSummary',
        ToolClass: GetBacklinksSummary,
        payload: { target: TEST_TARGET },
    },
    {
        name: 'GetBacklinksCount',
        ToolClass: GetBacklinksCount,
        payload: { target: TEST_TARGET },
    },
    {
        name: 'GetBacklinksRaw',
        ToolClass: GetBacklinksRaw,
        payload: { target: TEST_TARGET, limit: 1 },
    },
    {
        name: 'GetBacklinksMetrics',
        ToolClass: GetBacklinksMetrics,
        payload: { target: TEST_TARGET },
    },

    // Authority metrics
    {
        name: 'GetBacklinksAuthority',
        ToolClass: GetBacklinksAuthority,
        payload: { target: TEST_TARGET },
    },
    {
        name: 'GetDomainAuthority',
        ToolClass: GetDomainAuthority,
        payload: { target: TEST_TARGET },
    },
    {
        name: 'GetPageAuthority',
        ToolClass: GetPageAuthority,
        payload: { target: `https://${TEST_TARGET}` },
    },
    {
        name: 'GetPageAuthorityHistory',
        ToolClass: GetPageAuthorityHistory,
        payload: { target: `https://${TEST_TARGET}` },
    },
    {
        name: 'GetDistributionOfDomainAuthority',
        ToolClass: GetDistributionOfDomainAuthority,
        payload: { target: TEST_TARGET },
    },

    // Indexed pages
    {
        name: 'GetBacklinksIndexedPages',
        ToolClass: GetBacklinksIndexedPages,
        payload: { target: TEST_TARGET, limit: 1 },
    },

    // Referring domains
    {
        name: 'GetTotalRefDomainsCount',
        ToolClass: GetTotalRefDomainsCount,
        payload: { target: TEST_TARGET },
    },

    // Referring IPs and subnets
    {
        name: 'GetReferringIps',
        ToolClass: GetReferringIps,
        payload: { target: TEST_TARGET, limit: 1 },
    },
    {
        name: 'GetReferringIpsCount',
        ToolClass: GetReferringIpsCount,
        payload: { target: TEST_TARGET },
    },
    {
        name: 'GetReferringSubnetsCount',
        ToolClass: GetReferringSubnetsCount,
        payload: { target: TEST_TARGET },
    },

    // History endpoints
    {
        name: 'GetCumulativeBacklinksHistory',
        ToolClass: GetCumulativeBacklinksHistory,
        payload: { target: TEST_TARGET },
    },
    {
        name: 'GetNewLostBacklinksCount',
        ToolClass: GetNewLostBacklinksCount,
        payload: { target: TEST_TARGET },
    },
    {
        name: 'ListNewLostBacklinks',
        ToolClass: ListNewLostBacklinks,
        payload: { target: TEST_TARGET, limit: 1 },
    },
    {
        name: 'GetNewLostRefDomainsCount',
        ToolClass: GetNewLostRefDomainsCount,
        payload: { target: TEST_TARGET },
    },
    {
        name: 'ListNewLostReferringDomains',
        ToolClass: ListNewLostReferringDomains,
        payload: { target: TEST_TARGET, limit: 1 },
    },

    // Export (returns task ID, not actual data)
    {
        name: 'ExportBacklinksData',
        ToolClass: ExportBacklinksData,
        payload: { target: TEST_TARGET, limit: 1 },
    },
];

// Chained test: ExportBacklinksData -> GetBacklinksExportStatus
const chainedExportTest = {
    exportTool: ExportBacklinksData,
    statusTool: GetBacklinksExportStatus,
    payload: { target: TEST_TARGET, mode: 'domain' },
};

describe('E2E Data API: Backlinks Tools', () => {
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

    // Chained test: Export backlinks then check status
    runOrSkip(
        'GetBacklinksExportStatus should return task status after ExportBacklinksData',
        async () => {
            // Step 1: Start export
            const exportTool = new chainedExportTest.exportTool();
            const exportHandler = getHandler(exportTool);

            console.log('📡 Starting backlinks export...');
            const exportResult = await exportHandler(chainedExportTest.payload);
            const exportText = String(exportResult.content[0].text);
            const exportContent = JSON.parse(exportText) as { task_id: string };

            expect(exportContent.task_id).toBeDefined();
            console.log(`✅ Export started with task_id: ${exportContent.task_id}`);

            // Step 2: Check status
            const statusTool = new chainedExportTest.statusTool();
            const statusHandler = getHandler(statusTool);

            console.log('📡 Checking export status...');
            const statusResult = await statusHandler({ task_id: exportContent.task_id });
            const statusText = String(statusResult.content[0].text);
            const statusContent = JSON.parse(statusText) as { task_status: string };

            console.log(`✅ Export status: ${statusContent.task_status}`);

            expect(statusResult).toBeDefined();
            expect(statusContent.task_status).toBeDefined();
            expect(['queued_for_processing', 'processing', 'complete']).toContain(statusContent.task_status);
        },
        120000,
    );
});
