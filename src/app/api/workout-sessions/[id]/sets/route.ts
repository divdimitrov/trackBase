import { supabaseServer } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson, validateUuid, pickFields, type RouteCtx } from '@/lib/api/http';

export const GET = withAuth(async (_req, ctx: RouteCtx) => {
  const { id: sessionId } = await ctx.params;
  const bad = validateUuid(sessionId);
  if (bad) return bad;

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('workout_sets')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data);
});

export const POST = withAuth(async (req, ctx: RouteCtx) => {
  const { id: sessionId } = await ctx.params;
  const bad = validateUuid(sessionId);
  if (bad) return bad;

  const [body, err] = await parseJson(req);
  if (err) return err;

  const [fields] = pickFields(body, ['exercise', 'name', 'reps', 'weight', 'notes']);
  if (!fields.exercise && !fields.name) {
    return jsonError('exercise or name is required');
  }

  const row = { session_id: sessionId, ...fields };
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('workout_sets')
    .insert(row)
    .select()
    .single();

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data, 201);
});
