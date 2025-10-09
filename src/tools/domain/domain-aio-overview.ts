import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { BaseTool } from "./../base-tool.js";

export class DomainAioOverview extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      "domainAioOverview",
      {
        title: "AIO Overview",
        description: "Fetch AI Overviews domain metrics (v1/domain/aio/overview)",
        inputSchema: {
          source: z.string().min(1, "source is required").max(2)
            .describe("The alpha-2 country code for the regional database. Example: us"),
          target: z.string().min(1, "target is required")
            .describe("The domain, subdomain, or URL to analyze. Example: seranking.com"),
          scope: z.enum(["base_domain", "domain", "url"])
            .default("base_domain")
            .describe("The scope of the analysis. Can be base_domain (domain and all subdomains), domain (specific host), or url (exact URL)."),
        }
      },
      async (params) => this.makeGetRequest('/v1/domain/aio/overview', params)
    );
  }
}
