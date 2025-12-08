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
      'addSerpTasks',
      'createAdvancedAudit',
      'createStandardAudit',
      'deleteAudit',
      'exportBacklinksData',
      'exportKeywords',
      'getAiOverview',
      'getAiPromptsByBrand',
      'getAiPromptsByTarget',
      'getAllBacklinks',
      'getAuditHistory',
      'getAuditPagesByIssue',
      'getAuditReport',
      'getAuditStatus',
      'getBacklinksAnchors',
      'getBacklinksAuthority',
      'getBacklinksIndexedPages',
      'getBacklinksRefDomains',
      'getBacklinksSummary',
      'getCrawledPages',
      'getCumulativeBacklinksHistory',
      'getDistributionOfDomainAuthority',
      'getDomainAdsByDomain',
      'getDomainAdsByKeyword',
      'getDomainAuthority',
      'getDomainCompetitors',
      'getDomainKeywords',
      'getDomainKeywordsComparison',
      'getDomainOverviewDatabases',
      'getDomainOverviewHistory',
      'getDomainOverviewWorldwide',
      'getFoundLinks',
      'getIssuesByUrl',
      'getKeywordQuestions',
      'getLongTailKeywords',
      'getNewLostRefDomainsCount',
      'getPageAuthority',
      'getPageAuthorityHistory',
      'getReferringIps',
      'getReferringIpsCount',
      'getReferringSubnetsCount',
      'getRelatedKeywords',
      'getSerpLocations',
      'getSerpTaskAdvancedResults',
      'getSerpTaskResults',
      'getSerpTasks',
      'getSimilarKeywords',
      'listAudits',
      'listNewLostReferringDomains',
      'recheckAudit',
      'updateAuditTitle',
    ].sort();

    expect(names).toEqual(expected);

    // Basic sanity: each registered tool exposes an inputSchema object
    for (const t of server.tools) {
      expect(typeof t.inputSchema, `Server tool ${t.name} is not an object`).toBe('object');
    }
  });

  it('registers all expected prompts with the MCP server', () => {
    const server = new McpServerMock();
    const dataApi = new DataApiMcpServer(server as unknown as McpServer);

    dataApi.init();

    const names = server.prompts.map((p: { name: any }) => p.name).sort();

    const expected = [
      'serp-analysis',
      'backlink-gap',
      'domain-traffic-competitors',
      'keyword-clusters',
      'ai-share-of-voice',
    ].sort();

    expect(names).toEqual(expected);
  });
});
