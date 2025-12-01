import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { DomainOverview } from '../../src/tools/domain/domain-overview.js';
import { AiSearchOverview } from '../../src/tools/ai-search/ai-search-overview.js';
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

    it('DomainOverview makes correct API call', async () => {
        const tool = new DomainOverview();

        let handler: any;
        (mockServer.registerTool as any).mockImplementation((name: string, schema: any, cb: any) => {
            if (name === 'domainOverview') handler = cb;
        });

        tool.registerTool(mockServer);
        expect(handler).toBeDefined();

        const mockResponse = { data: 'test' };
        (global.fetch as any).mockResolvedValue({
            ok: true,
            text: () => Promise.resolve(JSON.stringify(mockResponse)),
        });

        const result = await handler({ domain: 'example.com' });

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/v1/domain/overview?domain=example.com'),
            expect.objectContaining({
                method: 'GET',
                headers: expect.any(Headers),
            })
        );
        const headers = (global.fetch as any).mock.calls[0][1].headers as Headers;
        expect(headers.get('Authorization')).toBe('Token test-token');
        expect(result).toEqual({
            content: [{ type: 'text', text: JSON.stringify(mockResponse, null, 2) }],
        });
    });

    it('AiSearchOverview makes correct API call', async () => {
        const tool = new AiSearchOverview();
        let handler: any;
        (mockServer.registerTool as any).mockImplementation((name: string, schema: any, cb: any) => {
            if (name === 'aiSearchOverview') handler = cb;
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
            expect.anything()
        );
        // Verify query params
        const url = (global.fetch as any).mock.calls[0][0];
        expect(url).toContain('target=example.com');
        expect(url).toContain('scope=domain');
        expect(url).toContain('source=us');
        expect(url).toContain('engine=google');
    });
});
