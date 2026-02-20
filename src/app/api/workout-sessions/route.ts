import { supabaseServer } from '@/lib/supabase/server';
import { requireApiKey } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson } from '@/lib/api/http';

export async function GET(req: Request) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const supabase = supabaseServer();

  // Try ordering by session_date first, fall back to created_at
  let result = await supabase
    .from('workout_sessions')
    .select('*')
    .order('session_date', { ascending: false });

  if (result.error?.message?.includes('session_date')) {
    result = await supabase
      .from('workout_sessions')
      .select('*')
      .order('created_at', { ascending: false });
  }

  if (result.error) return jsonError(result.error.message, 500);
  return jsonOk(result.data);
}

export async function POST(req: Request) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const [body, err] = await parseJson<Record<string, unknown>>(req);
  if (err) return err;

  // Build insert payload from known possible columns
  const row: Record<string, unknown> = {};
  if (body!.title !== undefined) row.title = body!.title;
  if (body!.name !== undefined) row.name = body!.name;
  if (body!.notes !== undefined) row.notes = body!.notes;
  if (body!.session_date !== undefined) row.session_date = body!.session_date;

  if (!row.title && !row.name) {
    return jsonError('title or name is required');
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('workout_sessions')
    .insert(row)
    .select()
    .single();

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data, 201);
}
