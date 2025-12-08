import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { SERANKING_API_TOKEN } from './constants.js';
import { AiSearchOverview } from './tools/ai-search/ai-search-overview.js';
import { AiSearchPromptsByBrand } from './tools/ai-search/ai-search-prompts-by-brand.js';
import { AiSearchPromptsByTarget } from './tools/ai-search/ai-search-prompts-by-target.js';
import { BacklinksAll } from './tools/backlinks/backlinks-all.js';
import { BacklinksAnchors } from './tools/backlinks/backlinks-anchors.js';
import { BacklinksAuthority } from './tools/backlinks/backlinks-authority.js';
import { BacklinksIndexedPages } from './tools/backlinks/backlinks-indexed-pages.js';
import { BacklinksRefdomains } from './tools/backlinks/backlinks-refdomains.js';
import { BacklinksSummary } from './tools/backlinks/backlinks-summary.js';
import { setTokenProvider, TokenProvider } from './tools/base-tool.js';
import { DomainAdsByDomain } from './tools/domain/domain-ads-by-domain.js';
import { DomainAdsByKeyword } from './tools/domain/domain-ads-by-keyword.js';
import { DomainCompetitors } from './tools/domain/domain-competitors.js';
import { DomainKeywords } from './tools/domain/domain-keywords.js';
import { DomainKeywordsComparison } from './tools/domain/domain-keywords-comparison.js';
import { DomainOverview } from './tools/domain/domain-overview.js';
import { DomainOverviewDb } from './tools/domain/domain-overview-db.js';
import { DomainOverviewHistory } from './tools/domain/domain-overview-history.js';
import { DomainOverviewWorldwide } from './tools/domain/domain-overview-worldwide.js';
import { KeywordsExport } from './tools/keywords/keywords-export.js';
import { KeywordsLongtail } from './tools/keywords/keywords-longtail.js';
import { KeywordsQuestions } from './tools/keywords/keywords-questions.js';
import { KeywordsRelated } from './tools/keywords/keywords-related.js';
import { KeywordsSimilar } from './tools/keywords/keywords-similar.js';
import { SerpAddTasks } from './tools/serp/serp-add-tasks.js';
import { SerpGetTasks } from './tools/serp/serp-get-tasks.js';
import { SerpGetTaskResults } from './tools/serp/serp-get-task-results.js';
import { SerpGetTaskAdvancedResults } from './tools/serp/serp-get-task-advanced-results.js';
import { SerpGetLocations } from './tools/serp/serp-get-locations.js';
import { CreateStandardAudit } from './tools/website-audit/create-standard-audit.js';
import { CreateAdvancedAudit } from './tools/website-audit/create-advanced-audit.js';
import { ListAudits } from './tools/website-audit/list-audits.js';
import { GetAuditStatus } from './tools/website-audit/get-audit-status.js';
import { GetAuditReport } from './tools/website-audit/get-audit-report.js';
import { GetCrawledPages } from './tools/website-audit/get-crawled-pages.js';
import { GetAuditPagesByIssue } from './tools/website-audit/get-audit-pages-by-issue.js';
import { GetIssuesByUrl } from './tools/website-audit/get-issues-by-url.js';
import { GetFoundLinks } from './tools/website-audit/get-found-links.js';
import { GetAuditHistory } from './tools/website-audit/get-audit-history.js';
import { UpdateAuditTitle } from './tools/website-audit/update-audit-title.js';
import { DeleteAudit } from './tools/website-audit/delete-audit.js';
import { RecheckAudit } from './tools/website-audit/recheck-audit.js';
import { Prompts } from './prompts.js';

export class DataApiMcpServer {
  constructor(
    private readonly server: McpServer,
    private readonly opts?: { getToken?: TokenProvider },
  ) {
    if (this.opts?.getToken) {
      setTokenProvider(this.opts.getToken);
    } else {
      // default to env var if not provided
      setTokenProvider(() => process.env?.SERANKING_API_TOKEN || SERANKING_API_TOKEN);
    }
  }

  init(): void {
    const tools = [
      AiSearchOverview,
      AiSearchPromptsByBrand,
      AiSearchPromptsByTarget,
      BacklinksAll,
      BacklinksAnchors,
      BacklinksAuthority,
      BacklinksIndexedPages,
      BacklinksRefdomains,
      BacklinksSummary,
      DomainOverview,
      DomainOverviewDb,
      DomainOverviewWorldwide,
      DomainOverviewHistory,
      DomainKeywords,
      DomainAdsByKeyword,
      DomainAdsByDomain,
      DomainCompetitors,
      DomainKeywordsComparison,
      KeywordsSimilar,
      KeywordsRelated,
      KeywordsQuestions,
      KeywordsLongtail,
      KeywordsExport,
      SerpAddTasks,
      SerpGetTasks,
      SerpGetTaskResults,
      SerpGetTaskAdvancedResults,
      SerpGetLocations,
      CreateStandardAudit,
      CreateAdvancedAudit,
      ListAudits,
      GetAuditStatus,
      GetAuditReport,
      GetCrawledPages,
      GetAuditPagesByIssue,
      GetIssuesByUrl,
      GetFoundLinks,
      GetAuditHistory,
      UpdateAuditTitle,
      DeleteAudit,
      RecheckAudit,
    ];

    for (const Tool of tools) {
      new Tool().register(this.server);
    }

    new Prompts().registerPrompts(this.server);
  }
}
