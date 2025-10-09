# MCP Server


## Installation

### Getting a copy of the project

Save a copy of the project to a local directory, for example /path/to/seo-data-api-mcp-server.

### Set up environment variables

The SE Ranking Data API access key is set via an environment variable, which can be done globally or through the Claude Desktop configuration.

```bash
export SERANKING_API_TOKEN=your-token-here
```

### Option 1: Build the Docker Image (recommended)

#### Prerequisites

- Docker, Docker Compose

```bash
cd /path/to/seo-data-api-mcp-server
docker compose build
# Check that the image is built and named `se-ranking/seo-data-api-mcp-server`:
docker image ls
```
Note: don't worry about the warnings, this is normal when building the image:
```
WARN[0000] The "SERANKING_API_TOKEN" variable is not set. Defaulting to a blank string. 
WARN[0000] The "SERANKING_API_BASE" variable is not set. Defaulting to a blank string.
```

### Option 2: Installation as an NPM package

#### Prerequisites

- Node.js 18+

```bash
cd /path/to/seo-data-api-mcp-server
npm install
npm run build
# Check that the build starts successfully and press Ctrl+C to stop it.
npm start
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

Example of <b>Claude Desktop</b> configuration for MCP server

<b>Node configuration template</b>:
```json
{
  "mcpServers": {
    "se-ranking/seo-data-api-mcp-server": {
      "command": "node",
      "args": ["/absolute-path/to/seo-data-api-mcp-server/dist/index.js"],
      "env": {
        "SERANKING_API_TOKEN": "<your-api-token-here>"
      }
    }
  }
}
```

<b>Docker configuration template</b>:

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
      "cwd": "/absolute-path/to/your/seo-data-api-mcp-server",
      "env": {
        "SERANKING_API_BASE": "https://api.seranking.com",
        "SERANKING_API_TOKEN": "<your-api-token-here>"
      }
    }
  }
}
```
Most likely in the configuration template you only need to change the <b>SERANKING_API_TOKEN</b> and <b>"cwd"</b> path to the repository.

After saving <b>claude_desktop_config.json</b>, restart Claude Desktop. You should see the server under MCP Servers/Tools.

### SE Ranking API
For the reference, see https://seranking.com/api/mcp/

### Troubleshooting

#### Docker image problems
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

- Incorrect/invalid JSON: Double-check the <b>claude_desktop_config.json</b> or <b>settings.json</b> for any syntax errors like missing commas or brackets. You can validate the JSON here: https://jsonlint.com/.

- Incorrect Path: Ensure the <b>"cwd"</b> path in your JSON configuration is the correct, full absolute path to the <b>seo-data-api-mcp-server</b> directory.

#### Docker image running, but MCP server is not visible in Claude Desktop

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
      "SERANKING_API_TOKEN=8abcdef-6fdd-a981-3ad5-123456",
      "SERANKING_API_BASE=https://api.seranking.com",
      "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
      "NODE_VERSION=20.19.5",
      "YARN_VERSION=1.22.22",
      "NODE_ENV=production"
    ]
  }
}
```
Which shows you if you have the correct environment variables set.

In case you have any questions or need help, please contact us at [api@seranking.com](mailto:api@seranking.com)
