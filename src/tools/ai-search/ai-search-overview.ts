import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {z}         from "zod";
import {BaseTool}  from "./../base-tool.js";

/**
 * AiSearchOverview
 * - Calls SE Ranking AI Search “Overview” endpoint: /v1/ai-search/overview
 * - Uses request parameters exactly as per docs (target, scope, source, engine).
 * - Returns high-level overview metrics and trend time series.
 */
export class AiSearchOverview extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            "aiSearchOverview",
            {
                title: "AI Search Overview (SE Ranking)",
                description:
                    "Retrieve a high-level overview of a domain's performance in LLM: link presence, average position, AI traffic, and historical historical dynamics (trends over time).",
                inputSchema: {
                    target: z
                        .string()
                        .min(1, "target is required")
                        .describe(
                            "The target to analyze for LLM performance. Can be a root domain, subdomain, or a specific URL."
                        ),
                    scope: z
                        .enum(["domain", "base_domain", "url"])
                        .default("domain")
                        .describe(
                            "Scope of analysis: base_domain (the root domain only), domain (the domain including all subdomains), or url (an exact URL)."
                        ),
                    source: z
                        .string()
                        .min(2, "source is required and must be alpha-2 country code")
                        .max(2, "source must be alpha-2 country code")
                        .describe(
                            "Alpha-2 country code for the regional prompt database (e.g., us for United States results)."
                        ),
                    engine: z
                        .string()
                        .min(1, "engine is required")
                        .describe(
                            "The LLM to query (e.g., ai-overview, chatgpt, perplexity, gemini, ai-mode)."
                        ),
                },
            },
            async (params) => this.makeGetRequest("/v1/ai-search/overview", params)
        );
    }
}
