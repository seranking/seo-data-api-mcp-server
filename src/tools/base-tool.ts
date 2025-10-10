import type {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {SERANKING_API_BASE} from "./../constants.js";

export type TokenProvider = () => string | undefined;

let tokenProvider: TokenProvider = () => undefined;

export function setTokenProvider(fn: TokenProvider) {
    tokenProvider = fn;
}

export abstract class BaseTool {
    private readonly MISSING_TOKEN_MESSAGE = "Missing SERANKING_API_TOKEN.";

    abstract registerTool(server: McpServer): void;

    protected getToken(): string | undefined {
        return tokenProvider?.();
    }

    protected isValidCommaSeparatedList(list: readonly string[], val?: string | null): boolean {
        if (!val) return true;
        const allowed = new Set<string>(list as readonly string[]);
        return val
            .split(",")
            .map((s) => s.trim())
            .every((t) => allowed.has(t));
    }

    protected async makeGetRequest(path: string, params: Record<string, unknown>) {
        const query = this.getUrlSearchParamsFromParams(params);

        const url = `${SERANKING_API_BASE}${path}?${query.toString()}`;

        const token = this.getToken();

        if (!token) {
            return {
                content: [
                    {
                        type: "text" as const,
                        text: this.MISSING_TOKEN_MESSAGE,
                    },
                ],
            };
        }

        try {
            console.log("before GET request to the API", url);

            const res = await fetch(url, {
                method: "GET",
                headers: {Authorization: `Token ${token}`},
            });

            return await this.getJSONResponse(res, url);

        } catch (err: any) {
            return {
                content: [{
                    type: "text" as const,
                    text: `Request failed: ${err?.message || String(err)}\nURL: ${url}`
                }]
            };
        }
    }

    protected async makePostRequest(
        path: string,
        queryParams: Record<string, unknown>,
        formParams: Record<string, unknown>
    ) {
        const query = this.getUrlSearchParamsFromParams(queryParams);

        const url = `${SERANKING_API_BASE}${path}?${query.toString()}`;

        const token = this.getToken();

        if (!token) {
            return {
                content: [
                    {type: "text" as const, text: this.MISSING_TOKEN_MESSAGE},
                ],
            };
        }

        const form = this.getFormDataFromParams(formParams);

        try {
            console.log("before POST request to the API", url, "form params:", formParams);

            const res = await fetch(url, {
                method: "POST",
                headers: {Authorization: `Token ${token}`},
                body: form,
            });

            return await this.getJSONResponse(res, url);
        } catch (err: any) {
            return {
                content: [{
                    type: "text" as const,
                    text: `Request failed: ${err?.message || String(err)}\nURL: ${url}`
                }]
            };
        }
    }

    private async getJSONResponse(res: Response, url: string) {
        const text = await res.text();

        if (!res.ok) {
            return {
                content: [
                    {
                        type: "text" as const,
                        text: `API error (${res.status} ${res.statusText}). URL: ${url}\nBody: ${text}`
                    },
                ],
            };
        }

        let pretty = text;

        try {
            pretty = JSON.stringify(JSON.parse(text), null, 2);
        } catch {
        }

        return {content: [{type: "text" as const, text: pretty}]};
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
