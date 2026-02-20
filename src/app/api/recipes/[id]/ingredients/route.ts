import { supabaseServer } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson, validateUuid, type RouteCtx } from '@/lib/api/http';

export const GET = withAuth(async (_req, ctx: RouteCtx) => {
  const { id: recipeId } = await ctx.params;
  const bad = validateUuid(recipeId);
  if (bad) return bad;

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('recipe_ingredients')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: true });

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data);
});

export const POST = withAuth(async (req, ctx: RouteCtx) => {
  const { id: recipeId } = await ctx.params;
  const bad = validateUuid(recipeId);
  if (bad) return bad;

  const [body, err] = await parseJson<{ name?: string; qty_text?: string }>(req);
  if (err) return err;
  if (!body.name) return jsonError('name is required');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('recipe_ingredients')
    .insert({
      recipe_id: recipeId,
      name: body.name,
      qty_text: body.qty_text ?? null,
    })
    .select()
    .single();

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data, 201);
});
