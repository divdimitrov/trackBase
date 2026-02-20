import { supabaseServer } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson, validateUuid, type RouteCtx } from '@/lib/api/http';

export const GET = withAuth(async (_req, ctx: RouteCtx) => {
  const { id: recipeId } = await ctx.params;
  const bad = validateUuid(recipeId);
  if (bad) return bad;

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('recipe_media')
    .select('id, media_id, media(*)')
    .eq('recipe_id', recipeId);

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data);
});

export const POST = withAuth(async (req, ctx: RouteCtx) => {
  const { id: recipeId } = await ctx.params;
  const bad = validateUuid(recipeId);
  if (bad) return bad;

  const [body, err] = await parseJson<{ media_id?: string }>(req);
  if (err) return err;
  if (!body.media_id) return jsonError('media_id is required');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('recipe_media')
    .insert({ recipe_id: recipeId, media_id: body.media_id })
    .select()
    .single();

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data, 201);
});
