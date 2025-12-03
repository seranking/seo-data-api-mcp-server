import { MockServerTools } from '../types/MockServerTools.js';

export class McpServerMock {
  public tools: Array<MockServerTools> = [];

  public prompts: Array<any> = [];
  public logs: Array<any> = [];

  registerTool(name: string, def: any, handler: any) {
    this.tools.push({
      inputSchema: {},
      name,
      def,
      handler,
    });
  }

  prompt(name: string, def: any, handler: any) {
    this.prompts.push({
      name,
      def,
      handler,
    });
  }

  sendLoggingMessage(log: any) {
    this.logs.push(log);
  }
}
