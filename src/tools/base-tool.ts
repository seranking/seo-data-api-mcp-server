import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

import { SERANKING_API_BASE } from "../constants.js";

export type TokenProvider = () => string | undefined;

let tokenProvider: TokenProvider = () => undefined;

export function setTokenProvider(fn: TokenProvider) {
  tokenProvider = fn;
}

export abstract class BaseTool {
  private readonly MISSING_TOKEN_MESSAGE = 'Missing SERANKING_API_TOKEN.';

  abstract registerTool(server: McpServer): void;

  protected server?: McpServer;

  register(server: McpServer): void {
    this.server = server;
    this.registerTool(server);
  }

  protected log(level: 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'critical' | 'alert' | 'emergency', message: string) {
    if (this.server) {
      this.server.sendLoggingMessage({
        level,
        data: message,
      });
    } else {
      console.error(`[${level.toUpperCase()}] ${message}`);
    }
  }

  protected getToken(): string | undefined {
    return tokenProvider?.();
  }

  protected isValidCommaSeparatedList(list: readonly string[], val?: string | null): boolean {
    if (!val) return true;

    const allowed = new Set<string>(list);

    return val
      .split(',')
      .map((s) => s.trim())
      .every((t) => allowed.has(t));
  }

  protected async request<T>(
    path: string,
    method: 'GET' | 'POST' = 'GET',
    params: Record<string, unknown> = {},
  ): Promise<{ content: { type: 'text'; text: string }[] }> {
    const token = this.getToken();

    if (!token) {
      throw new McpError(ErrorCode.InvalidRequest, this.MISSING_TOKEN_MESSAGE);
    }

    let url = `${SERANKING_API_BASE}${path}`;
    const options: RequestInit = {
      method,
      headers: { Authorization: `Token ${token}` },
    };

    if (method === 'GET') {
      const query = this.getUrlSearchParamsFromParams(params);
      url += `?${query.toString()}`;
    } else {
      // For POST, we assume form data for now as per original implementation
      // But we should check if it needs to be JSON.
      // The original implementation used FormData for POST.
      // We'll separate query params and body params if needed, but the original
      // makePostRequest took queryParams and formParams.
      // To keep it simple and generic, let's stick to the original signature style or adapt.
      // The original makePostRequest took (path, queryParams, formParams).
      // Let's keep makeGetRequest and makePostRequest but implement them using a common private method
      // or just keep them separate but improved.
      // The plan said "Consolidate ... into a single request method".
      // But GET and POST have different signatures in the original code (POST has query AND body).
      // Let's support both in `request`.
    }

    // Re-evaluating consolidation:
    // GET: path, params -> query
    // POST: path, queryParams, formParams -> query + body
    // Let's keep makeGetRequest and makePostRequest as public/protected helpers that call a private `executeRequest`.

    return this.executeRequest<T>(url, options);
  }

  protected async makeGetRequest<T>(path: string, params: Record<string, unknown>) {
    const query = this.getUrlSearchParamsFromParams(params);
    const url = `${SERANKING_API_BASE}${path}?${query.toString()}`;

    return this.executeRequest<T>(url, { method: 'GET' });
  }

  protected async makePostRequest<T>(
    path: string,
    queryParams: Record<string, unknown>,
    formParams: Record<string, unknown>,
  ) {
    const query = this.getUrlSearchParamsFromParams(queryParams);
    const url = `${SERANKING_API_BASE}${path}?${query.toString()}`;
    const form = this.getFormDataFromParams(formParams);

    return this.executeRequest<T>(url, { method: 'POST', body: form });
  }

  private async executeRequest<T>(url: string, init: RequestInit) {
    const token = this.getToken();

    if (!token) {
      throw new McpError(ErrorCode.InvalidRequest, this.MISSING_TOKEN_MESSAGE);
    }

    const headers = new Headers(init.headers);
    headers.set('Authorization', `Token ${token}`);
    init.headers = headers;

    try {
      const res = await fetch(url, init);
      return await this.getJSONResponse<T>(res, url);
    } catch (err: any) {
      // If it's already an McpError, rethrow it
      if (err instanceof McpError) throw err;

      throw new McpError(
        ErrorCode.InternalError,
        `Request failed: ${err?.message || String(err)}\nURL: ${url}`
      );
    }
  }

  private async getJSONResponse<T>(res: Response, url: string) {
    const text = await res.text();

    if (!res.ok) {
      throw new McpError(
        ErrorCode.InternalError,
        `API error (${res.status} ${res.statusText}). URL: ${url}\nBody: ${text}`
      );
    }

    let pretty = text;

    try {
      const json = JSON.parse(text);
      pretty = JSON.stringify(json, null, 2);
    } catch (err: any) {
      this.log(
        'warning',
        `Failed to pretty-print JSON response: ${err?.message || String(err)}. Response text: ${text}`,
      );
      // If it's not JSON, we just return the text as is, or maybe we should fail if we expect JSON?
      // The original code just returned the text if it failed to parse/pretty-print.
    }

    return { content: [{ type: 'text' as const, text: pretty }] };
  }

  private getUrlSearchParamsFromParams(queryParams: Record<string, unknown>) {
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(queryParams || {})) {
      if (value === undefined || value === null) continue;

      // Transform dot notation back to bracket notation for SE Ranking API
      // filter.volume.from -> filter[volume][from]
      // filter.keyword_count.from -> filter[keyword_count][from]
      // filter.multi_keyword_excluded -> filter[multi_keyword_excluded]
      const apiKey = key.replace(/^filter\.([^.]+)\.([^.]+)$/, 'filter[$1][$2]')
                        .replace(/^filter\.([^.]+)$/, 'filter[$1]');

      if (Array.isArray(value)) {
        for (const v of value) {
          if (v !== undefined && v !== null) query.append(apiKey, String(v));
        }
      } else {
        query.append(apiKey, String(value));
      }
    }

    return query;
  }

  private getFormDataFromParams(formParams: Record<string, unknown>) {
    const form = new FormData();

    for (const [key, value] of Object.entries(formParams || {})) {
      if (value === undefined || value === null) continue;

      // Transform dot notation back to bracket notation for SE Ranking API
      // filter.volume.from -> filter[volume][from]
      // filter.keyword_count.from -> filter[keyword_count][from]
      // filter.multi_keyword_excluded -> filter[multi_keyword_excluded]
      const apiKey = key.replace(/^filter\.([^.]+)\.([^.]+)$/, 'filter[$1][$2]')
                        .replace(/^filter\.([^.]+)$/, 'filter[$1]');

      if (Array.isArray(value)) {
        for (const v of value) {
          if (v !== undefined && v !== null) form.append(apiKey, String(v));
        }
      } else {
        form.append(apiKey, String(value));
      }
    }

    return form;
  }
}
