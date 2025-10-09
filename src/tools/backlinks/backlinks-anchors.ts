import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { BaseTool } from "./../base-tool.js";
import { MODES, OUTPUT_FORMATS } from "./constants.js";

export class BacklinksAnchors extends BaseTool {
    registerTool(server: McpServer): void {
        server.registerTool(
            "backlinksAnchors",
            {
                title: "Backlinks Anchors",
                description:
                    "Fetch anchor texts of backlinks pointing to a single target with sorting and limit controls (v1/backlinks/anchors)",
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
                        .enum(["backlinks", "refdomains"])
                        .optional()
                        .default("backlinks")
                        .describe(
                            "Sort field (descending): 'backlinks' = total backlinks using the anchor; 'refdomains' = total referring domains using the anchor."
                        ),
                    limit: z
                        .number()
                        .int()
                        .positive()
                        .min(1)
                        .max(10000)
                        .optional()
                        .default(100)
                        .describe("Maximum number of results to return (1–10,000). Default: 100."),
                    output: z
                        .enum(OUTPUT_FORMATS)
                        .optional()
                        .default("json")
                        .describe("Response format. Default: json."),
                },
            },
            async (params) => this.makeGetRequest("/v1/backlinks/anchors", params)
        );
    }
}
