import { supabaseServer } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api/requireApiKey';
import {
  jsonOk, jsonError, parseJson, validateUuid,
  notFoundOr500, pickFields, type RouteCtx,
} from '@/lib/api/http';

export const GET = withAuth(async (_req, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const bad = validateUuid(id);
  if (bad) return bad;

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return notFoundOr500(error, 'Session');
  return jsonOk(data);
});

export const PUT = withAuth(async (req, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const bad = validateUuid(id);
  if (bad) return bad;

  const [body, err] = await parseJson(req);
  if (err) return err;

  const [updates, hasFields] = pickFields(body, ['title', 'name', 'notes', 'session_date']);
  if (!hasFields) return jsonError('No fields to update');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('workout_sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return notFoundOr500(error, 'Session');
  return jsonOk(data);
});

export const DELETE = withAuth(async (_req, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const bad = validateUuid(id);
  if (bad) return bad;

  const supabase = supabaseServer();
  const { error } = await supabase
    .from('workout_sessions')
    .delete()
    .eq('id', id);

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk({ deleted: true });
});
