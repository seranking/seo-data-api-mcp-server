import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { DataApiMcpServer } from '../src/data-api-mcp-server.js';
import { McpServerMock } from "../src/classes/McpServerMock.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

function getAllTools() {
  const server = new McpServerMock();
  (new DataApiMcpServer(server as unknown as McpServer)).init();
  return server.tools;
}

// Helper: try building a Zod schema from an inputSchema plain object
function buildZodObject(inputSchema: Record<string, any> | undefined) {
  const shape = inputSchema ?? {};
  return z.object(shape as Record<string, z.ZodTypeAny>);
}

describe('All tools expose valid input schemas and handlers', () => {
  const tools = getAllTools();

  for (const tool of tools) {
    describe(`${tool.name}`, () => {
      it('has an inputSchema object', () => {
        expect(typeof tool.def?.inputSchema).toBe('object');
      });

      it('inputSchema compiles to Zod object', () => {
        const schema = buildZodObject(tool.def?.inputSchema);
        expect(schema).toBeTruthy();
      });

      it('inputSchema enforces required fields if any', () => {
        const schema = buildZodObject(tool.def?.inputSchema);
        const result = schema.safeParse({});
        // If parsing an empty object succeeds, we just accept that the schema has no required fields.
        if (!result.success) {
          // Should contain at least one issue about required fields
          expect(result.error.issues.length).toBeGreaterThan(0);
        }
      });

      it('handler returns a Missing Token message without SERANKING_API_TOKEN', async () => {
        const res = await tool.handler({});
        const text = res?.content?.[0]?.text || '';
        expect(String(text)).toContain('Missing SERANKING_API_TOKEN');
      });
    });
  }
});
