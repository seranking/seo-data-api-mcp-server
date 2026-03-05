import { AsyncLocalStorage } from 'node:async_hooks';

export type ApiType = 'DATA' | 'PROJECT';

export interface RequestTokens {
  dataApiToken?: string;
  projectApiToken?: string;
}

const requestTokenStorage = new AsyncLocalStorage<RequestTokens>();

/**
 * Run a function with request-scoped API tokens (e.g. from Authorization header).
 * Used by the HTTP server so tokens passed by the client are available in tools.
 */
export function runWithRequestTokens<T>(tokens: RequestTokens, fn: () => T): T {
  return requestTokenStorage.run(tokens, fn);
}

/**
 * Get the token for the current request context (DATA or PROJECT API).
 * Returns undefined if not in a request context or token not set.
 */
export function getRequestToken(apiType: ApiType): string | undefined {
  const store = requestTokenStorage.getStore();
  if (!store) return undefined;
  return apiType === 'DATA' ? store.dataApiToken : store.projectApiToken;
}
