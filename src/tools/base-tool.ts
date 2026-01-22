import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';

import {
  DATA_API_BASE,
  PROJECT_API_BASE,
} from '../constants.js';

export enum ApiType {
  DATA = 'DATA',
  PROJECT = 'PROJECT',
}

let tokenProvider: (() => string) | null = null;

export function setTokenProvider(provider: (() => string) | null) {
  tokenProvider = provider;
}

export abstract class BaseTool {
  private readonly MISSING_TOKEN_MESSAGE = (type: ApiType) =>
    `Missing ${type === ApiType.DATA ? 'DATA_API_TOKEN' : 'PROJECT_API_TOKEN'}.`;

  abstract registerTool(server: McpServer): void;

  /**
   * Defines which API this tool interacts with.
   * Defaults to DATA API for backward compatibility.
   */
  protected apiType: ApiType = ApiType.DATA;

  protected server?: McpServer;

  register(server: McpServer): void {
    this.server = server;
    this.registerTool(server);
  }

  protected toolName(name: string): string {
    return `${this.apiType}_${name}`;
  }

  protected log(
    level: 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'critical' | 'alert' | 'emergency',
    message: string,
  ) {
    if (this.server && typeof this.server.sendLoggingMessage === 'function') {
      this.server
        .sendLoggingMessage({
          level,
          data: message,
        })
        .catch((err) => {
          console.error('Failed to send logging message:', err);
        });
    } else {
      console.error(`[${level.toUpperCase()}] ${message}`);
    }
  }

  protected getToken(): string | undefined {
    if (tokenProvider) {
      return tokenProvider();
    }
    if (this.apiType === ApiType.DATA) {
      return (
        process.env.DATA_API_TOKEN ||
        process.env.SERANKING_DATA_API_TOKEN ||
        process.env.SERANKING_API_TOKEN ||
        ''
      );
    }
    return process.env.PROJECT_API_TOKEN || process.env.SERANKING_PROJECT_API_TOKEN || '';
  }

  protected getBaseUrl(): string {
    return this.apiType === ApiType.DATA ? DATA_API_BASE : PROJECT_API_BASE;
  }

  protected isValidCommaSeparatedList(list: readonly string[], val?: string | null): boolean {
    if (!val) return true;

    const allowed = new Set<string>(list);

    return val
      .split(',')
      .map((s) => s.trim())
      .every((t) => allowed.has(t));
  }

  /**
   * Transforms underscore-notation filter params back to bracket notation for API calls.
   * E.g., filter_volume_from -> filter[volume][from]
   *       filter_intents -> filter[intents]
   */
  protected transformFilterParams(params: Record<string, unknown>): Record<string, unknown> {
    const transformed: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;

      let newKey = key;

      // Match filter_X_Y pattern (two-level bracket: filter[X][Y])
      // Handle underscores in the middle part by matching the last underscore as the separator
      const twoLevelMatch = key.match(/^filter_(.+)_(from|to)$/);
      if (twoLevelMatch) {
        newKey = `filter[${twoLevelMatch[1]}][${twoLevelMatch[2]}]`;
      } else {
        // Match filter_X pattern (single-level bracket: filter[X])
        const oneLevelMatch = key.match(/^filter_(.+)$/);
        if (oneLevelMatch) {
          newKey = `filter[${oneLevelMatch[1]}]`;
        }
      }

      transformed[newKey] = value;
    }

    return transformed;
  }

  protected async request(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    params: Record<string, unknown> = {},
  ): Promise<{ content: { type: 'text'; text: string }[] }> {
    const token = this.getToken();

    if (!token) {
      throw new McpError(ErrorCode.InvalidRequest, this.MISSING_TOKEN_MESSAGE(this.apiType));
    }

    let url = `${this.getBaseUrl()}${path}`;
    const options: RequestInit = {
      method,
      headers: { Authorization: `Token ${token}` },
    };

    if (method === 'GET') {
      const query = this.getUrlSearchParamsFromParams(params);
      url += `?${query.toString()}`;
    } else if (method === 'DELETE') {
      const query = this.getUrlSearchParamsFromParams(params);
      url += `?${query.toString()}`;
    } else if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      if (Object.keys(params).length > 0) {
        if (method === 'PATCH' || method === 'PUT') {
          options.headers = { ...options.headers, 'Content-Type': 'application/json' };
          options.body = JSON.stringify(params);
        }
      }
    }

    return this.executeRequest(url, options);
  }

  protected async makeGetRequest(path: string, params: Record<string, unknown>) {
    const query = this.getUrlSearchParamsFromParams(params);
    const url = `${this.getBaseUrl()}${path}?${query.toString()}`;

    return this.executeRequest(url, { method: 'GET' });
  }

  protected async makePostRequest(
    path: string,
    queryParams: Record<string, unknown>,
    formParams: Record<string, unknown>,
  ) {
    const query = this.getUrlSearchParamsFromParams(queryParams);
    const url = `${this.getBaseUrl()}${path}?${query.toString()}`;
    const form = this.getFormDataFromParams(formParams);

    return this.executeRequest(url, { method: 'POST', body: form });
  }

  protected async makePutRequest(path: string, body: Record<string, unknown>) {
    const url = `${this.getBaseUrl()}${path}`;
    return this.executeRequest(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  protected async makeJsonPostRequest(path: string, body: Record<string, unknown> | unknown[]) {
    const url = `${this.getBaseUrl()}${path}`;
    return this.executeRequest(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  protected async makePatchRequest(
    path: string,
    queryParams: Record<string, unknown>,
    body: Record<string, unknown> | unknown[],
  ) {
    const query = this.getUrlSearchParamsFromParams(queryParams);
    const url = `${this.getBaseUrl()}${path}?${query.toString()}`;
    return this.executeRequest(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  protected async makeDeleteRequest(path: string, params: Record<string, unknown>) {
    const query = this.getUrlSearchParamsFromParams(params);
    const url = `${this.getBaseUrl()}${path}?${query.toString()}`;
    return this.executeRequest(url, { method: 'DELETE' });
  }

  private async executeRequest(url: string, init: RequestInit) {
    const token = this.getToken();

    if (!token) {
      throw new McpError(ErrorCode.InvalidRequest, this.MISSING_TOKEN_MESSAGE(this.apiType));
    }

    const headers = new Headers(init.headers);
    headers.set('Authorization', `Token ${token}`);
    init.headers = headers;

    try {
      const res = await fetch(url, init);
      return await this.getJSONResponse(res, url);
    } catch (err: any) {
      // If it's already an McpError, rethrow it
      if (err instanceof McpError) throw err;

      throw new McpError(
        ErrorCode.InternalError,
        `Request failed: ${err?.message || String(err)}\nURL: ${url}`,
      );
    }
  }

  private async getJSONResponse(res: Response, url: string) {
    const text = await res.text();

    if (!res.ok) {
      throw new McpError(
        ErrorCode.InternalError,
        `API error (${res.status} ${res.statusText}). URL: ${url}\nBody: ${text}`,
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

      if (Array.isArray(value)) {
        for (const v of value) {
          if (v !== undefined && v !== null) query.append(key, String(v));
        }
      } else {
        query.append(key, String(value));
      }
    }

    return query;
  }

  private getFormDataFromParams(formParams: Record<string, unknown>) {
    const form = new FormData();

    for (const [key, value] of Object.entries(formParams || {})) {
      if (value === undefined || value === null) continue;

      if (Array.isArray(value)) {
        for (const v of value) {
          if (v !== undefined && v !== null) form.append(key, String(v));
        }
      } else {
        form.append(key, String(value));
      }
    }

    return form;
  }
}
