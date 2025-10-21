export type MockServerTools = {
  name: string;
  def: any;
  handler: (params: any) => Promise<any> | any;
  inputSchema: any;
};
