import { NextResponse } from 'next/server';

/** Return a JSON success response */
export function jsonOk(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

/** Return a JSON error response */
export function jsonError(message: string, status = 400, details?: unknown) {
  const body: { error: string; details?: unknown } = { error: message };
  if (details !== undefined) body.details = details;
  return NextResponse.json(body, { status });
}

/** Safely parse JSON body; returns [parsed, null] or [null, Response] */
export async function parseJson<T = unknown>(
  req: Request,
): Promise<[T, null] | [null, NextResponse]> {
  try {
    const body = (await req.json()) as T;
    return [body, null];
  } catch {
    return [null, jsonError('Invalid JSON body', 400)];
  }
}
