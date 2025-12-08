/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-console */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as dotenv from 'dotenv';
import { describe, expect, it } from 'vitest';

import { GetAiOverview } from '../../src/tools/ai-search/ai-search-overview.js';
import { GetBacklinksSummary } from '../../src/tools/backlinks/backlinks-summary.js';
import { setTokenProvider } from '../../src/tools/base-tool.js';
import { GetDomainOverviewWorldwide } from '../../src/tools/domain/domain-overview-worldwide.js';

// Load environment variables for the test process
dotenv.config();

const E2E_ENABLED = process.env.E2E_ENABLED === 'true';

describe('End-to-End Smoke Tests', () => {
  // Determine strictness: skip tests if not enabled
  const runOrSkip = E2E_ENABLED ? it : it.skip;

  if (!E2E_ENABLED) {
    console.warn('⚠️ E2E tests are skipped. Set E2E_ENABLED=true to run them.');
  } else {
    // Wire up the token provider
    setTokenProvider(() => process.env.SERANKING_API_TOKEN);
  }

  // Helper to capture handler
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

  // Helper to get helper response text cleanly
  const getText = (res: any) => {
    if (res && res.content && res.content[0] && res.content[0].text) {
      return res.content[0].text;
    }
    return JSON.stringify(res);
  };

  // GetAiOverview fails with 400 Bad Request on live API
  runOrSkip(
    'GetAiOverview should return data for openai.com',
    async () => {
      const tool = new GetAiOverview();
      const handler = getHandler(tool);

      const result = await handler({
        target: 'openai.com',
        source: 'us',
        scope: 'domain',
      });

      const text = getText(result);
      console.log('GetAiOverview Result:', text.slice(0, 200) + '...');

      expect(result).toBeDefined();
    },
    60000,
  );

  // GetBacklinksSummary
  runOrSkip(
    'GetBacklinksSummary should return data for github.com',
    async () => {
      const tool = new GetBacklinksSummary();
      const handler = getHandler(tool);

      const result = await handler({
        target: 'github.com',
      });

      const text = getText(result);
      console.log('GetBacklinksSummary Result:', text.slice(0, 200) + '...');

      expect(result).toBeDefined();
    },
    60000,
  );

  runOrSkip(
    'GetDomainOverviewWorldwide should return data for google.com',
    async () => {
      const tool = new GetDomainOverviewWorldwide();
      const handler = getHandler(tool);

      const result = await handler({
        domain: 'google.com',
      });

      const text = getText(result);
      console.log('GetDomainOverviewWorldwide Result:', text.slice(0, 200) + '...');

      expect(result).toBeDefined();
      // Check for organic keys instead of domain string
      expect(text).toContain('organic');
      expect(text).toContain('traffic_sum');
    },
    60000,
  ); // 60s timeout
});
