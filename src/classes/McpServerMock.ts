import { MockServerTools } from '../types/MockServerTools.js';

export class McpServerMock {
  public tools: Array<MockServerTools> = [];

  registerTool(name: string, def: any, handler: any) {
    this.tools.push({
      inputSchema: {},
      name,
      def,
      handler,
    });
  }
}
