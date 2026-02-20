// ---------------------------------------------------------------------------
// Client-side API helper – runs in the browser, sends x-api-key header.
// ---------------------------------------------------------------------------

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

async function request<T>(
  method: string,
  path: string,
  apiKey: string,
  body?: unknown,
): Promise<ApiResult<T>> {
  try {
    const headers: Record<string, string> = { 'x-api-key': apiKey };
    const opts: RequestInit = { method, headers };

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }

    const res = await fetch(path, opts);
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const msg =
        (json as { error?: string })?.error ??
        `Request failed (${res.status})`;
      return { data: null, error: msg };
    }

    return { data: json as T, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Network error',
    };
  }
}

export function apiGet<T>(path: string, apiKey: string) {
  return request<T>('GET', path, apiKey);
}

export function apiPost<T>(path: string, apiKey: string, body: unknown) {
  return request<T>('POST', path, apiKey, body);
}

export function apiPut<T>(path: string, apiKey: string, body: unknown) {
  return request<T>('PUT', path, apiKey, body);
}

export function apiDelete<T = { deleted: boolean }>(path: string, apiKey: string) {
  return request<T>('DELETE', path, apiKey);
}
