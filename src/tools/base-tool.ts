import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SERANKING_API_BASE, SERANKING_API_TOKEN } from "./../constants.js";

export abstract class BaseTool {
  abstract registerTool(server: McpServer): void;

  isValidCommaSeparatedList(list: readonly string[], val?: string | null): boolean {
    if (!val) return true;
    const allowed = new Set<string>(list as readonly string[]);
    return val
      .split(",")
      .map((s) => s.trim())
      .every((t) => allowed.has(t));
  }

  protected async makeGetRequest(path: string, params: Record<string, unknown>) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const v of value) {
          if (v !== undefined && v !== null) query.append(key, String(v));
        }
      } else {
        query.append(key, String(value));
      }
    }
    const url = `${SERANKING_API_BASE}${path}?${query.toString()}`;

    if (!SERANKING_API_TOKEN) {
      return {
        content: [
          {
            type: "text" as const,
            text: "Missing SERANKING_API_TOKEN environment variable. Please set it to a valid API token."
          }
        ]
      };
    }

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {Authorization: `Token ${SERANKING_API_TOKEN}`}
      });
      const text = await res.text();
      if (!res.ok) {
        return {
          content: [
            {type: "text" as const, text: `API error (${res.status} ${res.statusText}). URL: ${url}\nBody: ${text}`}
          ]
        };
      }
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
      }
      return {content: [{type: "text" as const, text: pretty}]};
    } catch (err: any) {
      return {content: [{type: "text" as const, text: `Request failed: ${err?.message || String(err)}\nURL: ${url}`}]};
    }
  }

  protected async makePostRequest(
    path: string,
    queryParams: Record<string, unknown>,
    formParams: Record<string, unknown>
  ) {
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
    const url = `${SERANKING_API_BASE}${path}?${query.toString()}`;

    if (!SERANKING_API_TOKEN) {
      return {
        content: [
          {type: "text" as const, text: "Missing SERANKING_API_TOKEN environment variable. Please set it to a valid API token."}
        ]
      };
    }

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

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {Authorization: `Token ${SERANKING_API_TOKEN}`},
        body: form
      });
      const text = await res.text();
      if (!res.ok) {
        return {content: [{type: "text" as const, text: `API error (${res.status} ${res.statusText}). URL: ${url}\nBody: ${text}`}]};
      }
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
      }
      return {content: [{type: "text" as const, text: pretty}]};
    } catch (err: any) {
      return {content: [{type: "text" as const, text: `Request failed: ${err?.message || String(err)}\nURL: ${url}`}]};
    }
  }
}
