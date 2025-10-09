import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { BaseTool } from "./../base-tool.js";

export class DomainCompetitors extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      "domainCompetitors",
      {
        title: "Domain Competitors",
        description: "Fetch domain competitors (v1/domain/competitors)",
        inputSchema: {
          source: z.string().min(1, "source is required").max(2)
            .describe("Alpha-2 country code of the regional keyword database."),
          domain: z.string().min(1, "domain is required")
            .describe("The primary domain for which to find competitors."),
          type: z.enum(["organic", "adv"]).optional()
            .default("organic")
            .describe("Specifies whether to find competitors in organic search results or paid search (advertising)."),
          stats: z.number().int().min(0).max(1).optional()
            .default(0)
            .describe("A flag to control the level of detail in the response. If set to “1”, additional statistical parameters are returned for each competitor."),
        }
      },
      async (params) => this.makeGetRequest('/v1/domain/competitors', params)
    );
  }
}
