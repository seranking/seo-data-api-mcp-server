import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, expect, it } from 'vitest';

import { McpServerMock } from '../src/classes/McpServerMock.js';
import { DataApiMcpServer } from '../src/data-api-mcp-server.js';

describe('DataApiMcpServer tool registration', () => {
  it('registers all expected tools with the MCP server', () => {
    const server = new McpServerMock();
    const dataApi = new DataApiMcpServer(server as unknown as McpServer);

    dataApi.init();

    const names = server.tools.map((t: { name: any }) => t.name).sort();

    // Ensure specific tool names are present
    const expected = [
      //ai tools
      'aiSearchOverview',
      'aiSearchPromptsByBrand',
      'aiSearchPromptsByTarget',
      // backlinks
      'backlinksAll',
      'backlinksAnchors',
      'backlinksAuthority',
      'backlinksIndexedPages',
      'backlinksRefdomains',
      'backlinksSummary',
      // domain
      'domainOverview',
      'domainOverviewDb',
      'domainOverviewWorldwide',
      'domainOverviewHistory',
      'domainKeywords',
      'domainAdsByKeyword',
      'domainAdsByDomain',
      'domainCompetitors',
      'domainKeywordsComparison',
      'domainKeywordsReverseComparison',
      'domainAioOverview',
      'domainAioDiscoverBrand',
      'domainAioKeywordsByTarget',
      'domainAioKeywordsByBrand',
      // keywords
      'keywordsSimilar',
      'keywordsRelated',
      'keywordsQuestions',
      'keywordsLongtail',
      'keywordsExport',
    ].sort();

    expect(names).toEqual(expected);

    // Basic sanity: each registered tool exposes an inputSchema object
    for (const t of server.tools) {
      expect(typeof t.inputSchema, `Server tool ${t.name} is not an object`).toBe('object');
    }
  });
});
