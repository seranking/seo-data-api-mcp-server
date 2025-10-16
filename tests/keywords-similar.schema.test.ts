import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { KeywordsSimilar } from '../src/tools/keywords/keywords-similar.js';
import { SERP_FEATURE_CODES } from '../src/tools/keywords/constants.js';
import captureSchema from "../src/helpers/captureSchema.js";

const getSchema = () => captureSchema(new KeywordsSimilar());

describe('KeywordsSimilar input schema (from tool definition)', () => {
  it('accepts a valid payload', () => {
    const schemaObj = getSchema();
    const schema = z.object(schemaObj);
    const payload = {
      source: 'us',
      keyword: 'avocado',
      limit: 10,
      offset: 0,
      sort: 'keyword',
      sort_order: 'asc',
      history_trend: true,
      'filter[volume][from]': 50,
      'filter[volume][to]': 5000,
      'filter[difficulty][from]': 18,
      'filter[difficulty][to]': 40,
      'filter[cpc][from]': 0.1,
      'filter[cpc][to]': 3,
      'filter[competition][from]': 0.2,
      'filter[competition][to]': 0.7,
      'filter[keyword_count][from]': 3,
      'filter[keyword_count][to]': 5,
      'filter[characters_count][from]': 20,
      'filter[characters_count][to]': 50,
      'filter[serp_features]': 'sge,images,top_stories',
    } as const;
    const result = schema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('rejects unsupported serp_features token', () => {
    const schema = z.object(getSchema());
    const bad = { 'filter[serp_features]': 'sge,unknown_feature', source: 'us', keyword: 'x' } as const;
    expect(() => schema.parse(bad)).toThrow();

    const ok = { 'filter[serp_features]': 'sge, images , top_stories', source: 'us', keyword: 'x' } as const;
    expect(schema.parse(ok)).toBeTruthy();
  });

  it('rejects invalid difficulty > 100', () => {
    const schema = z.object(getSchema());
    const bad = { 'filter[difficulty][to]': 101, source: 'us', keyword: 'x' } as const;
    expect(() => schema.parse(bad)).toThrow();
  });

  it('SERP_FEATURE_CODES is non-empty and includes known features', () => {
    expect(Array.isArray(SERP_FEATURE_CODES)).toBe(true);
    expect(SERP_FEATURE_CODES.length).toBeGreaterThan(0);
    expect(SERP_FEATURE_CODES).toContain('sge');
    expect(SERP_FEATURE_CODES).toContain('images');
  });
});
