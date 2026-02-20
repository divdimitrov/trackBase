import { supabaseServer } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson, pickFields, parsePagination } from '@/lib/api/http';

export const GET = withAuth(async (req) => {
  const { limit, offset } = parsePagination(req);
  const supabase = supabaseServer();

  // Try ordering by session_date first, fall back to created_at
  let result = await supabase
    .from('workout_sessions')
    .select('*')
    .order('session_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (result.error?.message?.includes('session_date')) {
    result = await supabase
      .from('workout_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
  }

  if (result.error) return jsonError(result.error.message, 500, result.error.details);
  return jsonOk(result.data);
});

export const POST = withAuth(async (req) => {
  const [body, err] = await parseJson(req);
  if (err) return err;

  const [row, hasFields] = pickFields(body, ['title', 'name', 'notes', 'session_date']);
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
});
