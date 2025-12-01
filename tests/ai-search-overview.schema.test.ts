import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import captureSchema from '../src/helpers/captureSchema.js';
import { AiSearchOverview } from '../src/tools/ai-search/ai-search-overview.js';

const getSchema = () => captureSchema(new AiSearchOverview());

describe('AiSearchOverview input schema (from tool definition)', () => {
  it('accepts a valid payload with engine', () => {
    const schemaObj = getSchema();
    const schema = z.object(schemaObj);
    const payload = {
      engine: 'chatgpt',
      source: 'us',
      target: 'seranking.com',
      scope: 'domain',
      brand: 'SE Ranking',
    } as const;
    const result = schema.safeParse(payload);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('accepts a valid payload without engine (aggregated)', () => {
    const schemaObj = getSchema();
    const schema = z.object(schemaObj);
    const payload = {
      source: 'us',
      target: 'seranking.com',
      scope: 'domain',
    } as const;
    const result = schema.safeParse(payload);
    expect(result.success, result.error?.toString()).toBe(true);
  });

  it('accepts valid engine values', () => {
    const schema = z.object(getSchema());

    const validEngines = ['ai-overview', 'chatgpt', 'perplexity', 'gemini', 'ai-mode'];

    validEngines.forEach((engine) => {
      const payload = { engine, source: 'us', target: 'example.com' };
      const result = schema.safeParse(payload);
      expect(result.success, result.error?.toString()).toBe(true);
    });
  });

  it('accepts valid scope values', () => {
    const schema = z.object(getSchema());

    const validScopes = ['domain', 'base_domain', 'url'];

    validScopes.forEach((scope) => {
      const payload = { engine: 'chatgpt', source: 'us', target: 'example.com', scope };
      const result = schema.safeParse(payload);
      expect(result.success, result.error?.toString()).toBe(true);
    });
  });

  it('requires source and target', () => {
    const schema = z.object(getSchema());

    const missingSource = { target: 'example.com' };
    const missingTarget = { source: 'us' };

    expect(() => schema.parse(missingSource)).toThrow();
    expect(() => schema.parse(missingTarget)).toThrow();
  });

  it('validates source is 2-character country code', () => {
    const schema = z.object(getSchema());

    const validSource = { engine: 'chatgpt', source: 'us', target: 'example.com' };
    const invalidSourceTooLong = { engine: 'chatgpt', source: 'usa', target: 'example.com' };
    const invalidSourceTooShort = { engine: 'chatgpt', source: 'u', target: 'example.com' };

    const result = schema.safeParse(validSource);

    expect(result.success, result.error?.toString()).toBe(true);
    expect(() => schema.parse(invalidSourceTooLong)).toThrow();
    expect(() => schema.parse(invalidSourceTooShort)).toThrow();
  });

  it('validates target is non-empty string', () => {
    const schema = z.object(getSchema());

    const validTarget = { engine: 'chatgpt', source: 'us', target: 'example.com' };
    const emptyTarget = { engine: 'chatgpt', source: 'us', target: '' };

    expect(schema.safeParse(validTarget).success).toBe(true);
    expect(() => schema.parse(emptyTarget)).toThrow();
  });

  it('validates engine is non-empty string if provided', () => {
    const schema = z.object(getSchema());

    const validEngine = { engine: 'chatgpt', source: 'us', target: 'example.com' };
    const emptyEngine = { engine: '', source: 'us', target: 'example.com' };

    expect(schema.safeParse(validEngine).success).toBe(true);
    expect(() => schema.parse(emptyEngine)).toThrow();
  });

  it('uses correct default values', () => {
    const schema = z.object(getSchema());

    const minimalPayload = {
      source: 'us',
      target: 'example.com',
    };

    const result = schema.parse(minimalPayload);

    // Defaults should be applied by the schema
    expect(result.source).toBe('us');
    expect(result.target).toBe('example.com');
    expect(result.scope).toBe('base_domain'); // Default scope
    expect(result.engine).toBeUndefined();
    expect(result.brand).toBeUndefined();
  });
});
