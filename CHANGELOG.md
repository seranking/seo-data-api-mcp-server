# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Docker HTTP mode**: Docker image runs the HTTP server (not stdio) so the server can be reached at `http://0.0.0.0:5000/mcp`. Set `HOST=0.0.0.0` and `EXPOSE 5000` in the Dockerfile; `docker-compose` maps port 5000.
- **Remote/LAN access**: `ALLOWED_HOSTS` env var (comma-separated list or `*`) so the server accepts requests when the `Host` header is not localhost (e.g. `http://your-server:5000/mcp`).
- **Token via HTTP headers**: Clients can send tokens with each request via `X-Seranking-Data-Api-Token`, `X-Seranking-Project-Api-Token`, or `Authorization: Bearer <token>`. Tokens are read from the request and passed into tools (no need to set env on the server for HTTP).
- **Session handling**: MCP Streamable HTTP sessions are kept so that GET (event stream) and subsequent POSTs use the same server/transport. Session ID is captured from the first response and reused.
- **Clear token errors**: When a token is missing for the requested API (Data vs Project), the error message tells the agent exactly which token is needed and where to add it (e.g. “Project API tools require SERANKING_PROJECT_API_TOKEN … Add it in your MCP client config”), so the agent can guide the user instead of suggesting shell env.
- **SERANKING\_\* env names**: Primary env vars are `SERANKING_DATA_API_TOKEN` and `SERANKING_PROJECT_API_TOKEN`; `DATA_API_TOKEN` and `PROJECT_API_TOKEN` remain supported as legacy.
- **Claude Desktop**: README documents HTTP (remote) setup with `mcp-remote` and `--header` for token passing (Option B).
- **Gemini CLI**: README documents HTTP setup with `httpUrl` and `headers`, and using `.env` with `${SERANKING_DATA_API_TOKEN}` / `${SERANKING_PROJECT_API_TOKEN}` so tokens stay out of `settings.json`.

### Fixed

- **GET /mcp crash**: GET requests (event stream) have no body; `isAuthenticationRequired` no longer reads `req.body.method` when body is missing.
- **403 / “No token” with HTTP**: Request-scoped tokens (and session-stored fallback) so tools receive the Bearer/header token even when the MCP SDK runs tool handlers asynchronously.

### Changed

- **Dockerfile**: `CMD` runs `dist/http-server.js` instead of `dist/index.js`; `ENV HOST=0.0.0.0`, `EXPOSE 5000`.
- **docker-compose.yml**: `HOST=0.0.0.0`, `ports: "5000:5000"`.
- **README**: API tokens section updated for SERANKING\_\* vars, Docker vs HTTP table, Gemini with `.env` and header examples; all examples use placeholders (no personal IPs).

### Security

- No secrets or personal data in the repo; example URLs use `your-server` or `localhost`.
