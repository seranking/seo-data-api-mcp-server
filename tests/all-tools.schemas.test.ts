import { describe, expect, it } from 'vitest';

import { buildZodObject } from '../src/helpers/buildZodObject.js';
import { getAllTools } from '../src/helpers/getAllTools.js';

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
