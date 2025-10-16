import {z} from "zod";

export const ExampleJsonFilter = '[[{"type":"contains","value":"seo"},{"type":"contains","value":"tools"}],[{"type":"contains","value":"backlinks"}]]';

export const InvalidFilterMessage = "Must be a URL-encoded JSON array of groups (each group is a non-empty array of clauses with type in begins|contains|ends|exact and non-empty value).";

export const FilterClause = z.object({
    type: z.enum(["begins", "contains", "ends", "exact"]),
    value: z.string().trim().min(1),
});

export const FilterGroup = z
    .array(z.array(FilterClause).min(1))
    .min(1);


export const FilterGroupRefineCallback = (input: string|undefined) => {
    if (input === undefined) return true;
    try {
        // decode and handle + as a space
        const decoded = decodeURIComponent(input.replace(/\+/g, " "));
        const parsed = JSON.parse(decoded);
        return FilterGroup.safeParse(parsed).success;
    } catch {
        return false;
    }
};

export const AISearchFilterObject = {
    "filter[volume][from]": z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Specifies the minimum volume of searches to be included in the results."),
    "filter[volume][to]": z
        .number()
        .int()
        .min(1)
        .optional()
        .describe("Specifies the maximum volume of searches to be included in the results."),
    "filter[keyword_count][from]": z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Specifies the minimum number of words in prompts."),
    "filter[keyword_count][to]": z
        .number()
        .int()
        .min(1)
        .optional()
        .describe("Specifies the maximum number of words in prompts."),
    "filter[characters_count][from]": z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Specifies the minimum prompt length in characters."),
    "filter[characters_count][to]": z
        .number()
        .int()
        .min(1)
        .optional()
        .describe("Specifies the maximum prompt length in characters."),
    "filter[multi_keyword_included]": z
        .string()
        .optional()
        .describe(`A URL-encoded JSON string specifying keywords that must be present in the prompt. For example: filter[multi_keyword_included]=${ExampleJsonFilter}`)
        .refine(FilterGroupRefineCallback, { message: InvalidFilterMessage}),
    "filter[multi_keyword_excluded]": z
        .string()
        .optional()
        .describe(`A URL-encoded JSON string specifying keywords that must NOT be present in the prompt. For example: filter[multi_keyword_excluded]=${ExampleJsonFilter}`)
        .refine(FilterGroupRefineCallback, { message: InvalidFilterMessage}),
}