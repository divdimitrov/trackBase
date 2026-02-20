import { supabaseServer } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson, pickFields, parsePagination } from '@/lib/api/http';

export const GET = withAuth(async (req) => {
  const { limit, offset } = parsePagination(req);
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .order('workout_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data);
});

export const POST = withAuth(async (req) => {
  const [body, err] = await parseJson(req);
  if (err) return err;

  const [row, hasFields] = pickFields(body, ['title', 'notes', 'workout_date']);
  if (!row.title) {
    return jsonError('title is required');
  }
  if (!row.workout_date) {
    row.workout_date = new Date().toISOString().slice(0, 10);
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
