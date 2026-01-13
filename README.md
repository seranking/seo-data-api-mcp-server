# SE Ranking MCP Server

This Model Context Protocol (MCP) server connects AI assistants to [SE Ranking's](https://seranking.com) SEO data and project management APIs. It enables natural language queries for:

- Keyword research and competitive analysis
- Backlink analysis and monitoring
- Domain traffic and ranking insights
- Website audits and technical SEO
- AI search visibility tracking
- Project and rank tracking management

## Prerequisites

Before you begin, please ensure you have the following software and accounts ready:

- **SE Ranking Account**: You will need an active SE Ranking account to generate an API token. If you don’t have one, you can [sign up here](https://online.seranking.com/admin.api.dashboard.html).
- **Docker**: A platform for developing, shipping, and running applications in containers. If you don’t have it, you can [download it from the official Docker website](https://www.docker.com/get-started).
- **Git**: A free and open-source distributed version control system. You can download it from the official Git website.
- **AI Assistant**: You will need an MCP-compatible client, such as [Claude Desktop](https://claude.ai/download) or the [Gemini CLI](https://github.com/google-gemini/gemini-cli).

## API Tokens

This MCP server supports two types of API access:

| Token | Environment Variable | Format | Purpose |
|-------|---------------------|--------|---------|
| Data API | `DATA_API_TOKEN` | UUID (e.g., `80cfee7d-xxxx-xxxx-xxxx-fc8500816bb3`) | Access to keyword research, domain analysis, backlinks data, SERP analysis, and website audits. Tools prefixed with `DATA_`. |
| Project API | `PROJECT_API_TOKEN` | 40-char hex (e.g., `253a73adxxxxxxxxxxxx340aa0a939`) | Access to project management, rank tracking, backlink monitoring, and account management. Tools prefixed with `PROJECT_`. |

Get your tokens from: https://online.seranking.com/admin.api.dashboard.html

You can use one or both tokens depending on which tools you need. If you only use Data API tools, you can omit `PROJECT_API_TOKEN`, and vice versa.

## Rate Limits

| API | Default Rate Limit |
|-----|-------------------|
| Data API | 10 requests per second |
| Project API | 5 requests per second |

Rate limits are customizable. Contact [api@seranking.com](mailto:api@seranking.com) to request adjustments.

## Installation

Choose the installation method that best fits your needs:

- **Option 1: Docker (Recommended)** - Best for standard usage, stability, and ease of updates. Use this if you just want to run the tool without managing dependencies.
- **Option 2: Local Node.js Server (For Developers)** - Best for development, debugging, or environments where Docker isn't available (like Replit). Use this if you need to modify the code or run a custom setup.

### Option 1: Docker (Recommended)

1. Open your terminal (or Command Prompt/PowerShell on Windows).
2. Clone the project repository from GitHub:

```shell
git clone https://github.com/seranking/seo-data-api-mcp-server.git
```

3. Navigate into the new directory:

```shell
cd seo-data-api-mcp-server
```

4. Build the Docker Image:

```bash
docker build -t se-ranking/seo-data-api-mcp-server .
# Check that the image is built and named `se-ranking/seo-data-api-mcp-server`:
docker image ls
```

#### How to Update SEO-MCP (Docker)

To ensure you have the latest features, pull the latest changes and rebuild:

```shell
git pull origin main
docker build -t se-ranking/seo-data-api-mcp-server .
```

### Option 2: Local Node.js Server (For Developers)

In order to run the local Node server, you need to have [Node.js 20+](https://nodejs.org/en/download) version installed on your machine.

1. Install dependencies:

```shell
npm install
```

2. Build the project:

```shell
npm run build
```

3. Start the server:

```shell
npm run start-http
```

Then your HTTP server should be running at: http://0.0.0.0:5000/mcp.

In case you'd like to modify the `HOST` and `PORT`, you can do so by creating a `.env` file in the root directory of the project with the settings you want to override, for example:

```shell
HOST=127.0.0.1
PORT=5555
```

Additionally, when running in external environments like [Replit](https://replit.com/), you can set the `DATA_API_TOKEN` and `PROJECT_API_TOKEN` environment variables in the configuration panel.

**Note**: If you change the API token values when the server is running, you need to restart the server.

#### Verifying the HTTP Server

To send a sample test request and verify your setup:

```shell
./test-http-server-curl-request.sh '<your-api-token-here>'
```

For batch MCP Requests testing:

```shell
./test-batch-http-server-curl-request.sh '<your-api-token-here>'
```

## Connect to Claude Desktop

Claude Desktop reads its configuration from `claude_desktop_config.json`.

- Click on the Claude menu and select **Settings...**.
- In the Settings window, navigate to the **Developer** tab in the left sidebar.
- Click the **Edit Config** button to open the configuration file. This action creates a new configuration file if one doesn’t exist or opens your existing configuration.

The file is located at:

- macOS: `~/Library/Application\ Support/Claude/claude_desktop_config.json`
- Windows: `%AppData%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

Example of **Claude Desktop** configuration for MCP server

<b>JSON Configuration Template</b>:

```json
{
  "mcpServers": {
    "seo-data-api-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "DATA_API_TOKEN",
        "-e",
        "PROJECT_API_TOKEN",
        "se-ranking/seo-data-api-mcp-server"
      ],
      "env": {
        "DATA_API_TOKEN": "<your-data-api-token-here>",
        "PROJECT_API_TOKEN": "<your-project-api-token-here>"
      }
    }
  }
}
```

- Replace the `DATA_API_TOKEN` and `PROJECT_API_TOKEN` placeholder values with your tokens (see [API Tokens](#api-tokens) section).

- After saving **claude_desktop_config.json**, restart Claude Desktop. You should see the server under MCP Servers/Tools.

- To verify the setup, ask Claude: `Do you have access to MCP?` It should respond by listing `seo-data-api-mcp`.

![Claude Desktop: Verify the MCP access](docs-img/claude-desktop-1.png)

- Your setup is complete! You can now run complex SEO queries using natural language.

![Claude Desktop: List MCP Servers](docs-img/claude-desktop-2.png)

## Connect to Gemini CLI

- Open the Gemini CLI settings file, which is typically located at: `~/.gemini/settings.json`
- Add the following JSON configuration, making sure to **replace the API token placeholder values.**

```json
{
  "mcpServers": {
    "seo-data-api-mcp": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "DATA_API_TOKEN",
        "-e",
        "PROJECT_API_TOKEN",
        "se-ranking/seo-data-api-mcp-server"
      ],
      "env": {
        "DATA_API_TOKEN": "<your-data-api-token-here>",
        "PROJECT_API_TOKEN": "<your-project-api-token-here>"
      }
    }
  }
}
```

Replace the `DATA_API_TOKEN` and `PROJECT_API_TOKEN` placeholder values with your tokens (see [API Tokens](#api-tokens) section).

- Save the configuration file.

- To verify the setup, launch the **Gemini CLI** by running `gemini` in your terminal. Once the interface is active, press `Ctrl+T` to view the available MCP servers. Ensure seo-data-api-mcp is listed.

![Gemini CLI: Configured MCP Servers](docs-img/gemini-1.png)

- Your setup is complete! You can now run complex SEO queries using natural language.

![Gemini CLI: SEO Queries Example](docs-img/gemini-1.png)

## Available Tools

### Data API Tools

| Module | Tool Name | Description |
| :--- | :--- | :--- |
| SERP | `DATA_getSerpHtmlDump` | Retrieves the raw HTML dump of a completed SERP task as a ZIP file. |
| SERP | `DATA_getSerpLocations` | Retrieves a list of available locations for SERP analysis. |
| SERP | `DATA_getSerpResults` | Runs a SERP query and returns results. Creates task, polls until complete, and returns organic/ads/featured snippets (standard) or all SERP types including AI Overview, Maps, Reviews (advanced). |
| SERP | `DATA_getSerpTaskAdvancedResults` | Retrieves the status or advanced results of a specific SERP task. |
| SERP | `DATA_getSerpTaskResults` | Retrieves the status or standard results of a specific SERP task. Returns organic, ads, and featured_snippet types only. |
| SERP | `DATA_getSerpTasks` | Retrieves a list of all SERP tasks added to the queue in the last 24 hours. |
| ai search | `DATA_getAiDiscoverBrand` | Identifies and returns the brand name associated with a given target domain, subdomain, or URL. |
| ai search | `DATA_getAiOverview` | Retrieves a high-level overview of a domain's performance in AI search engines. |
| ai search | `DATA_getAiPromptsByBrand` | Retrieves a list of prompts where the specified brand is mentioned in AI search results. |
| ai search | `DATA_getAiPromptsByTarget` | Retrieves a list of prompts (queries) that mention the specified target in AI search results. |
| backlinks | `DATA_exportBacklinksData` | Retrieves large-scale backlinks asynchronously, returning a task ID to check status later. |
| backlinks | `DATA_getAllBacklinks` | Retrieves a comprehensive list of backlinks for the specified target, with extensive filtering and sorting options. |
| backlinks | `DATA_getBacklinksAnchors` | Retrieves a list of anchor texts for backlinks pointing to the specified target. |
| backlinks | `DATA_getBacklinksAuthority` | Fetch authority metrics for a target (domain, host or URL). |
| backlinks | `DATA_getBacklinksCount` | Returns the total number of backlinks for the target. Supports batch requests. |
| backlinks | `DATA_getBacklinksExportStatus` | Checks the status of an asynchronous backlinks export task. Returns download URL when complete. |
| backlinks | `DATA_getBacklinksIndexedPages` | Fetch site pages that have backlinks, with sorting and limit controls. |
| backlinks | `DATA_getBacklinksMetrics` | Returns key statistics for a target (backlinks count, referring domains, etc.). Supports batch requests. |
| backlinks | `DATA_getBacklinksRaw` | Returns all backlinks pointing to a target using cursor-based pagination for large datasets. |
| backlinks | `DATA_getBacklinksRefDomains` | Retrieves a list of referring domains pointing to the specified target. |
| backlinks | `DATA_getBacklinksSummary` | Retrieves a summary of backlink metrics for one or multiple targets. |
| backlinks | `DATA_getCumulativeBacklinksHistory` | Returns live backlinks count for every day within the specified date range. |
| backlinks | `DATA_getDistributionOfDomainAuthority` | Returns distribution of Domain InLink Rank of all domains referencing a target. |
| backlinks | `DATA_getDomainAuthority` | Returns the domain InLink Rank (Domain Authority) of the target page's root domain. |
| backlinks | `DATA_getNewLostBacklinksCount` | Returns count of (newly) found or lost backlinks for every day in the date range. |
| backlinks | `DATA_getNewLostRefDomainsCount` | Returns count of referring domains found or lost in the date range, by day. |
| backlinks | `DATA_getPageAuthority` | Returns the InLink Rank (Page Authority) for a target URL. |
| backlinks | `DATA_getPageAuthorityHistory` | Returns historical values of InLink Rank for a specific target page. |
| backlinks | `DATA_getReferringIps` | Returns IPv4 addresses that belong to backlinks pointing to a target. |
| backlinks | `DATA_getReferringIpsCount` | Returns the number of unique IPs linking to a target. |
| backlinks | `DATA_getReferringSubnetsCount` | Returns the number of unique subnets/C-blocks linking to a target. |
| backlinks | `DATA_getTotalRefDomainsCount` | Returns the number of unique domains linking to a target. Supports batch requests. |
| backlinks | `DATA_listNewLostBacklinks` | Returns a list of backlinks found or lost within the specified date range. |
| backlinks | `DATA_listNewLostReferringDomains` | Returns referring domains found or lost in the specified date range. |
| domain analysis | `DATA_getDomainAdsByDomain` | Retrieves paid ads for a specific domain. |
| domain analysis | `DATA_getDomainAdsByKeyword` | Retrieves paid ads for a specific keyword. |
| domain analysis | `DATA_getDomainCompetitors` | Retrieves a list of organic or paid competitors for a domain. |
| domain analysis | `DATA_getDomainKeywords` | Retrieves keywords for which a domain ranks in organic or paid search. |
| domain analysis | `DATA_getDomainKeywordsComparison` | Compares keyword rankings of two websites. Find common keywords or keyword gaps. |
| domain analysis | `DATA_getDomainOverviewDatabases` | Fetch domain overview by database. |
| domain analysis | `DATA_getDomainOverviewHistory` | Retrieves historical data for domain traffic and keyword rankings. |
| domain analysis | `DATA_getDomainOverviewWorldwide` | Retrieves an aggregated worldwide overview of domain metrics. |
| domain analysis | `DATA_getDomainPages` | Retrieves a list of individual pages ranking within a specified domain. |
| domain analysis | `DATA_getDomainSubdomains` | Retrieves a list of subdomains for a domain with search performance metrics. |
| domain analysis | `DATA_getUrlOverviewWorldwide` | Retrieves worldwide overview of organic and paid traffic metrics for a specific URL. |
| keyword research | `DATA_exportKeywords` | Retrieves metrics for a bulk list of keywords. |
| keyword research | `DATA_getKeywordQuestions` | Retrieves question-based keywords containing the seed keyword. |
| keyword research | `DATA_getLongTailKeywords` | Retrieves long-tail variations for the seed keyword. |
| keyword research | `DATA_getRelatedKeywords` | Retrieves keywords semantically related to the seed keyword. |
| keyword research | `DATA_getSimilarKeywords` | Retrieves keywords similar to the seed keyword. |
| website audit | `DATA_createAdvancedAudit` | Launches an advanced website audit that renders JavaScript. Suitable for SPAs. |
| website audit | `DATA_createStandardAudit` | Launches a standard website audit that crawls HTML. Suitable for static sites. |
| website audit | `DATA_deleteAudit` | Permanently deletes a website audit report and all associated data. |
| website audit | `DATA_getAuditHistory` | Retrieves a historical snapshot of a specific audit run. |
| website audit | `DATA_getAuditPagesByIssue` | Retrieves URLs affected by a specific issue within an audit. |
| website audit | `DATA_getAuditReport` | Retrieves the full detailed report for a completed website audit. |
| website audit | `DATA_getAuditStatus` | Checks the real-time status of a specific website audit. |
| website audit | `DATA_getCrawledPages` | Returns all URLs found during an audit. |
| website audit | `DATA_getFoundLinks` | Returns every hyperlink discovered during the audit. |
| website audit | `DATA_getIssuesByUrl` | Retrieves all issues found on a specific page within an audit. |
| website audit | `DATA_listAudits` | Retrieves all website audits associated with your account. |
| website audit | `DATA_recheckAudit` | Launches a new crawl of a previously completed audit. |
| website audit | `DATA_updateAuditTitle` | Changes the title of an existing website audit report. |

### Project API Tools

| Module | Tool Name | Description |
| :--- | :--- | :--- |
| account | `PROJECT_getAccountBalance` | Get the current account balance including currency and currency code. |
| account | `PROJECT_getSubscription` | Get information about the current user subscription. |
| account | `PROJECT_getUserProfile` | Get information about the currently logged in user. |
| analytics | `PROJECT_getGoogleSearchConsole` | Get popular queries from Google Search Console for a website. |
| analytics | `PROJECT_getSeoPotential` | Assess potential traffic volume, traffic cost, and potential customers for a website. |
| backlink checker | `PROJECT_addDisavowedBacklinks` | Add a list of URLs to the disavowed backlinks list. |
| backlink checker | `PROJECT_addProjectBacklink` | Add a single backlink to the backlink monitor for a website. |
| backlink checker | `PROJECT_createBacklinkGroup` | Create a new group for organizing backlinks. |
| backlink checker | `PROJECT_deleteBacklinkGroup` | Delete a backlink group. |
| backlink checker | `PROJECT_deleteDisavowedBacklink` | Remove a backlink from the disavowed backlinks list. |
| backlink checker | `PROJECT_deleteProjectBacklinks` | Delete a list of backlinks from the backlink monitor. |
| backlink checker | `PROJECT_getBacklinkGscImportStatus` | Get the status of a backlink import from Google Search Console. |
| backlink checker | `PROJECT_getBacklinkStats` | Get backlink statistics for a website. |
| backlink checker | `PROJECT_importProjectBacklinks` | Import a list of backlinks to the backlink monitor. |
| backlink checker | `PROJECT_listBacklinkGroups` | Get a list and count of backlink groups for a website. |
| backlink checker | `PROJECT_listDisavowedBacklinks` | Get a list and count of disavowed backlinks for a website. |
| backlink checker | `PROJECT_listProjectBacklinks` | Get a list of backlinks from the backlink monitor. |
| backlink checker | `PROJECT_moveBacklinksToGroup` | Move backlinks from one group to another. |
| backlink checker | `PROJECT_recheckProjectBacklinks` | Run an index or status check for a list of backlinks. |
| backlink checker | `PROJECT_renameBacklinkGroup` | Change the name of a backlink group. |
| backlink checker | `PROJECT_runBacklinkGscImport` | Start a backlink import from Google Search Console. |
| backlink checker | `PROJECT_updateBacklinkImportSettings` | Update settings for automatic backlink import from GSC. |
| competitors | `PROJECT_addCompetitor` | Add a competitor website to a project for position tracking. |
| competitors | `PROJECT_deleteCompetitor` | Remove a competitor website from a project. |
| competitors | `PROJECT_getAllCompetitorsMetrics` | Get data on sites ranked in TOP 10 for tracked queries (14-day history). |
| competitors | `PROJECT_getCompetitorPositions` | Get statistics on competitor keyword positions. |
| competitors | `PROJECT_getCompetitorTop10` | Get TOP 10 results for tracked keywords in a project. |
| competitors | `PROJECT_getCompetitorTop100` | Get top 100 results for tracked keywords in a project. |
| competitors | `PROJECT_listCompetitors` | Get a list of all competitors added to a project with statistics. |
| keyword groups | `PROJECT_createKeywordGroup` | Add a group for project keywords. |
| keyword groups | `PROJECT_deleteKeywordGroup` | Delete a project keyword group. |
| keyword groups | `PROJECT_listKeywordGroups` | Get a list of keyword groups for a project. |
| keyword groups | `PROJECT_moveKeywordsToGroup` | Transfer project keywords from one group to another. |
| keyword groups | `PROJECT_updateKeywordGroup` | Update the name of a project keyword group. |
| marketing plan | `PROJECT_addPlanTask` | Add a new task to the marketing plan for a website. |
| marketing plan | `PROJECT_deletePlanTask` | Delete a task from the marketing plan. |
| marketing plan | `PROJECT_listPlanItems` | Get all marketing plan sections, items, and notes for a website. |
| marketing plan | `PROJECT_setPlanTaskStatus` | Set the completion status of a marketing plan task. |
| marketing plan | `PROJECT_updatePlanTask` | Update an existing marketing plan task. |
| project groups | `PROJECT_createProjectGroup` | Add a new project group to a user account. |
| project groups | `PROJECT_deleteProjectGroup` | Delete a project group. |
| project groups | `PROJECT_listProjectGroups` | Get a list of all project groups from a user account. |
| project groups | `PROJECT_moveProjectsToGroup` | Transfer projects from one group to another. |
| project groups | `PROJECT_updateProjectGroup` | Rename a project group. |
| project management | `PROJECT_addKeywords` | Add new keywords to a project. |
| project management | `PROJECT_addSearchEngine` | Add a new search engine to a project. |
| project management | `PROJECT_createProject` | Add a new project to the user account. |
| project management | `PROJECT_deleteKeywords` | Delete keywords from a project. |
| project management | `PROJECT_deleteProject` | Delete a project from the user account. |
| project management | `PROJECT_deleteSearchEngine` | Delete a search engine from a project. |
| project management | `PROJECT_getAdsStats` | Get total number of top and bottom advertisements by day. |
| project management | `PROJECT_getHistoricalDates` | Returns standard comparison dates available for reporting. |
| project management | `PROJECT_getKeywordStats` | Get keyword ranking statistics for a specified time period. |
| project management | `PROJECT_getSearchEngines` | Get a list of search engines employed by a project. |
| project management | `PROJECT_getSummary` | Get a project's summary statistics. |
| project management | `PROJECT_listKeywords` | Get a list of keywords with target pages for a project. |
| project management | `PROJECT_listProjects` | Get a list of all user projects. |
| project management | `PROJECT_runPositionCheck` | Run a ranking position check for keywords or entire project. |
| project management | `PROJECT_setKeywordPosition` | Manually set position for a project's keyword. |
| project management | `PROJECT_updateProject` | Change/update project settings. |
| project management | `PROJECT_updateSearchEngine` | Update an existing search engine in a project. |
| sub-accounts | `PROJECT_createSubAccount` | Create a new sub-account. |
| sub-accounts | `PROJECT_deleteSubAccount` | Delete a user sub-account. |
| sub-accounts | `PROJECT_getSubAccountDetails` | Get extended information about a sub-account. |
| sub-accounts | `PROJECT_listOwnedProjects` | Get website IDs that belong to a sub-account. |
| sub-accounts | `PROJECT_listSharedProjects` | Get website IDs shared with a sub-account. |
| sub-accounts | `PROJECT_listSubAccounts` | Get a list of all sub-accounts of the current user. |
| sub-accounts | `PROJECT_shareProject` | Share one or more websites with a sub-account. |
| sub-accounts | `PROJECT_updateSubAccount` | Edit sub-account settings, limits, and permissions. |
| system | `PROJECT_getAvailableRegions` | Get the list of all available regions supported by Google. |
| system | `PROJECT_getAvailableSearchEngines` | Get the list of all available search engines. |
| system | `PROJECT_getGoogleLanguages` | Get a complete list of possible languages for Google search engine. |
| system | `PROJECT_getSearchVolume` | Get search volume data for a region and keyword list (max 10 keywords). |
| system | `PROJECT_getVolumeRegions` | Get regions where SE Ranking can run keyword search volume checks. |
| url tags | `PROJECT_addTag` | Add a tag to the site and attach it to a link and/or domain. |
| url tags | `PROJECT_deleteTag` | Delete a tag. |
| url tags | `PROJECT_listTags` | Get a list of landing page tags added to domains and/or links. |
| url tags | `PROJECT_updateTag` | Add tags to a domain and/or link, replacing previously added tags. |

## Available Prompts

| Prompt Name | Arguments | Description |
| :--- | :--- | :--- |
| `serp-analysis` | `keyword`, `location1`, `location2`, `language`, `device` | Create two SERP tasks for the query in two locations and compare top 10 organic domains, overlap, and unique competitors. |
| `backlink-gap` | `my_domain`, `competitors`, `min_domain_trust` | Fetch backlinks for competitors with a minimum Domain Trust, compare against your domain, and find opportunities. |
| `domain-traffic-competitors` | `domain` | Analyze a domain's global/country organic traffic, top competitors by shared keywords, and provide strategic recommendations. |
| `keyword-clusters` | `market`, `seed_keywords` | Pull related/similar keywords for a market, clean/deduplicate, and cluster them by intent/theme with volume and H1/H2 ideas. |
| `ai-share-of-voice` | `domain`, `competitors`, `country`, `llm_engines` | Estimate share of voice in AI search (e.g. ChatGPT, Perplexity) vs competitors, listing winning topics and gap-closing actions. |



## Usage Example: Finding Keyword Opportunities

With the configuration complete, you can now use natural language prompts to interact with your SE Ranking data. Here is an example prompt to identify low-hanging keyword opportunities for a domain.

Copy and paste the following into your configured AI assistant:

```
Use the seo-mcp to identify the Keywords my domain is overlooking and find low-hanging fruit opportunities.
1. Analyze my domain's keyword performance:
   - Find keywords my domain has lost (not ranking) using the tool for getDomainKeywords with pos_change=lost.
   - Find keywords where my domain's position has gone down using the tool for getDomainKeywords with pos_change=down.
2. Conduct a competitive analysis:
   - Identify my top 2 competitors by finding all competitors with the tool for getDomainCompetitors and ordering them by common_keywords DESC.
   - Find 30 keywords that these competitors are ranking for but my domain is not. Use the getDomainKeywordsComparison tool with diff=1, order_field=volume, and order_type=DESC.
3. Identify new keyword opportunities:
   - For 10 of the competitor keywords found in the previous step, use the tools for getRelatedKeywords and getSimilarKeywords to find the top 5 related and similar keywords for each, ordered by volume DESC.
4. Synthesize and Report:
   - Create a final report of the findings. In the report, highlight potential low-hanging fruit from the new keyword opportunities by analyzing their CPC and keyword difficulty.
Domain to review: seranking.com
Market: us
```

### What This Prompt Does

This prompt instructs the model to perform a comprehensive competitive analysis by:

- **Finding Lost & Declining Keywords**: It first identifies keywords for seranking.com that have either been lost from the rankings or have dropped in position.
- **Identifying Top Competitors**: It finds all organic competitors and sorts them to identify the top two based on the number of shared keywords.
- **Uncovering Competitor-Ranked Keywords**: It compares seranking.com against its top competitors to find 30 high-volume keywords that they rank for, but seranking.com does not.
- **Generating a Final Report**: Finally, it synthesizes all of this information into a concise report, highlighting the most promising opportunities for growth.


## Troubleshooting

### Docker image problems

If you’re having trouble getting the MCP server to connect, here are a few steps to diagnose the issue.

Verifying if the Docker container is running when you run your AI Assistant (Claude or Gemini). If you start a chat with an AI, and your MCP Server is set up properly via JSON config, it should automatically start the Docker container.

To check if it’s running, open your terminal and run:

```shell
docker ps
```

If it’s working correctly, you will see an output similar to this:

```shell
CONTAINER ID   IMAGE                                    COMMAND                  CREATED          STATUS          PORTS     NAMES
de4e410ef0fd   se-ranking/seo-data-api-mcp-server       "docker-entrypoint.s…"   9 seconds ago    Up 8 seconds              musing_bhabha
```

This confirms that your AI assistant has successfully started the container, and it’s listening for connections.

If `docker ps` shows no running containers related to the MCP server, it usually points to a configuration issue:

- Incorrect/invalid JSON: Double-check the **claude_desktop_config.json** or **settings.json** for any syntax errors like missing commas or brackets. You can validate the JSON here: https://jsonlint.com/.

- Incorrect image name: Double-check the **claude_desktop_config.json** or **settings.json** for the correct image name `se-ranking/seo-data-api-mcp-server`

### Docker image running, but MCP server is not visible in Claude Desktop / Gemini CLI

If the docker image is running, but the MCP server is not visible in Claude Desktop, you can investigate the container by:

```
docker inspect <container-id>
```

For the following example, the container ID is `de4e410ef0fd`:

```shell
CONTAINER ID   IMAGE                                    COMMAND                  CREATED          STATUS          PORTS     NAMES
de4e410ef0fd   se-ranking/seo-data-api-mcp-server       "docker-entrypoint.s…"   9 seconds ago    Up 8 seconds              musing_bhabha
```

Note: you can shorten the container ID in case no other containers share that prefix, ex. `docker inspect de4`. When you're running multiple AI chats and/or tools connected to the MCP Servers, there can be multiple containers running, but all with the same IMAGE name.

This will show you the big JSON output, where particularly important is the "Config" section, ex.:

```json
{
  "Config": {
    "Hostname": "0977c3dc06fb",
    "Domainname": "",
    "User": "",
    "AttachStdin": true,
    "AttachStdout": true,
    "AttachStderr": true,
    "Tty": false,
    "OpenStdin": true,
    "StdinOnce": true,
    "Env": [
      "DATA_API_TOKEN=80cfee7d-xxxx-xxxx-xxxx-fc8500816bb3",
      "PROJECT_API_TOKEN=253a73adxxxxxxxxxxxxxx340aa0a939",
      "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
      "NODE_VERSION=20.19.5",
      "YARN_VERSION=1.22.22",
      "NODE_ENV=production"
    ]
  }
}
```

Which shows you if you have the correct environment variables set.

## Support

SE Ranking API documentation: https://seranking.com/api/integrations/mcp/.

In case you have any questions or need help, please contact us at [api@seranking.com](mailto:api@seranking.com)
