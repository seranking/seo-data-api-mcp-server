/* eslint-disable @typescript-eslint/no-unsafe-call */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { setTokenProvider } from '../../src/tools/base-tool.js';
import { toolSpecs } from './tool-specs.js';

// Mock McpServer
const mockServer = {
  registerTool: vi.fn(),
} as unknown as McpServer;

describe('Data-Driven Tool Integration Tests', () => {
  beforeEach(() => {
    setTokenProvider(() => 'test-token');
    global.fetch = vi.fn();
    (mockServer.registerTool as any).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  for (const spec of toolSpecs) {
    it(`${spec.name} makes correct ${spec.expectedMethod} request to ${spec.expectedUrl}`, async () => {
      const tool = new spec.ToolClass();

      let handler: any;
      // Capture the handler when registerTool is called
      (mockServer.registerTool as any).mockImplementation(
        (_name: string, _schema: any, cb: any) => {
          handler = cb;
        },
      );

      tool.registerTool(mockServer);

      expect(handler).toBeDefined();

      // Mock response
      (global.fetch as any).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ status: 'ok' })),
        json: () => Promise.resolve({ status: 'ok' }),
      });

      // Execute the tool handler
      await handler(spec.payload);

      // Verify fetch was called with expected URL and Method
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(spec.expectedUrl),
        expect.objectContaining({
          method: spec.expectedMethod,
          headers: expect.any(Headers),
        }),
      );

      // Verify Authorization header
      const callArgs = (global.fetch as any).mock.calls[0];
      const options = callArgs[1];
      const headers = options.headers as Headers;
      expect(headers.get('Authorization')).toBe('Token test-token');
    });
  }
});
