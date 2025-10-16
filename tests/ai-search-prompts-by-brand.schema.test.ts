import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { AiSearchPromptsByBrand } from '../src/tools/ai-search/ai-search-prompts-by-brand.js';

// helper to get inputSchema defined inside registerTool
function getSchema() {
    let captured: any = null;

    const mockServer = {
        registerTool: (_name: string, def: any) => { captured = def?.inputSchema; }
    } as any;

    new AiSearchPromptsByBrand().registerTool(mockServer);

    return captured as Record<string, any>;
}

describe('AiSearchPromptsByBrand input schema (from tool definition)', () => {
    it('accepts a valid payload', () => {
        const schemaObj = getSchema();
        const schema = z.object(schemaObj);
        const payload = {
            engine: 'chatgpt',
            brand: 'SE Ranking',
            source: 'us',
            sort: 'volume',
            sort_order: 'desc',
            limit: 100,
            offset: 0,
            'filter[volume][from]': 10,
            'filter[volume][to]': 1000,
            'filter[keyword_count][from]': 2,
            'filter[keyword_count][to]': 10,
            'filter[characters_count][from]': 10,
            'filter[characters_count][to]': 100,
            'filter[multi_keyword_included]': '[[{"type":"contains","value":"keyword"}]]',
            'filter[multi_keyword_excluded]': '[[{"type":"contains","value":"seo"}],[{"type":"contains","value":"data"}]]',
        } as const;
        const result = schema.safeParse(payload);
        expect(result.success, result.error?.toString()).toBe(true);
    });

    it('accepts valid engine values', () => {
        const schema = z.object(getSchema());

        const validEngines = ['ai-overview', 'chatgpt', 'perplexity', 'gemini', 'ai-mode'];

        validEngines.forEach(engine => {
            const payload = { engine, brand: 'Test Brand', source: 'us' };
            const result = schema.safeParse(payload);
            expect(result.success, result.error?.toString()).toBe(true);
        });
    });

    it('accepts valid sort values', () => {
        const schema = z.object(getSchema());

        const validSorts = ['volume', 'type', 'snippet_length'];

        validSorts.forEach(sort => {
            const payload = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', sort };
            const result = schema.safeParse(payload);
            expect(result.success, result.error?.toString()).toBe(true);
        });
    });

    it('accepts valid sort_order values', () => {
        const schema = z.object(getSchema());

        const payload1 = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', sort_order: 'asc' };
        const result1 = schema.safeParse(payload1);
        expect(result1.success, result1.error?.toString()).toBe(true);

        const payload2 = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', sort_order: 'desc' };
        const result2 = schema.safeParse(payload2);
        expect(result2.success, result2.error?.toString()).toBe(true);
    });

    it('requires engine, brand, and source', () => {
        const schema = z.object(getSchema());

        const missingEngine = { brand: 'Test Brand', source: 'us' };
        const result1 = schema.safeParse(missingEngine);
        expect(result1.success, result1.error?.toString()).toBe(false);

        const missingBrand = { engine: 'chatgpt', source: 'us' };
        const result2 = schema.safeParse(missingBrand);
        expect(result2.success, result2.error?.toString()).toBe(false);

        const missingSource = { engine: 'chatgpt', brand: 'Test Brand' };
        const result3 = schema.safeParse(missingSource);
        expect(result3.success, result3.error?.toString()).toBe(false);
    });

    it('validates source is 2-character country code', () => {
        const schema = z.object(getSchema());

        const validSource = { engine: 'chatgpt', brand: 'Test Brand', source: 'us' };
        const result1 = schema.safeParse(validSource);
        expect(result1.success, result1.error?.toString()).toBe(true);

        const invalidSourceTooLong = { engine: 'chatgpt', brand: 'Test Brand', source: 'usa' };
        const result2 = schema.safeParse(invalidSourceTooLong);
        expect(result2.success, result2.error?.toString()).toBe(false);

        const invalidSourceTooShort = { engine: 'chatgpt', brand: 'Test Brand', source: 'u' };
        const result3 = schema.safeParse(invalidSourceTooShort);
        expect(result3.success, result3.error?.toString()).toBe(false);
    });

    it('validates limit is positive and within bounds', () => {
        const schema = z.object(getSchema());

        const validLimit = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', limit: 50 };
        const result1 = schema.safeParse(validLimit);
        expect(result1.success, result1.error?.toString()).toBe(true);

        const maxLimit = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', limit: 1000 };
        const result2 = schema.safeParse(maxLimit);
        expect(result2.success, result2.error?.toString()).toBe(true);

        const zeroLimit = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', limit: 0 };
        const result3 = schema.safeParse(zeroLimit);
        expect(result3.success, result3.error?.toString()).toBe(false);

        const negativeLimit = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', limit: -5 };
        const result4 = schema.safeParse(negativeLimit);
        expect(result4.success, result4.error?.toString()).toBe(false);

        const overMaxLimit = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', limit: 1001 };
        const result5 = schema.safeParse(overMaxLimit);
        expect(result5.success, result5.error?.toString()).toBe(false);
    });

    it('validates offset is non-negative', () => {
        const schema = z.object(getSchema());

        const validOffset = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', offset: 20 };
        const result1 = schema.safeParse(validOffset);
        expect(result1.success, result1.error?.toString()).toBe(true);

        const zeroOffset = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', offset: 0 };
        const result2 = schema.safeParse(zeroOffset);
        expect(result2.success, result2.error?.toString()).toBe(true);

        const negativeOffset = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', offset: -1 };
        const result3 = schema.safeParse(negativeOffset);
        expect(result3.success, result3.error?.toString()).toBe(false);
    });

    it('validates volume filters are positive', () => {
        const schema = z.object(getSchema());

        const validVolume = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', 'filter[volume][from]': 10, 'filter[volume][to]': 100 };
        const result1 = schema.safeParse(validVolume);
        expect(result1.success, result1.error?.toString()).toBe(true);

        const negativeVolumeFrom = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', 'filter[volume][from]': -5 };
        const result2 = schema.safeParse(negativeVolumeFrom);
        expect(result2.success, result2.error?.toString()).toBe(false);

        const negativeVolumeTo = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', 'filter[volume][to]': -10 };
        const result3 = schema.safeParse(negativeVolumeTo);
        expect(result3.success, result3.error?.toString()).toBe(false);
    });

    it('validates keyword_count filters are positive', () => {
        const schema = z.object(getSchema());

        const validKeywordCount = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', 'filter[keyword_count][from]': 1, 'filter[keyword_count][to]': 10 };
        const result1 = schema.safeParse(validKeywordCount);
        expect(result1.success, result1.error?.toString()).toBe(true);

        const zeroKeywordCount = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', 'filter[keyword_count][from]': 0 };
        const result2 = schema.safeParse(zeroKeywordCount);
        expect(result2.success, result2.error?.toString()).toBe(false);
    });

    it('validates characters_count filters are positive', () => {
        const schema = z.object(getSchema());

        const validCharCount = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', 'filter[characters_count][from]': 5, 'filter[characters_count][to]': 100 };
        const result1 = schema.safeParse(validCharCount);
        expect(result1.success, result1.error?.toString()).toBe(true);

        const zeroCharCount = { engine: 'chatgpt', brand: 'Test Brand', source: 'us', 'filter[characters_count][from]': 0 };
        const result2 = schema.safeParse(zeroCharCount);
        expect(result2.success, result2.error?.toString()).toBe(false);
    });

    it('validates brand is non-empty string', () => {
        const schema = z.object(getSchema());

        const validBrand = { engine: 'chatgpt', brand: 'Test Brand', source: 'us' };
        const result1 = schema.safeParse(validBrand);
        expect(result1.success, result1.error?.toString()).toBe(true);

        const emptyBrand = { engine: 'chatgpt', brand: '', source: 'us' };
        const result2 = schema.safeParse(emptyBrand);
        expect(result2.success, result2.error?.toString()).toBe(false);
    });

    it('validates engine is non-empty string', () => {
        const schema = z.object(getSchema());

        const validEngine = { engine: 'chatgpt', brand: 'Test Brand', source: 'us' };
        const result1 = schema.safeParse(validEngine);
        expect(result1.success, result1.error?.toString()).toBe(true);

        const emptyEngine = { engine: '', brand: 'Test Brand', source: 'us' };
        const result2 = schema.safeParse(emptyEngine);
        expect(result2.success, result2.error?.toString()).toBe(false);
    });

    it('accepts properly formatted multi_keyword_included filter', () => {
        const schema = z.object(getSchema());

        const payload = {
            engine: 'chatgpt',
            brand: 'Test Brand',
            source: 'us',
            'filter[multi_keyword_included]': '[[{"type":"contains","value":"test"}],[{"type":"contains","value":"example"}]]'
        };

        const result = schema.safeParse(payload);
        expect(result.success, result.error?.toString()).toBe(true);
    });

    it('accepts properly formatted multi_keyword_excluded filter', () => {
        const schema = z.object(getSchema());

        const payload = {
            engine: 'chatgpt',
            brand: 'Test Brand',
            source: 'us',
            'filter[multi_keyword_excluded]': '[[{"type":"contains","value":"seo"}],[{"type":"contains","value":"data"}],[{"type":"contains","value":"meat"}]]'
        };

        const result = schema.safeParse(payload);
        expect(result.success, result.error?.toString()).toBe(true);
    });

    it('uses correct default values', () => {
        const schema = z.object(getSchema());

        const minimalPayload = {
            engine: 'chatgpt',
            brand: 'Test Brand',
            source: 'us'
        };

        const result = schema.safeParse(minimalPayload);
        expect(result.success, result.error?.toString()).toBe(true);

        if (result.success) {
            // Defaults should be applied by the schema
            expect(result.data.engine).toBe('chatgpt');
            expect(result.data.brand).toBe('Test Brand');
            expect(result.data.source).toBe('us');
            expect(result.data.sort).toBe('volume');
            expect(result.data.sort_order).toBe('desc');
            expect(result.data.limit).toBe(100);
            expect(result.data.offset).toBe(0);
        }
    });
});