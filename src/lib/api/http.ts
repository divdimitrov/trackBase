import { NextResponse } from 'next/server';
import type { PostgrestError } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

/** Context shape for dynamic `[id]` routes in Next.js App Router. */
export type RouteCtx = { params: Promise<{ id: string }> };

// ---------------------------------------------------------------------------
// JSON response helpers
// ---------------------------------------------------------------------------

/** Return a JSON success response. */
export function jsonOk(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

/** Return a JSON error response. */
export function jsonError(message: string, status = 400, details?: unknown) {
  const body: { error: string; details?: unknown } = { error: message };
  if (details !== undefined) body.details = details;
  return NextResponse.json(body, { status });
}

// ---------------------------------------------------------------------------
// Request parsing
// ---------------------------------------------------------------------------

/**
 * Safely parse a JSON body.
 * Returns `[data, null]` on success or `[null, errorResponse]` on failure.
 * After the `if (err) return err;` guard the body is narrowed to `T`.
 */
export async function parseJson<T = Record<string, unknown>>(
  req: Request,
): Promise<[T, null] | [null, NextResponse]> {
  try {
    const body = (await req.json()) as T;
    return [body, null];
  } catch {
    return [null, jsonError('Invalid JSON body', 400)];
  }
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Returns a 400 Response if `id` is not a valid UUID, otherwise null. */
export function validateUuid(id: string): NextResponse | null {
  if (!UUID_RE.test(id)) {
    return jsonError('Invalid id format — expected UUID', 400);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Supabase error helpers
// ---------------------------------------------------------------------------

/** Map a PostgREST error to 404 (PGRST116 = "not found") or 500. */
export function notFoundOr500(error: PostgrestError, label: string) {
  if (error.code === 'PGRST116') return jsonError(`${label} not found`, 404);
  return jsonError(error.message, 500, error.details);
}

// ---------------------------------------------------------------------------
// Object helpers
// ---------------------------------------------------------------------------

/**
 * Pick only the listed keys from `source` where the value is not `undefined`.
 * Returns the filtered object and a boolean indicating it's non-empty.
 */
export function pickFields(
  source: Record<string, unknown>,
  keys: readonly string[],
): [Record<string, unknown>, boolean] {
  const out: Record<string, unknown> = {};
  for (const k of keys) {
    if (source[k] !== undefined) out[k] = source[k];
  }
  return [out, Object.keys(out).length > 0];
}

// ---------------------------------------------------------------------------
// Pagination helpers
// ---------------------------------------------------------------------------

/** Parse `?limit=` and `?offset=` from the URL. Defaults: limit 100, offset 0. */
export function parsePagination(req: Request): { limit: number; offset: number } {
  const url = new URL(req.url);
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') ?? '100', 10) || 100, 1), 1000);
  const offset = Math.max(parseInt(url.searchParams.get('offset') ?? '0', 10) || 0, 0);
  return { limit, offset };
}
