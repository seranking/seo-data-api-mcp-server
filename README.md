# MCP Server

## Installation

### Prerequisites
   Before you begin, please ensure you have the following software and accounts ready:

- **SE Ranking Account**: You will need an active SE Ranking account to generate an API token. If you don’t have one, you can [sign up here](https://online.seranking.com/admin.api.dashboard.html).
- **Docker**: A platform for developing, shipping, and running applications in containers. If you don’t have it, you can [download it from the official Docker website](https://www.docker.com/get-started).
- **Docker Compose Plugin**: The Docker Compose plugin is a Docker CLI plugin that provides a command-line interface (CLI) for Docker Compose. To build the Docker image, you need to have [Docker Compose installed](https://docs.docker.com/compose/install/).
- **Git**: A free and open-source distributed version control system. You can download it from the official Git website.
- **AI Assistant**: You will need either the [Claude Desktop App](https://www.anthropic.com/claude) or the [Gemini CLI](https://github.com/google-gemini/gemini-cli) installed and configured on your machine.

### Installation Steps
Follow these steps to install the SEO-MCP server on your local machine.
- Open your terminal (or Command Prompt/PowerShell on Windows).
- Clone the project repository from GitHub. This command downloads the necessary files to your machine.
```shell 
git clone https://github.com/seranking/seo-data-api-mcp-server.git
```
- Navigate into the new directory in your terminal: 
```shell
cd seo-data-api-mcp-server
```

### Build the Docker Image
Make sure you're in the `seo-data-api-mcp-server` repository directory, and run:
```bash
docker compose build
# Check that the image is built and named `se-ranking/seo-data-api-mcp-server`:
docker image ls
```
Note: don't worry about the warnings, this is normal when building the image:
```
WARN[0000] The "SERANKING_API_TOKEN" variable is not set. Defaulting to a blank string.
```

#### How to Update SEO-MCP
To ensure you have the latest features and improvements, you should update the tool periodically.
- Navigate to your `seo-data-api-mcp-server` directory in the terminal. 
- Pull the latest changes from the GitHub repository.

```shell
git pull origin main
```

## Connect to Claude Desktop

Claude Desktop reads its configuration from `claude_desktop_config.json`.

- Click on the Claude menu and select **Settings...**.
- In the Settings window, navigate to the **Developer** tab in the left sidebar.
- Click the **Edit Config** button to open the configuration file. This action creates a new configuration file if one doesn’t exist or opens your existing configuration.

The file is located at:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
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
        "SERANKING_API_TOKEN",
        "se-ranking/seo-data-api-mcp-server"
      ],
      "env": {
        "SERANKING_API_TOKEN": "<your-api-token-here>"
      }
    }
  }
}
```
- You need to change the **SERANKING_API_TOKEN**, get yours from https://online.seranking.com/admin.api.dashboard.html

- After saving **claude_desktop_config.json**, restart Claude Desktop. You should see the server under MCP Servers/Tools.

- To verify the setup, ask Claude: `Do you have access to MCP?` It should respond by listing `seo-data-api-mcp`.

![Claude Desktop: Verify the MCP access](docs-img/claude-desktop-1.png)

- Your setup is complete! You can now run complex SEO queries using natural language.

![Claude Desktop: List MCP Servers](docs-img/claude-desktop-2.png)


## Connect to Gemini CLI

- Open the Gemini CLI settings file, which is typically located at: `~/.gemini/settings.json`
- Add the following JSON configuration, making sure to **replace the SERANKING_API_TOKEN placeholder value.**

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
        "SERANKING_API_TOKEN",
        "se-ranking/seo-data-api-mcp-server"
      ],
      "env": {
        "SERANKING_API_TOKEN": "<your-api-token-here>"
      }
    }
  }
}
```

`"SERANKING_API_TOKEN"`: Use your personal API token, which you can generate from the [SE Ranking API Dashboard](https://online.seranking.com/admin.api.dashboard.html).

- Save the configuration file.

- To verify the setup, launch the **Gemini CLI** by running `gemini` in your terminal. Once the interface is active, press `Ctrl+T` to view the available MCP servers. Ensure seo-data-api-mcp is listed.

![Gemini CLI: Configured MCP Servers](docs-img/gemini-1.png)

- Your setup is complete! You can now run complex SEO queries using natural language.

![Gemini CLI: SEO Queries Example](docs-img/gemini-1.png)


## Run as HTTP Server (Node)
In order to run the local Node server, you need to have [Node.js 18+](https://nodejs.org/en/download) version installed on your machine.

To build the project, use the following command:
```shell
npm run build
```

To start the server use the command:
```shell
npm run start-http
```

To send the sample test request, which will verify if your server runs properly and has the correct setup,
**open another terminal window**, and run the following command **with your SE Ranking API token provided** as an argument: 
```shell
./test-http-server-curl-request.sh '<your-api-token-here>'
```
For batch MCP Requests testing, you can use this script:
```shell
./test-batch-http-server-curl-request.sh '<your-api-token-here>'
```

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
      "SERANKING_API_TOKEN=8abcdef-6fdd-a981-3ad5-123456",
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
