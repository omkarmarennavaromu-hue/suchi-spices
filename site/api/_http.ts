/**
 * Minimal structural types for the serverless handlers.
 *
 * Using these instead of `@vercel/node` keeps the dependency list unchanged —
 * Vercel's own `IncomingMessage` / `ServerResponse` objects are structurally
 * compatible with both interfaces, as is the tiny adapter in `vite.config.ts`
 * that serves these routes during `npm run dev`.
 */
export interface ApiRequest {
  readonly method?: string;
  readonly body?: unknown;
}

export interface ApiResponse {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string): void;
  json(payload: unknown): void;
}

export type ApiHandler = (req: ApiRequest, res: ApiResponse) => void | Promise<void>;

/** Safely pull a string field out of a request body that may be anything. */
export function readString(body: unknown, key: string): string {
  if (!body || typeof body !== 'object') return '';
  const value = (body as Record<string, unknown>)[key];
  return typeof value === 'string' ? value.trim() : '';
}

/** Vercel gives us a parsed object; the dev adapter gives us the same shape. */
export function readBody(body: unknown): unknown {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body ?? {};
}
