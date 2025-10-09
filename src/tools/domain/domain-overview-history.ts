import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { BaseTool } from "./../base-tool.js";

export class DomainOverviewHistory extends BaseTool {
  registerTool(server: McpServer): void {
    server.registerTool(
      "domainOverviewHistory",
      {
        title: "Domain Overview History",
        description: "Fetch domain historical overview (v1/domain/overview/history)",
        inputSchema: {
          source: z.string().min(1, "source is required").max(2)
            .describe("Alpha-2 country code of the regional keyword database."),
          domain: z.string().min(1, "domain is required")
            .describe("The domain name for which to retrieve historical performance data."),
          type: z.enum(["organic", "adv"]).optional()
            .default("organic")
            .describe("Specifies whether to retrieve historical data for organic search traffic or paid search (advertising) traffic."),
        }
      },
      async (params) => this.makeGetRequest('/v1/domain/overview/history', params)
    );
  }
}
