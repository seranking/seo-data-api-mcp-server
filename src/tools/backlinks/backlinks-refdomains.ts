import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { BaseTool } from "./../base-tool.js";
import { MODES, OUTPUT_FORMATS } from "./constants.js";

export class BacklinksRefdomains extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            "backlinksRefdomains",
            {
                title: "Backlinks Referring Domains",
                description:
                    "Fetch referring domains pointing to a single target with sorting and limit controls (v1/backlinks/refdomains)",
                inputSchema: {
                    target: z
                        .string()
                        .min(1, "target is required")
                        .describe("Target to analyze: root domain, host (subdomain), or full URL."),
                    mode: z
                        .enum(MODES)
                        .optional()
                        .default("host")
                        .describe(
                            "Scope: 'domain' (incl. subdomains), 'host' (no subdomains), or 'url' (single URL). Default: host."
                        ),
                    order_by: z
                        .enum(["date_found", "domain_inlink_rank", "inlink_rank"])
                        .optional()
                        .default("date_found")
                        .describe(
                            "Sort field: 'date_found' (most recent first), 'domain_inlink_rank' (highest first), or 'inlink_rank' (homepage IR highest first)."
                        ),
                    limit: z
                        .number()
                        .int()
                        .positive()
                        .min(1)
                        .max(10000)
                        .optional()
                        .default(100)
                        .describe("Max results to return (1–10,000). Default: 100."),
                    output: z
                        .enum(OUTPUT_FORMATS)
                        .optional()
                        .default("json")
                        .describe("Response format. Default: json."),
                },
            },
            async (params) => this.makeGetRequest("/v1/backlinks/refdomains", params)

        );
    }
}
