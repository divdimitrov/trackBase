import { jsonError } from './http';

/**
 * Verify x-api-key header matches APP_API_KEY env var.
 * Returns a 401 Response if invalid, or null if OK.
 */
export function requireApiKey(req: Request) {
  const expected = process.env.APP_API_KEY;
  if (!expected) {
    // If env var not set, allow all (dev convenience) — remove this in prod
    return null;
  }
  const provided = req.headers.get('x-api-key');
  if (provided !== expected) {
    return jsonError('Unauthorized: invalid or missing x-api-key', 401);
  }
  return null;
}
