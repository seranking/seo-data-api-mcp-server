import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AiSearchOverview} from "./tools/ai-search/ai-search-overview.js";
import { AiSearchPromptsByTarget } from "./tools/ai-search/ai-search-prompts-by-target.js";
import { DomainAdsByDomain } from "./tools/domain/domain-ads-by-domain.js";
import { DomainAdsByKeyword } from "./tools/domain/domain-ads-by-keyword.js";
import { DomainAioDiscoverBrand } from "./tools/domain/domain-aio-discover-brand.js";
import { DomainAioKeywordsByBrand } from "./tools/domain/domain-aio-keywords-by-brand.js";
import { DomainAioKeywordsByTarget } from "./tools/domain/domain-aio-keywords-by-target.js";
import { DomainAioOverview } from "./tools/domain/domain-aio-overview.js";
import { DomainCompetitors } from "./tools/domain/domain-competitors.js";
import { DomainKeywordsComparison } from "./tools/domain/domain-keywords-comparison.js";
import { DomainKeywordsReverseComparison } from "./tools/domain/domain-keywords-reverse-comparison.js";
import { DomainKeywords } from "./tools/domain/domain-keywords.js";
import { DomainOverviewDb } from "./tools/domain/domain-overview-db.js";
import { DomainOverviewHistory } from "./tools/domain/domain-overview-history.js";
import { DomainOverviewWorldwide } from "./tools/domain/domain-overview-worldwide.js";
import { DomainOverview } from "./tools/domain/domain-overview.js";
import { KeywordsExport } from "./tools/keywords/keywords-export.js";
import { KeywordsLongtail } from "./tools/keywords/keywords-longtail.js";
import { KeywordsQuestions } from "./tools/keywords/keywords-questions.js";
import { KeywordsRelated } from "./tools/keywords/keywords-related.js";
import { KeywordsSimilar } from "./tools/keywords/keywords-similar.js";
import { BacklinksAll } from "./tools/backlinks/backlinks-all.js";
import { BacklinksSummary } from "./tools/backlinks/backlinks-summary.js";
import { BacklinksAnchors } from "./tools/backlinks/backlinks-anchors.js";
import { BacklinksIndexedPages } from "./tools/backlinks/backlinks-indexed-pages.js";
import { BacklinksAuthority } from "./tools/backlinks/backlinks-authority.js";
import { BacklinksRefdomains } from "./tools/backlinks/backlinks-refdomains.js";
import {setTokenProvider, TokenProvider} from "./tools/base-tool.js";
import {SERANKING_API_TOKEN} from "./constants.js";
import {AiSearchPromptsByBrand} from "./tools/ai-search/ai-search-prompts-by-brand.js";

export class DataApiMcpServer {
    constructor(
        private readonly server: McpServer,
        private readonly opts?: { getToken?: TokenProvider }
    ) {
        if (this.opts?.getToken) {
            setTokenProvider(this.opts.getToken);
        } else {
            // default to env var if not provided
            setTokenProvider(() => process.env?.SERANKING_API_TOKEN || SERANKING_API_TOKEN);
        }
    }

    init(): void {
        (new AiSearchOverview()).registerTool(this.server);
        (new AiSearchPromptsByBrand()).registerTool(this.server);
        (new AiSearchPromptsByTarget()).registerTool(this.server);

        (new BacklinksAll()).registerTool(this.server);
        (new BacklinksAnchors()).registerTool(this.server);
        (new BacklinksAuthority()).registerTool(this.server);
        (new BacklinksIndexedPages()).registerTool(this.server);
        (new BacklinksRefdomains()).registerTool(this.server);
        (new BacklinksSummary()).registerTool(this.server);

        (new DomainOverview()).registerTool(this.server);
        (new DomainOverviewDb()).registerTool(this.server);
        (new DomainOverviewWorldwide()).registerTool(this.server);
        (new DomainOverviewHistory()).registerTool(this.server);
        (new DomainKeywords()).registerTool(this.server);
        (new DomainAdsByKeyword()).registerTool(this.server);
        (new DomainAdsByDomain()).registerTool(this.server);
        (new DomainCompetitors()).registerTool(this.server);
        (new DomainKeywordsComparison()).registerTool(this.server);
        (new DomainKeywordsReverseComparison()).registerTool(this.server);
        (new DomainAioOverview()).registerTool(this.server);
        (new DomainAioDiscoverBrand()).registerTool(this.server);
        (new DomainAioKeywordsByTarget()).registerTool(this.server);
        (new DomainAioKeywordsByBrand()).registerTool(this.server);

        (new KeywordsSimilar).registerTool(this.server);
        (new KeywordsRelated).registerTool(this.server);
        (new KeywordsQuestions()).registerTool(this.server);
        (new KeywordsLongtail).registerTool(this.server);
        (new KeywordsExport).registerTool(this.server);
    }
}
