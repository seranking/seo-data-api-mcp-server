import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { SERANKING_API_TOKEN } from './constants.js';
import { GetAiOverview } from './tools/ai-search/ai-search-overview.js';
import { GetAiPromptsByBrand } from './tools/ai-search/ai-search-prompts-by-brand.js';
import { GetAiPromptsByTarget } from './tools/ai-search/ai-search-prompts-by-target.js';
import { GetAllBacklinks } from './tools/backlinks/backlinks-all.js';
import { GetBacklinksAnchors } from './tools/backlinks/backlinks-anchors.js';
import { GetBacklinksAuthority } from './tools/backlinks/backlinks-authority.js';
import { GetBacklinksIndexedPages } from './tools/backlinks/backlinks-indexed-pages.js';
import { GetBacklinksRefDomains } from './tools/backlinks/backlinks-refdomains.js';
import { GetBacklinksSummary } from './tools/backlinks/backlinks-summary.js';
import { setTokenProvider, TokenProvider } from './tools/base-tool.js';

import { GetCumulativeBacklinksHistory } from './tools/backlinks/backlinks-history-cumulative.js';
import { GetReferringIps } from './tools/backlinks/backlinks-referring-ips.js';
import { GetReferringIpsCount } from './tools/backlinks/backlinks-referring-ips-count.js';
import { GetReferringSubnetsCount } from './tools/backlinks/backlinks-referring-subnets-count.js';
import { GetDistributionOfDomainAuthority } from './tools/backlinks/backlinks-authority-domain-distribution.js';
import { GetPageAuthority } from './tools/backlinks/backlinks-authority-page.js';
import { GetPageAuthorityHistory } from './tools/backlinks/backlinks-authority-page-history.js';
import { GetDomainAuthority } from './tools/backlinks/backlinks-authority-domain.js';
import { ListNewLostReferringDomains } from './tools/backlinks/backlinks-refdomains-history.js';
import { GetNewLostRefDomainsCount } from './tools/backlinks/backlinks-refdomains-history-count.js';
import { ExportBacklinksData } from './tools/backlinks/backlinks-export.js';
import { GetDomainAdsByDomain } from './tools/domain/domain-ads-by-domain.js';
import { GetDomainAdsByKeyword } from './tools/domain/domain-ads-by-keyword.js';
import { GetDomainCompetitors } from './tools/domain/domain-competitors.js';
import { GetDomainKeywords } from './tools/domain/domain-keywords.js';
import { GetDomainKeywordsComparison } from './tools/domain/domain-keywords-comparison.js';
import { GetDomainOverviewDatabases } from './tools/domain/domain-overview-db.js';
import { GetDomainOverviewHistory } from './tools/domain/domain-overview-history.js';
import { GetDomainOverviewWorldwide } from './tools/domain/domain-overview-worldwide.js';
import { ExportKeywords } from './tools/keywords/keywords-export.js';
import { GetLongTailKeywords } from './tools/keywords/keywords-longtail.js';
import { GetKeywordQuestions } from './tools/keywords/keywords-questions.js';
import { GetRelatedKeywords } from './tools/keywords/keywords-related.js';
import { GetSimilarKeywords } from './tools/keywords/keywords-similar.js';
import { AddSerpTasks } from './tools/serp/serp-add-tasks.js';
import { GetSerpTasks } from './tools/serp/serp-get-tasks.js';
import { GetSerpTaskResults } from './tools/serp/serp-get-task-results.js';
import { GetSerpTaskAdvancedResults } from './tools/serp/serp-get-task-advanced-results.js';
import { GetSerpLocations } from './tools/serp/serp-get-locations.js';
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
      GetAiOverview,
      GetAiPromptsByBrand,
      GetAiPromptsByTarget,
      GetAllBacklinks,
      GetBacklinksAnchors,
      GetBacklinksAuthority,
      GetBacklinksIndexedPages,
      GetBacklinksRefDomains,
      GetBacklinksSummary,
      GetCumulativeBacklinksHistory,
      GetReferringIps,
      GetReferringIpsCount,
      GetReferringSubnetsCount,
      GetDistributionOfDomainAuthority,
      GetPageAuthority,
      GetPageAuthorityHistory,
      GetDomainAuthority,
      ListNewLostReferringDomains,
      GetNewLostRefDomainsCount,
      ExportBacklinksData,
      GetDomainOverviewDatabases,
      GetDomainOverviewWorldwide,
      GetDomainOverviewHistory,
      GetDomainKeywords,
      GetDomainAdsByKeyword,
      GetDomainAdsByDomain,
      GetDomainCompetitors,
      GetDomainKeywordsComparison,
      GetSimilarKeywords,
      GetRelatedKeywords,
      GetKeywordQuestions,
      GetLongTailKeywords,
      ExportKeywords,
      AddSerpTasks,
      GetSerpTasks,
      GetSerpTaskResults,
      GetSerpTaskAdvancedResults,
      GetSerpLocations,
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
