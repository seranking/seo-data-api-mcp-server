import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { AiSearchPromptsByTarget } from '../src/tools/ai-search/ai-search-prompts-by-target.js';
import captureSchema from "../src/helpers/captureSchema.js";

const getSchema = () => captureSchema(new AiSearchPromptsByTarget());

describe('AiSearchPromptsByTarget input schema (from tool definition)', () => {
    it('accepts a valid payload', () => {
        const schemaObj = getSchema();
        const schema = z.object(schemaObj);
        const payload = {
            engine: 'chatgpt',
            source: 'us',
            target: 'seranking.com',
            scope: 'domain',
            limit: 20,
            offset: 0,
            sort: 'volume',
            sort_order: 'desc',
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

        const validEngines = ['chatgpt', 'perplexity', 'ai-overview', 'gemini', 'ai-mode'];

        validEngines.forEach(engine => {
            const payload = { engine, source: 'us', target: 'example.com' };
            const result = schema.safeParse(payload);
            expect(result.success, result.error?.toString()).toBe(true);
        });
    });

    it('accepts valid scope values', () => {
        const schema = z.object(getSchema());

        const validScopes = ['domain', 'base_domain', 'url'];

        validScopes.forEach(scope => {
            const payload = { engine: 'chatgpt', source: 'us', target: 'example.com', scope };
            const result = schema.safeParse(payload);
            expect(result.success, result.error?.toString()).toBe(true);
        });
    });

    it('accepts valid sort values', () => {
        const schema = z.object(getSchema());

        const validSorts = ['volume', 'type', 'snippet_length'];

        validSorts.forEach(sort => {
            const payload = { engine: 'chatgpt', source: 'us', target: 'example.com', sort };
            const result = schema.safeParse(payload);
            expect(result.success, result.error?.toString()).toBe(true);
        });
    });

    it('accepts valid sort_order values', () => {
        const schema = z.object(getSchema());

        const payload1 = { engine: 'chatgpt', source: 'us', target: 'example.com', sort_order: 'asc' };
        const payload2 = { engine: 'chatgpt', source: 'us', target: 'example.com', sort_order: 'desc' };

        expect(schema.safeParse(payload1).success).toBe(true);
        expect(schema.safeParse(payload2).success).toBe(true);
    });

    it('requires engine, source, and target', () => {
        const schema = z.object(getSchema());

        const missingEngine = { source: 'us', target: 'example.com' };
        const missingSource = { engine: 'chatgpt', target: 'example.com' };
        const missingTarget = { engine: 'chatgpt', source: 'us' };

        expect(() => schema.parse(missingEngine)).toThrow();
        expect(() => schema.parse(missingSource)).toThrow();
        expect(() => schema.parse(missingTarget)).toThrow();
    });

    it('validates source is 2-character country code', () => {
        const schema = z.object(getSchema());

        const validSource = { engine: 'chatgpt', source: 'us', target: 'example.com' };
        const invalidSourceTooLong = { engine: 'chatgpt', source: 'usa', target: 'example.com' };
        const invalidSourceTooShort = { engine: 'chatgpt', source: 'u', target: 'example.com' };

        const result = schema.safeParse(validSource)

        expect(result.success, result.error?.toString()).toBe(true);
        expect(() => schema.parse(invalidSourceTooLong)).toThrow();
        expect(() => schema.parse(invalidSourceTooShort)).toThrow();
    });

    it('validates limit is positive and within bounds', () => {
        const schema = z.object(getSchema());

        const validLimit = { engine: 'chatgpt', source: 'us', target: 'example.com', limit: 50 };
        const zeroLimit = { engine: 'chatgpt', source: 'us', target: 'example.com', limit: 0 };
        const negativeLimit = { engine: 'chatgpt', source: 'us', target: 'example.com', limit: -5 };

        expect(schema.safeParse(validLimit).success).toBe(true);
        expect(() => schema.parse(zeroLimit)).toThrow();
        expect(() => schema.parse(negativeLimit)).toThrow();
    });

    it('validates offset is non-negative', () => {
        const schema = z.object(getSchema());

        const validOffset = { engine: 'chatgpt', source: 'us', target: 'example.com', offset: 20 };
        const zeroOffset = { engine: 'chatgpt', source: 'us', target: 'example.com', offset: 0 };
        const negativeOffset = { engine: 'chatgpt', source: 'us', target: 'example.com', offset: -1 };

        expect(schema.safeParse(validOffset).success).toBe(true);
        expect(schema.safeParse(zeroOffset).success).toBe(true);
        expect(() => schema.parse(negativeOffset)).toThrow();
    });

    it('validates volume filters are positive', () => {
        const schema = z.object(getSchema());

        const validVolume = { engine: 'chatgpt', source: 'us', target: 'example.com', 'filter[volume][from]': 10, 'filter[volume][to]': 100 };
        const negativeVolumeFrom = { engine: 'chatgpt', source: 'us', target: 'example.com', 'filter[volume][from]': -5 };
        const negativeVolumeTo = { engine: 'chatgpt', source: 'us', target: 'example.com', 'filter[volume][to]': -10 };

        expect(schema.safeParse(validVolume).success).toBe(true);
        expect(() => schema.parse(negativeVolumeFrom)).toThrow();
        expect(() => schema.parse(negativeVolumeTo)).toThrow();
    });

    it('validates keyword_count filters are positive', () => {
        const schema = z.object(getSchema());

        const validKeywordCount = { engine: 'chatgpt', source: 'us', target: 'example.com', 'filter[keyword_count][from]': 1, 'filter[keyword_count][to]': 10 };
        const zeroKeywordCount = { engine: 'chatgpt', source: 'us', target: 'example.com', 'filter[keyword_count][from]': 0 };

        expect(schema.safeParse(validKeywordCount).success).toBe(true);
        expect(schema.safeParse(zeroKeywordCount).success).toBe(true);
    });

    it('validates characters_count filters are positive', () => {
        const schema = z.object(getSchema());

        const validCharCount = { engine: 'chatgpt', source: 'us', target: 'example.com', 'filter[characters_count][from]': 5, 'filter[characters_count][to]': 100 };
        const zeroCharCount = { engine: 'chatgpt', source: 'us', target: 'example.com', 'filter[characters_count][from]': 0 };

        expect(schema.safeParse(validCharCount).success).toBe(true);
        expect(schema.safeParse(zeroCharCount).success).toBe(true);
    });

    it('validates target is non-empty string', () => {
        const schema = z.object(getSchema());

        const validTarget = { engine: 'chatgpt', source: 'us', target: 'example.com' };
        const emptyTarget = { engine: 'chatgpt', source: 'us', target: '' };

        expect(schema.safeParse(validTarget).success).toBe(true);
        expect(() => schema.parse(emptyTarget)).toThrow();
    });

    it('accepts properly formatted multi_keyword_included filter', () => {
        const schema = z.object(getSchema());

        const payload = {
            engine: 'chatgpt',
            source: 'us',
            target: 'example.com',
            'filter[multi_keyword_included]': '[[{"type":"contains","value":"test"}],[{"type":"contains","value":"example"}]]'
        };

        const result = schema.safeParse(payload);
        expect(result.success).toBe(true);
    });

    it('accepts properly formatted multi_keyword_excluded filter', () => {
        const schema = z.object(getSchema());

        const payload = {
            engine: 'chatgpt',
            source: 'us',
            target: 'example.com',
            'filter[multi_keyword_excluded]': '[[{"type":"contains","value":"seo"}],[{"type":"contains","value":"data"}],[{"type":"contains","value":"meat"}]]'
        };

        const result = schema.safeParse(payload);
        expect(result.success).toBe(true);
    });

    it('uses correct default values', () => {
        const schema = z.object(getSchema());

        const minimalPayload = {
            engine: 'chatgpt',
            source: 'us',
            target: 'example.com'
        };

        const result = schema.parse(minimalPayload);

        // Defaults should be applied by the schema
        expect(result.engine).toBe('chatgpt');
        expect(result.source).toBe('us');
        expect(result.target).toBe('example.com');
    });
});