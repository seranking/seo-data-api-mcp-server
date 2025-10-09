# MCP Server


## Installation

### Getting a copy of the project

Save a copy of the project to a local directory, for example /path/to/seo-data-api-mcp-server.

### Set up environment variables

The SE Ranking Data API access key is set via an environment variable, which can be done globally or through the Claude Desktop configuration.

```bash
export SERANKING_API_TOKEN=your-token-here
```

### Option 1: Installation as an NPM package

#### Prerequisites

- Node.js 18+

```bash
cd /path/to/seo-data-api-mcp-server
npm install
npm run build
# Check that the build starts successfully and press Ctrl+C to stop it.
npm start
```

### Option 2: Build the Docker Image

#### Prerequisites

- Docker, Docker Compose

```bash
cd /path/to/seo-data-api-mcp-server
docker compose build
# Check that the image is built and named `se-ranking/seo-data-api-mcp-server`:
docker image ls
```

### Connect to Claude Desktop

Claude Desktop reads its configuration from claude_desktop_config.json.

- Click on the Claude menu and select “Settings…”.
- In the Settings window, navigate to the “Developer” tab in the left sidebar.
- Click the “Edit Config” button to open the configuration file. This action creates a new configuration file if one doesn’t exist or opens your existing configuration.

The file is located at:
- macOS: ~/Library/Application\ Support/Claude/claude_desktop_config.json
- Windows: %AppData%\Claude\claude_desktop_config.json
- Linux: ~/.config/Claude/claude_desktop_config.json

Example of Claude Desktop configuration for MCP server, running via Node:
```json
{
  "mcpServers": {
    "se-ranking/seo-data-api-mcp-server": {
      "command": "node",
      "args": ["/path/to/seo-data-api-mcp-server/dist/index.js"],
      "env": {
        "SERANKING_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

Example of Claude Desktop configuration for MCP server, running via docker image:

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
        "SERANKING_API_BASE",
        "-e",
        "SERANKING_API_TOKEN",
        "se-ranking/seo-data-api-mcp-server"
      ],
      "cwd": "/path/to/your/seo-data-api-mcp-server",
      "env": {
        "SERANKING_API_BASE": "https://api.seranking.com",
        "SERANKING_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

After saving claude_desktop_config.json, restart Claude Desktop. You should see the server under MCP Servers/Tools.
