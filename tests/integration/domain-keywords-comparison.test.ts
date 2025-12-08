/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable unused-imports/no-unused-vars */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { setTokenProvider } from '../../src/tools/base-tool.js';
import { GetDomainKeywordsComparison } from '../../src/tools/domain/domain-keywords-comparison.js';

// Mock McpServer
const mockServer = {
  registerTool: vi.fn(),
} as unknown as McpServer;

describe('GetDomainKeywordsComparison Tool Tests', () => {
  beforeEach(() => {
    setTokenProvider(() => 'test-token');
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should register with correct schema excluding price and traffic', () => {
    const tool = new GetDomainKeywordsComparison();

    let schema: any;
    (mockServer.registerTool as any).mockImplementation((name: string, s: any, cb: any) => {
      if (name === 'getDomainKeywordsComparison') {
        schema = s;
      }
    });

    tool.registerTool(mockServer);

    expect(schema).toBeDefined();
    const orderFieldSchema = schema.inputSchema.order_field;

    // Check that 'price' and 'traffic' are NOT allowed
    const resultPrice = orderFieldSchema.safeParse('price');
    expect(resultPrice.success).toBe(false);

    const resultTraffic = orderFieldSchema.safeParse('traffic');
    expect(resultTraffic.success).toBe(false);

    // Check that 'volume' IS allowed
    const resultVolume = orderFieldSchema.safeParse('volume');
    expect(resultVolume.success).toBe(true);
  });
});
