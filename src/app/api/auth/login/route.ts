import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = (await req.json()) as { password?: string };

    const expected = process.env.ADMIN_PASSWORD;
    const apiKey = process.env.APP_API_KEY;

    if (!expected || !apiKey) {
      return NextResponse.json(
        { error: 'Server not configured — set ADMIN_PASSWORD and APP_API_KEY' },
        { status: 500 },
      );
    }

    // Allow auto-login on localhost in dev
    const isLocalhost =
      req.headers.get('host')?.startsWith('localhost') ||
      req.headers.get('host')?.startsWith('127.0.0.1');
    const isDevBypass = password === '__dev_bypass__' && isLocalhost;

    if (!isDevBypass && (!password || password !== expected)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({ apiKey });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
