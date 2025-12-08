import { describe, expect, it } from 'vitest';

import captureSchema from '../src/helpers/captureSchema.js';
import { setTokenProvider } from '../src/tools/base-tool.js';
import { toolSpecs } from './integration/tool-specs.js';

describe('Tool Schema Snapshots', () => {
  // We don't need beforeEach/afterEach for captureSchema as it creates its own mock server

  for (const spec of toolSpecs) {
    it(`matches snapshot for ${spec.name}`, () => {
      setTokenProvider(() => 'test-token');
      const tool = new spec.ToolClass();

      const schema = captureSchema(tool);

      expect(schema).toBeDefined();

      expect(schema).toBeDefined();

      // Attempt to snapshot the raw schema.
      // If it's a Zod object, Vitest might serialize it poorly, but let's see.
      // If it's already a JSON schema (unlikely), it will look great.
      expect(schema).toMatchSnapshot();
    });
  }
});
