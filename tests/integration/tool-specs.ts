// Import all tools
import { GetAiOverview } from '../../src/tools/ai-search/ai-search-overview.js';
import { GetAiPromptsByBrand } from '../../src/tools/ai-search/ai-search-prompts-by-brand.js';
import { GetAiPromptsByTarget } from '../../src/tools/ai-search/ai-search-prompts-by-target.js';
import { GetAllBacklinks } from '../../src/tools/backlinks/backlinks-all.js';
import { GetBacklinksAnchors } from '../../src/tools/backlinks/backlinks-anchors.js';
import { GetBacklinksAuthority } from '../../src/tools/backlinks/backlinks-authority.js';
import { GetDomainAuthority } from '../../src/tools/backlinks/backlinks-authority-domain.js';
import { GetDistributionOfDomainAuthority } from '../../src/tools/backlinks/backlinks-authority-domain-distribution.js';
import { GetPageAuthority } from '../../src/tools/backlinks/backlinks-authority-page.js';
import { GetPageAuthorityHistory } from '../../src/tools/backlinks/backlinks-authority-page-history.js';
import { ExportBacklinksData } from '../../src/tools/backlinks/backlinks-export.js';
import { GetCumulativeBacklinksHistory } from '../../src/tools/backlinks/backlinks-history-cumulative.js';
import { GetBacklinksIndexedPages } from '../../src/tools/backlinks/backlinks-indexed-pages.js';
import { GetBacklinksRefDomains } from '../../src/tools/backlinks/backlinks-refdomains.js';
import { ListNewLostReferringDomains } from '../../src/tools/backlinks/backlinks-refdomains-history.js';
import { GetNewLostRefDomainsCount } from '../../src/tools/backlinks/backlinks-refdomains-history-count.js';
import { GetReferringIps } from '../../src/tools/backlinks/backlinks-referring-ips.js';
import { GetReferringIpsCount } from '../../src/tools/backlinks/backlinks-referring-ips-count.js';
import { GetReferringSubnetsCount } from '../../src/tools/backlinks/backlinks-referring-subnets-count.js';
import { GetBacklinksSummary } from '../../src/tools/backlinks/backlinks-summary.js';
import { BaseTool } from '../../src/tools/base-tool.js';
import { GetDomainAdsByDomain } from '../../src/tools/domain/domain-ads-by-domain.js';
import { GetDomainAdsByKeyword } from '../../src/tools/domain/domain-ads-by-keyword.js';
import { GetDomainCompetitors } from '../../src/tools/domain/domain-competitors.js';
import { GetDomainKeywords } from '../../src/tools/domain/domain-keywords.js';
import { GetDomainKeywordsComparison } from '../../src/tools/domain/domain-keywords-comparison.js';
import { GetDomainOverviewDatabases } from '../../src/tools/domain/domain-overview-db.js';
import { GetDomainOverviewHistory } from '../../src/tools/domain/domain-overview-history.js';
import { GetDomainOverviewWorldwide } from '../../src/tools/domain/domain-overview-worldwide.js';
import { ExportKeywords } from '../../src/tools/keywords/keywords-export.js';
import { GetLongTailKeywords } from '../../src/tools/keywords/keywords-longtail.js';
import { GetKeywordQuestions } from '../../src/tools/keywords/keywords-questions.js';
import { GetRelatedKeywords } from '../../src/tools/keywords/keywords-related.js';
import { GetSimilarKeywords } from '../../src/tools/keywords/keywords-similar.js';
import { AddSerpTasks } from '../../src/tools/serp/serp-add-tasks.js';
import { GetSerpLocations } from '../../src/tools/serp/serp-get-locations.js';
import { GetSerpTaskAdvancedResults } from '../../src/tools/serp/serp-get-task-advanced-results.js';
import { GetSerpTaskResults } from '../../src/tools/serp/serp-get-task-results.js';
import { GetSerpTasks } from '../../src/tools/serp/serp-get-tasks.js';
import { CreateAdvancedAudit } from '../../src/tools/website-audit/create-advanced-audit.js';
import { CreateStandardAudit } from '../../src/tools/website-audit/create-standard-audit.js';
import { DeleteAudit } from '../../src/tools/website-audit/delete-audit.js';
import { GetAuditHistory } from '../../src/tools/website-audit/get-audit-history.js';
import { GetAuditPagesByIssue } from '../../src/tools/website-audit/get-audit-pages-by-issue.js';
import { GetAuditReport } from '../../src/tools/website-audit/get-audit-report.js';
import { GetAuditStatus } from '../../src/tools/website-audit/get-audit-status.js';
import { GetCrawledPages } from '../../src/tools/website-audit/get-crawled-pages.js';
import { GetFoundLinks } from '../../src/tools/website-audit/get-found-links.js';
import { GetIssuesByUrl } from '../../src/tools/website-audit/get-issues-by-url.js';
import { ListAudits } from '../../src/tools/website-audit/list-audits.js';
import { RecheckAudit } from '../../src/tools/website-audit/recheck-audit.js';
import { UpdateAuditTitle } from '../../src/tools/website-audit/update-audit-title.js';

export interface ToolSpec {
  name: string;
  ToolClass: new () => BaseTool;
  payload: Record<string, any>;
  expectedUrl: string;
  expectedMethod: 'GET' | 'POST' | 'DELETE' | 'PATCH';
}

export const toolSpecs: ToolSpec[] = [
  // AI Search
  {
    name: 'GetAiOverview',
    ToolClass: GetAiOverview,
    payload: { target: 'example.com', source: 'us', scope: 'domain' },
    expectedUrl: '/v1/ai-search/overview',
    expectedMethod: 'GET',
  },
  {
    name: 'GetAiPromptsByBrand',
    ToolClass: GetAiPromptsByBrand,
    payload: { brand: 'Brand', source: 'us', engine: 'chatgpt' },
    expectedUrl: '/v1/ai-search/prompts-by-brand',
    expectedMethod: 'GET',
  },
  {
    name: 'GetAiPromptsByTarget',
    ToolClass: GetAiPromptsByTarget,
    payload: { target: 'example.com', source: 'us', engine: 'chatgpt' },
    expectedUrl: '/v1/ai-search/prompts-by-target',
    expectedMethod: 'GET',
  },
  // Backlinks
  {
    name: 'GetAllBacklinks',
    ToolClass: GetAllBacklinks,
    payload: { target: 'example.com', limit: 10 },
    expectedUrl: '/v1/backlinks/all',
    expectedMethod: 'GET',
  },
  {
    name: 'GetBacklinksSummary',
    ToolClass: GetBacklinksSummary,
    payload: { target: 'example.com' },
    expectedUrl: '/v1/backlinks/summary',
    expectedMethod: 'GET',
  },
  {
    name: 'GetBacklinksAnchors',
    ToolClass: GetBacklinksAnchors,
    payload: { target: 'example.com' },
    expectedUrl: '/v1/backlinks/anchors',
    expectedMethod: 'GET',
  },
  {
    name: 'GetBacklinksAuthority',
    ToolClass: GetBacklinksAuthority,
    payload: { target: 'example.com' },
    expectedUrl: '/v1/backlinks/authority',
    expectedMethod: 'GET',
  },
  {
    name: 'GetBacklinksIndexedPages',
    ToolClass: GetBacklinksIndexedPages,
    payload: { target: 'example.com' },
    expectedUrl: '/v1/backlinks/indexed-pages',
    expectedMethod: 'GET',
  },
  {
    name: 'GetBacklinksRefDomains',
    ToolClass: GetBacklinksRefDomains,
    payload: { target: 'example.com' },
    expectedUrl: '/v1/backlinks/refdomains',
    expectedMethod: 'GET',
  },
  {
    name: 'GetCumulativeBacklinksHistory',
    ToolClass: GetCumulativeBacklinksHistory,
    payload: { target: 'example.com' },
    expectedUrl: '/v1/backlinks/history/cumulative',
    expectedMethod: 'GET',
  },
  // Domain
  {
    name: 'GetDomainOverviewDatabases',
    ToolClass: GetDomainOverviewDatabases,
    payload: { domain: 'example.com' },
    expectedUrl: '/v1/domain/overview/db',
    expectedMethod: 'GET',
  },
  {
    name: 'GetDomainOverviewWorldwide',
    ToolClass: GetDomainOverviewWorldwide,
    payload: { domain: 'example.com' },
    expectedUrl: '/v1/domain/overview/worldwide',
    expectedMethod: 'GET',
  },
  {
    name: 'GetDomainCompetitors',
    ToolClass: GetDomainCompetitors,
    payload: { domain: 'example.com', source: 'us' },
    expectedUrl: '/v1/domain/competitors',
    expectedMethod: 'GET',
  },
  {
    name: 'GetDomainKeywords',
    ToolClass: GetDomainKeywords,
    payload: { domain: 'example.com', source: 'us' },
    expectedUrl: '/v1/domain/keywords',
    expectedMethod: 'GET',
  },
  // Keywords
  {
    name: 'GetSimilarKeywords',
    ToolClass: GetSimilarKeywords,
    payload: { keyword: 'seo', source: 'us' },
    expectedUrl: '/v1/keywords/similar',
    expectedMethod: 'GET',
  },
  {
    name: 'GetRelatedKeywords',
    ToolClass: GetRelatedKeywords,
    payload: { keyword: 'seo', source: 'us' },
    expectedUrl: '/v1/keywords/related',
    expectedMethod: 'GET',
  },
  {
    name: 'GetKeywordQuestions',
    ToolClass: GetKeywordQuestions,
    payload: { keyword: 'seo', source: 'us' },
    expectedUrl: '/v1/keywords/questions',
    expectedMethod: 'GET',
  },
  {
    name: 'GetLongTailKeywords',
    ToolClass: GetLongTailKeywords,
    payload: { keyword: 'seo', source: 'us' },
    expectedUrl: '/v1/keywords/longtail',
    expectedMethod: 'GET',
  },
  // SERP
  {
    name: 'GetSerpTasks',
    ToolClass: GetSerpTasks,
    payload: {},
    expectedUrl: '/v1/serp/classic/tasks',
    expectedMethod: 'GET',
  },
  {
    name: 'GetSerpLocations',
    ToolClass: GetSerpLocations,
    payload: { q: 'new york', country_code: 'us' },
    expectedUrl: '/v1/serp/classic/locations',
    expectedMethod: 'GET',
  },
  // Website Audit
  {
    name: 'ListAudits',
    ToolClass: ListAudits,
    payload: {},
    expectedUrl: '/v1/site-audit/audits',
    expectedMethod: 'GET',
  },
  {
    name: 'CreateStandardAudit',
    ToolClass: CreateStandardAudit,
    payload: { title: 'My Audit', domain: 'example.com' },
    expectedUrl: '/v1/site-audit/audits',
    expectedMethod: 'POST',
  },
  {
    name: 'CreateAdvancedAudit',
    ToolClass: CreateAdvancedAudit,
    payload: { title: 'Advanced Audit', domain: 'example.com', limit: 100 },
    expectedUrl: '/v1/site-audit/audits',
    expectedMethod: 'POST',
  },
  {
    name: 'GetAuditStatus',
    ToolClass: GetAuditStatus,
    payload: { audit_id: '123' },
    expectedUrl: '/v1/site-audit/audits/status',
    expectedMethod: 'GET',
  },
  {
    name: 'GetAuditReport',
    ToolClass: GetAuditReport,
    payload: { audit_id: '123' },
    expectedUrl: '/v1/site-audit/audits/report',
    expectedMethod: 'GET',
  },
  {
    name: 'GetCrawledPages',
    ToolClass: GetCrawledPages,
    payload: { audit_id: '123' },
    expectedUrl: '/v1/site-audit/audits/pages',
    expectedMethod: 'GET',
  },
  {
    name: 'GetAuditPagesByIssue',
    ToolClass: GetAuditPagesByIssue,
    payload: { audit_id: '123', issue_sys_name: 'broken_links' },
    expectedUrl: '/v1/site-audit/audits/issue-pages',
    expectedMethod: 'GET',
  },
  {
    name: 'GetIssuesByUrl',
    ToolClass: GetIssuesByUrl,
    payload: { audit_id: '123', page_url: 'https://example.com' },
    expectedUrl: '/v1/site-audit/audits/issues',
    expectedMethod: 'GET',
  },
  {
    name: 'GetFoundLinks',
    ToolClass: GetFoundLinks,
    payload: { audit_id: '123', page_url: 'https://example.com' },
    expectedUrl: '/v1/site-audit/audits/links',
    expectedMethod: 'GET',
  },
  {
    name: 'GetAuditHistory',
    ToolClass: GetAuditHistory,
    payload: { audit_id: '123' },
    expectedUrl: '/v1/site-audit/audits/history',
    expectedMethod: 'GET',
  },
  {
    name: 'UpdateAuditTitle',
    ToolClass: UpdateAuditTitle,
    payload: { audit_id: '123', title: 'New Title' },
    expectedUrl: '/v1/site-audit/audits',
    expectedMethod: 'PATCH',
  },
  {
    name: 'DeleteAudit',
    ToolClass: DeleteAudit,
    payload: { audit_id: '123' },
    expectedUrl: '/v1/site-audit/audits',
    expectedMethod: 'DELETE',
  },
  {
    name: 'RecheckAudit',
    ToolClass: RecheckAudit,
    payload: { audit_id: '123' },
    expectedUrl: '/v1/site-audit/audits/recheck',
    expectedMethod: 'POST',
  },
  // Missing Backlinks Tools
  {
    name: 'GetReferringIps',
    ToolClass: GetReferringIps,
    payload: { target: 'example.com' },
    expectedUrl: '/v1/backlinks/referring-ips',
    expectedMethod: 'GET',
  },
  {
    name: 'GetReferringIpsCount',
    ToolClass: GetReferringIpsCount,
    payload: { target: 'example.com' },
    expectedUrl: '/v1/backlinks/referring-ips/count',
    expectedMethod: 'GET',
  },
  {
    name: 'GetReferringSubnetsCount',
    ToolClass: GetReferringSubnetsCount,
    payload: { target: 'example.com' },
    expectedUrl: '/v1/backlinks/referring-subnets/count',
    expectedMethod: 'GET',
  },
  {
    name: 'GetDistributionOfDomainAuthority',
    ToolClass: GetDistributionOfDomainAuthority,
    payload: { target: 'example.com' },
    expectedUrl: '/v1/backlinks/authority/domain/distribution',
    expectedMethod: 'GET',
  },
  {
    name: 'GetPageAuthority',
    ToolClass: GetPageAuthority,
    payload: { target: 'example.com' },
    expectedUrl: '/v1/backlinks/authority/page',
    expectedMethod: 'GET',
  },
  {
    name: 'GetPageAuthorityHistory',
    ToolClass: GetPageAuthorityHistory,
    payload: { target: 'example.com' },
    expectedUrl: '/v1/backlinks/authority/page/history',
    expectedMethod: 'GET',
  },
  {
    name: 'GetDomainAuthority',
    ToolClass: GetDomainAuthority,
    payload: { target: 'example.com' },
    expectedUrl: '/v1/backlinks/authority/domain',
    expectedMethod: 'GET',
  },
  {
    name: 'ListNewLostReferringDomains',
    ToolClass: ListNewLostReferringDomains,
    payload: { target: 'example.com', date_from: '2023-01-01', date_to: '2023-01-31' },
    expectedUrl: '/v1/backlinks/refdomains/history',
    expectedMethod: 'GET',
  },
  {
    name: 'GetNewLostRefDomainsCount',
    ToolClass: GetNewLostRefDomainsCount,
    payload: { target: 'example.com', date_from: '2023-01-01', date_to: '2023-01-31' },
    expectedUrl: '/v1/backlinks/refdomains/history/count',
    expectedMethod: 'GET',
  },
  {
    name: 'ExportBacklinksData',
    ToolClass: ExportBacklinksData,
    payload: { target: 'example.com', export_type: 'backlinks' },
    expectedUrl: '/v1/backlinks/export',
    expectedMethod: 'GET',
  },
  // Missing SERP Tools
  {
    name: 'AddSerpTasks',
    ToolClass: AddSerpTasks,
    payload: { query: 'test', search_engine: 'google', location_id: 1, language_code: 'en' },
    expectedUrl: '/v1/serp/classic/tasks',
    expectedMethod: 'POST',
  },
  {
    name: 'GetSerpTaskResults',
    ToolClass: GetSerpTaskResults,
    payload: { task_id: '123' },
    expectedUrl: '/v1/serp/classic/tasks', // The URL is the same base, param differentiates
    expectedMethod: 'GET',
  },
  {
    name: 'GetSerpTaskAdvancedResults',
    ToolClass: GetSerpTaskAdvancedResults,
    payload: { task_id: '123' },
    expectedUrl: '/v1/serp/classic/tasks/results_advanced',
    expectedMethod: 'GET',
  },
  // Missing Domain Tools
  {
    name: 'GetDomainOverviewHistory',
    ToolClass: GetDomainOverviewHistory,
    payload: { domain: 'example.com', source: 'us' },
    expectedUrl: '/v1/domain/overview/history',
    expectedMethod: 'GET',
  },
  {
    name: 'GetDomainAdsByKeyword',
    ToolClass: GetDomainAdsByKeyword,
    payload: { domain: 'example.com', source: 'us' },
    expectedUrl: '/v1/domain/ads', // Check if param differentiates
    expectedMethod: 'GET',
  },
  {
    name: 'GetDomainAdsByDomain',
    ToolClass: GetDomainAdsByDomain,
    payload: { domain: 'example.com', source: 'us' },
    expectedUrl: '/v1/domain/ads',
    expectedMethod: 'GET',
  },
  {
    name: 'GetDomainKeywordsComparison',
    ToolClass: GetDomainKeywordsComparison,
    payload: { domain: 'example.com', source: 'us', domains: ['competitor.com'] },
    expectedUrl: '/v1/domain/keywords/comparison',
    expectedMethod: 'GET',
  },
  // Missing Keywords Tools
  {
    name: 'ExportKeywords',
    ToolClass: ExportKeywords,
    payload: { keywords: ['test'], country_code: 'us' },
    expectedUrl: '/v1/keywords/export',
    expectedMethod: 'POST',
  },
];
