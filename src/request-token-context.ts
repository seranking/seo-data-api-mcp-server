import { AsyncLocalStorage } from 'node:async_hooks';

export type ApiType = 'DATA' | 'PROJECT';

export interface RequestTokens {
  dataApiToken?: string;
  projectApiToken?: string;
  sessionId?: string;
}

/** Set by HTTP server so tools can fall back to session-stored tokens if async context is lost */
let sessionTokenProvider: ((sessionId: string) => RequestTokens | undefined) | null = null;

export function setSessionTokenProvider(
  fn: ((sessionId: string) => RequestTokens | undefined) | null,
): void {
  sessionTokenProvider = fn;
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
 * Falls back to session-stored tokens if async context was lost (e.g. deferred tool execution).
 */
export function getRequestToken(apiType: ApiType): string | undefined {
  const store = requestTokenStorage.getStore();
  const fromStore = store
    ? apiType === 'DATA'
      ? store.dataApiToken
      : store.projectApiToken
    : undefined;
  if (fromStore) return fromStore;
  if (store?.sessionId && sessionTokenProvider) {
    const sessionTokens = sessionTokenProvider(store.sessionId);
    return sessionTokens
      ? apiType === 'DATA'
        ? sessionTokens.dataApiToken
        : sessionTokens.projectApiToken
      : undefined;
  }
  return undefined;
}
