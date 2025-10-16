import { McpServerMock }    from "../classes/McpServerMock.js";
import { DataApiMcpServer } from "../data-api-mcp-server.js";
import { McpServer }      from "@modelcontextprotocol/sdk/server/mcp.js";

export const getAllTools = () => {
    const server = new McpServerMock();
    (new DataApiMcpServer(server as unknown as McpServer)).init();
    return server.tools;
}