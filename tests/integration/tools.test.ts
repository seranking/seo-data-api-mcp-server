/* eslint-disable @typescript-eslint/no-unsafe-call */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GetAiOverview } from '../../src/tools/ai-search/ai-search-overview.js';
import { setTokenProvider } from '../../src/tools/base-tool.js';

// Mock McpServer
const mockServer = {
  registerTool: vi.fn(),
} as unknown as McpServer;

describe('Tool Integration Tests', () => {
  beforeEach(() => {
    setTokenProvider(() => 'test-token');
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('GetAiOverview makes correct API call', async () => {
    const tool = new GetAiOverview();
    let handler: any;
    (mockServer.registerTool as any).mockImplementation((name: string, schema: any, cb: any) => {
      if (name === 'getAiOverview') handler = cb;
    });

    tool.registerTool(mockServer);

    const mockResponse = { metrics: {} };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockResponse)),
    });

    await handler({ target: 'example.com', scope: 'domain', source: 'us', engine: 'google' });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/ai-search/overview'),
      expect.anything(),
    );
    // Verify query params
    const url = (global.fetch as any).mock.calls[0][0];
    expect(url).toContain('target=example.com');
    expect(url).toContain('scope=domain');
    expect(url).toContain('source=us');
    expect(url).toContain('engine=google');
  });
});
