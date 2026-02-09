import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { Prompts } from './prompts.js';
import { GetAiDiscoverBrand } from './tools/data/ai-search/ai-search-discover-brand.js';
import { GetAiOverview } from './tools/data/ai-search/ai-search-overview.js';
import { GetAiOverviewLeaderboard } from './tools/data/ai-search/ai-search-overview-leaderboard.js';
import { GetAiPromptsByBrand } from './tools/data/ai-search/ai-search-prompts-by-brand.js';
import { GetAiPromptsByTarget } from './tools/data/ai-search/ai-search-prompts-by-target.js';
import { GetAllBacklinks } from './tools/data/backlinks/backlinks-all.js';
import { GetBacklinksAnchors } from './tools/data/backlinks/backlinks-anchors.js';
import { GetBacklinksAuthority } from './tools/data/backlinks/backlinks-authority.js';
import { GetDomainAuthority } from './tools/data/backlinks/backlinks-authority-domain.js';
import { GetDistributionOfDomainAuthority } from './tools/data/backlinks/backlinks-authority-domain-distribution.js';
import { GetDomainAuthorityHistory } from './tools/data/backlinks/backlinks-authority-domain-history.js';
import { GetDomainAuthorityHistogram } from './tools/data/backlinks/backlinks-authority-domain-histogram.js';
import { GetPageAuthority } from './tools/data/backlinks/backlinks-authority-page.js';
import { GetPageAuthorityHistory } from './tools/data/backlinks/backlinks-authority-page-history.js';
import { GetBacklinksCount } from './tools/data/backlinks/backlinks-count.js';
import { ExportBacklinksData } from './tools/data/backlinks/backlinks-export.js';
import { GetBacklinksExportStatus } from './tools/data/backlinks/backlinks-export-status.js';
import { ListNewLostBacklinks } from './tools/data/backlinks/backlinks-history.js';
import { GetNewLostBacklinksCount } from './tools/data/backlinks/backlinks-history-count.js';
import { GetCumulativeBacklinksHistory } from './tools/data/backlinks/backlinks-history-cumulative.js';
import { GetBacklinksIndexedPages } from './tools/data/backlinks/backlinks-indexed-pages.js';
import { GetBacklinksMetrics } from './tools/data/backlinks/backlinks-metrics.js';
import { GetBacklinksRaw } from './tools/data/backlinks/backlinks-raw.js';
import { GetBacklinksRefDomains } from './tools/data/backlinks/backlinks-refdomains.js';
import { GetTotalRefDomainsCount } from './tools/data/backlinks/backlinks-refdomains-count.js';
import { ListNewLostReferringDomains } from './tools/data/backlinks/backlinks-refdomains-history.js';
import { GetNewLostRefDomainsCount } from './tools/data/backlinks/backlinks-refdomains-history-count.js';
import { GetReferringIps } from './tools/data/backlinks/backlinks-referring-ips.js';
import { GetReferringIpsCount } from './tools/data/backlinks/backlinks-referring-ips-count.js';
import { GetReferringSubnetsCount } from './tools/data/backlinks/backlinks-referring-subnets-count.js';
import { GetBacklinksSummary } from './tools/data/backlinks/backlinks-summary.js';
import { GetDomainAdsByDomain } from './tools/data/domain/domain-ads-by-domain.js';
import { GetDomainAdsByKeyword } from './tools/data/domain/domain-ads-by-keyword.js';
import { GetDomainCompetitors } from './tools/data/domain/domain-competitors.js';
import { GetDomainKeywords } from './tools/data/domain/domain-keywords.js';
import { GetDomainKeywordsComparison } from './tools/data/domain/domain-keywords-comparison.js';
import { GetDomainOverviewDatabases } from './tools/data/domain/domain-overview-db.js';
import { GetDomainOverviewHistory } from './tools/data/domain/domain-overview-history.js';
import { GetDomainOverviewWorldwide } from './tools/data/domain/domain-overview-worldwide.js';
import { ExportKeywords } from './tools/data/keywords/keywords-export.js';
import { GetLongTailKeywords } from './tools/data/keywords/keywords-longtail.js';
import { GetKeywordQuestions } from './tools/data/keywords/keywords-questions.js';
import { GetRelatedKeywords } from './tools/data/keywords/keywords-related.js';
import { GetSimilarKeywords } from './tools/data/keywords/keywords-similar.js';
import { GetSerpHtmlDump } from './tools/data/serp/serp-get-html-dump.js';
import { GetSerpLocations } from './tools/data/serp/serp-get-locations.js';
import { GetSerpResults } from './tools/data/serp/serp-get-results.js';
import { GetSerpTaskAdvancedResults } from './tools/data/serp/serp-get-task-advanced-results.js';
import { GetSerpTaskResults } from './tools/data/serp/serp-get-task-results.js';
import { GetSerpTasks } from './tools/data/serp/serp-get-tasks.js';
import { CreateAdvancedAudit } from './tools/data/website-audit/create-advanced-audit.js';
import { CreateStandardAudit } from './tools/data/website-audit/create-standard-audit.js';
import { DeleteAudit } from './tools/data/website-audit/delete-audit.js';
import { GetAuditHistory } from './tools/data/website-audit/get-audit-history.js';
import { GetAuditPagesByIssue } from './tools/data/website-audit/get-audit-pages-by-issue.js';
import { GetAuditReport } from './tools/data/website-audit/get-audit-report.js';
import { GetAuditStatus } from './tools/data/website-audit/get-audit-status.js';
import { GetCrawledPages } from './tools/data/website-audit/get-crawled-pages.js';
import { GetFoundLinks } from './tools/data/website-audit/get-found-links.js';
import { GetIssuesByUrl } from './tools/data/website-audit/get-issues-by-url.js';
import { ListAudits } from './tools/data/website-audit/list-audits.js';
import { RecheckAudit } from './tools/data/website-audit/recheck-audit.js';
import { UpdateAuditTitle } from './tools/data/website-audit/update-audit-title.js';
// Account Tools
import { GetAccountBalance } from './tools/project/account/get-account-balance.js';
import { GetSubscription } from './tools/project/account/get-subscription.js';
import { GetUserProfile } from './tools/project/account/get-user-profile.js';
// Analytics Tools
import { GetGoogleSearchConsole } from './tools/project/analytics/get-google-search-console.js';
import { GetSeoPotential } from './tools/project/analytics/get-seo-potential.js';
import { AddDisavowedBacklinks } from './tools/project/backlink-checker/add-disavowed-backlinks.js';
import { AddProjectBacklink } from './tools/project/backlink-checker/add-project-backlink.js';
import { CreateBacklinkGroup } from './tools/project/backlink-checker/create-backlink-group.js';
import { DeleteBacklinkGroup } from './tools/project/backlink-checker/delete-backlink-group.js';
import { DeleteDisavowedBacklink } from './tools/project/backlink-checker/delete-disavowed-backlink.js';
import { DeleteProjectBacklinks } from './tools/project/backlink-checker/delete-project-backlinks.js';
import { GetBacklinkGscImportStatus } from './tools/project/backlink-checker/get-backlink-gsc-import-status.js';
import { GetBacklinkStats } from './tools/project/backlink-checker/get-backlink-stats.js';
import { ImportProjectBacklinks } from './tools/project/backlink-checker/import-project-backlinks.js';
import { ListBacklinkGroups } from './tools/project/backlink-checker/list-backlink-groups.js';
import { ListDisavowedBacklinks } from './tools/project/backlink-checker/list-disavowed-backlinks.js';
// Backlink Checker Tools (Project API)
import { ListProjectBacklinks } from './tools/project/backlink-checker/list-project-backlinks.js';
import { MoveBacklinksToGroup } from './tools/project/backlink-checker/move-backlinks-to-group.js';
import { RecheckProjectBacklinks } from './tools/project/backlink-checker/recheck-project-backlinks.js';
import { RenameBacklinkGroup } from './tools/project/backlink-checker/rename-backlink-group.js';
import { RunBacklinkGscImport } from './tools/project/backlink-checker/run-backlink-gsc-import.js';
import { UpdateBacklinkImportSettings } from './tools/project/backlink-checker/update-backlink-import-settings.js';
// Competitor Tools
import { AddCompetitor } from './tools/project/competitors/add-competitor.js';
import { DeleteCompetitor } from './tools/project/competitors/delete-competitor.js';
import { GetAllCompetitorsMetrics } from './tools/project/competitors/get-all-competitors-metrics.js';
import { GetCompetitorPositions } from './tools/project/competitors/get-competitor-positions.js';
import { GetCompetitorTop10 } from './tools/project/competitors/get-competitor-top10.js';
import { GetCompetitorTop100 } from './tools/project/competitors/get-competitor-top100.js';
import { ListCompetitors } from './tools/project/competitors/list-competitors.js';
// Keyword Groups Tools
import { CreateKeywordGroup } from './tools/project/keyword-groups/create-keyword-group.js';
import { DeleteKeywordGroup } from './tools/project/keyword-groups/delete-keyword-group.js';
import { ListKeywordGroups } from './tools/project/keyword-groups/list-keyword-groups.js';
import { MoveKeywordsToGroup } from './tools/project/keyword-groups/move-keywords-to-group.js';
import { UpdateKeywordGroup } from './tools/project/keyword-groups/update-keyword-group.js';
import { AddPlanTask } from './tools/project/marketing-plan/add-plan-task.js';
import { DeletePlanTask } from './tools/project/marketing-plan/delete-plan-task.js';
// Marketing Plan Tools
import { ListPlanItems } from './tools/project/marketing-plan/list-plan-items.js';
import { SetPlanTaskStatus } from './tools/project/marketing-plan/set-plan-task-status.js';
import { UpdatePlanTask } from './tools/project/marketing-plan/update-plan-task.js';
import { CreateProjectGroup } from './tools/project/project-groups/create-project-group.js';
import { DeleteProjectGroup } from './tools/project/project-groups/delete-project-group.js';
// Project Groups Tools
import { ListProjectGroups } from './tools/project/project-groups/list-project-groups.js';
import { MoveProjectsToGroup } from './tools/project/project-groups/move-projects-to-group.js';
import { UpdateProjectGroup } from './tools/project/project-groups/update-project-group.js';
import { AddKeywords } from './tools/project/project-management/add-keywords.js';
import { AddSearchEngine } from './tools/project/project-management/add-search-engine.js';
import { CreateProject } from './tools/project/project-management/create-project.js';
import { DeleteKeywords } from './tools/project/project-management/delete-keywords.js';
import { DeleteProject } from './tools/project/project-management/delete-project.js';
import { DeleteSearchEngine } from './tools/project/project-management/delete-search-engine.js';
import { GetAdsStats } from './tools/project/project-management/get-ads-stats.js';
import { GetHistoricalDates } from './tools/project/project-management/get-historical-dates.js';
import { GetKeywordStats } from './tools/project/project-management/get-keyword-stats.js';
import { GetSearchEngines } from './tools/project/project-management/get-search-engines.js';
import { GetSummary } from './tools/project/project-management/get-summary.js';
import { ListKeywords } from './tools/project/project-management/list-keywords.js';
// Project Management Tools
import { ListProjects } from './tools/project/project-management/list-projects.js';
import { RunPositionCheck } from './tools/project/project-management/run-position-check.js';
import { SetKeywordPosition } from './tools/project/project-management/set-keyword-position.js';
import { UpdateProject } from './tools/project/project-management/update-project.js';
import { UpdateSearchEngine } from './tools/project/project-management/update-search-engine.js';
import { CreateSubAccount } from './tools/project/sub-accounts/create-sub-account.js';
import { DeleteSubAccount } from './tools/project/sub-accounts/delete-sub-account.js';
import { GetSubAccountDetails } from './tools/project/sub-accounts/get-sub-account-details.js';
import { ListOwnedProjects } from './tools/project/sub-accounts/list-owned-projects.js';
import { ListSharedProjects } from './tools/project/sub-accounts/list-shared-projects.js';
// Sub-Account Tools
import { ListSubAccounts } from './tools/project/sub-accounts/list-sub-accounts.js';
import { ShareProject } from './tools/project/sub-accounts/share-project.js';
import { UpdateSubAccount } from './tools/project/sub-accounts/update-sub-account.js';
import { GetAvailableRegions } from './tools/project/system/get-available-regions.js';
import { GetAvailableSearchEngines } from './tools/project/system/get-available-search-engines.js';
// Additional System Tools
import { GetGoogleLanguages } from './tools/project/system/get-google-languages.js';
import { GetSearchVolume } from './tools/project/system/get-search-volume.js';
import { GetVolumeRegions } from './tools/project/system/get-volume-regions.js';
import { AddTag } from './tools/project/url-tags/add-tag.js';
import { DeleteTag } from './tools/project/url-tags/delete-tag.js';
// URL Tags Tools
import { ListTags } from './tools/project/url-tags/list-tags.js';
import { UpdateTag } from './tools/project/url-tags/update-tag.js';


export class SeoApiMcpServer {
  constructor(private readonly server: McpServer) { }

  private dataTools = [
    GetAiDiscoverBrand,
    GetAiOverview,
    GetAiOverviewLeaderboard,
    GetAiPromptsByBrand,
    GetAiPromptsByTarget,
    GetAllBacklinks,
    GetBacklinksAnchors,
    GetBacklinksAuthority,
    GetBacklinksIndexedPages,
    GetBacklinksRefDomains,
    GetBacklinksSummary,
    GetBacklinksMetrics,
    GetBacklinksRaw,
    GetBacklinksCount,
    ListNewLostBacklinks,
    GetNewLostBacklinksCount,
    GetTotalRefDomainsCount,
    GetCumulativeBacklinksHistory,
    GetReferringIps,
    GetReferringIpsCount,
    GetReferringSubnetsCount,
    GetDistributionOfDomainAuthority,
    GetPageAuthority,
    GetPageAuthorityHistory,
    GetDomainAuthority,
    GetDomainAuthorityHistory,
    GetDomainAuthorityHistogram,
    ListNewLostReferringDomains,
    GetNewLostRefDomainsCount,
    ExportBacklinksData,
    GetBacklinksExportStatus,
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
    GetLongTailKeywords,
    GetKeywordQuestions,
    ExportKeywords,
    CreateStandardAudit,
    CreateAdvancedAudit,
    UpdateAuditTitle,
    ListAudits,
    GetAuditReport,
    GetAuditStatus,
    GetCrawledPages,
    GetAuditPagesByIssue,
    GetIssuesByUrl,
    GetFoundLinks,
    GetAuditHistory,
    DeleteAudit,
    RecheckAudit,
    GetSerpHtmlDump,
    GetSerpLocations,
    GetSerpResults,
    GetSerpTaskAdvancedResults,
    GetSerpTaskResults,
    GetSerpTasks,
  ];

  private projectTools = [
    ListProjects,
    CreateProject,
    UpdateProject,
    DeleteProject,
    GetSummary,
    GetKeywordStats,
    GetAdsStats,
    AddKeywords,
    DeleteKeywords,
    RunPositionCheck,
    GetSearchEngines,
    ListKeywords,
    SetKeywordPosition,
    GetHistoricalDates,
    AddSearchEngine,
    UpdateSearchEngine,
    DeleteSearchEngine,
    ListProjectGroups,
    CreateProjectGroup,
    UpdateProjectGroup,
    DeleteProjectGroup,
    MoveProjectsToGroup,
    CreateKeywordGroup,
    UpdateKeywordGroup,
    DeleteKeywordGroup,
    ListKeywordGroups,
    MoveKeywordsToGroup,
    GetAvailableSearchEngines,
    GetAvailableRegions,
    AddCompetitor,
    ListCompetitors,
    GetCompetitorPositions,
    DeleteCompetitor,
    GetCompetitorTop10,
    GetCompetitorTop100,
    GetAllCompetitorsMetrics,
    ListTags,
    AddTag,
    UpdateTag,
    DeleteTag,
    // Analytics
    GetGoogleSearchConsole,
    GetSeoPotential,
    // Account
    GetAccountBalance,
    GetUserProfile,
    GetSubscription,
    // Sub-Accounts
    ListSubAccounts,
    GetSubAccountDetails,
    CreateSubAccount,
    DeleteSubAccount,
    UpdateSubAccount,
    ListSharedProjects,
    ListOwnedProjects,
    ShareProject,
    // Additional System
    GetGoogleLanguages,
    GetVolumeRegions,
    GetSearchVolume,
    // Marketing Plan
    ListPlanItems,
    AddPlanTask,
    UpdatePlanTask,
    DeletePlanTask,
    SetPlanTaskStatus,
    // Backlink Checker (Project API)
    ListProjectBacklinks,
    AddProjectBacklink,
    ImportProjectBacklinks,
    UpdateBacklinkImportSettings,
    RunBacklinkGscImport,
    GetBacklinkGscImportStatus,
    DeleteProjectBacklinks,
    RecheckProjectBacklinks,
    GetBacklinkStats,
    ListDisavowedBacklinks,
    AddDisavowedBacklinks,
    DeleteDisavowedBacklink,
    ListBacklinkGroups,
    CreateBacklinkGroup,
    DeleteBacklinkGroup,
    RenameBacklinkGroup,
    MoveBacklinksToGroup,
  ];

  init(): void {
    for (const Tool of this.dataTools) {
      new Tool().register(this.server);
    }

    for (const Tool of this.projectTools) {
      new Tool().register(this.server);
    }

    new Prompts().registerPrompts(this.server);
  }
}
