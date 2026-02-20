import { NextResponse } from 'next/server';
import { jsonError } from './http';

/**
 * Verify x-api-key header matches APP_API_KEY env var.
 * Returns a 401 Response if invalid, or null if OK.
 */
export function requireApiKey(req: Request): NextResponse | null {
  const expected = process.env.APP_API_KEY;
  if (!expected) {
    // If env var not set, allow all (dev convenience)
    return null;
  }
  const provided = req.headers.get('x-api-key');
  if (provided !== expected) {
    return jsonError('Unauthorized: invalid or missing x-api-key', 401);
  }
  return null;
}

/**
 * Higher-order wrapper that handles:
 *  1. API key check
 *  2. Top-level try/catch → 500 JSON
 */
export function withAuth<A extends unknown[]>(
  handler: (req: Request, ...args: A) => Promise<NextResponse>,
) {
  return async (req: Request, ...args: A): Promise<NextResponse> => {
    const denied = requireApiKey(req);
    if (denied) return denied;
    try {
      return await handler(req, ...args);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return jsonError(message, 500);
    }
  };
}
