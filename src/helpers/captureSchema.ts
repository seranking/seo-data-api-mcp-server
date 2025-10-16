import { BaseTool } from '../tools/base-tool.js';

// used to mock the tool's inputSchema for testing purposes
export default function captureSchema(tool: BaseTool) {
  let captured: any = null;

  const mockServer = {
    registerTool: (_name: string, def: any) => {
      captured = def?.inputSchema;
    },
  } as any;

  tool.registerTool(mockServer);

  return captured as Record<string, any>;
}
