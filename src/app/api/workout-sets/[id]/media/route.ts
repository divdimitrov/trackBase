import { supabaseServer } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson, validateUuid, type RouteCtx } from '@/lib/api/http';

/** GET  /api/workout-sets/:id/media  — list linked media for an exercise */
export const GET = withAuth(async (_req, ctx: RouteCtx) => {
  const { id: setId } = await ctx.params;
  const bad = validateUuid(setId);
  if (bad) return bad;

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('workout_set_media')
    .select('id, set_id, media_id, sort_order, media:media_id(*)')
    .eq('set_id', setId)
    .order('sort_order');

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data);
});

/** POST /api/workout-sets/:id/media  — link a media item to an exercise */
export const POST = withAuth(async (req, ctx: RouteCtx) => {
  const { id: setId } = await ctx.params;
  const bad = validateUuid(setId);
  if (bad) return bad;

  const [body, err] = await parseJson<{ media_id?: string }>(req);
  if (err) return err;
  if (!body.media_id) return jsonError('media_id is required');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('workout_set_media')
    .insert({ set_id: setId, media_id: body.media_id })
    .select()
    .single();

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data, 201);
});
