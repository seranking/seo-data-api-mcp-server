import { z } from 'zod';

export const commonSchemas = {
  domain: z
    .string()
    .min(1, 'domain is required')
    .describe('The domain for which to retrieve database data.'),
  target: z.string().min(1, 'target is required').describe('The target to analyze.'),
  source: z
    .string()
    .min(2, 'source must be alpha-2 country code')
    .max(2)
    .describe('Alpha-2 country code.'),
  limit: z.number().int().min(1).max(1000).optional().describe('Limit the number of results.'),
  offset: z.number().int().min(0).optional().describe('Offset for pagination.'),
  engine: z
    .string()
    .min(1, 'engine is required')
    .describe('The LLM to query (e.g., ai-overview, chatgpt, perplexity, gemini, ai-mode).'),
};
