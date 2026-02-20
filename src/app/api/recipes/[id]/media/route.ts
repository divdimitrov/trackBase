import { supabaseServer } from '@/lib/supabase/server';
import { requireApiKey } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson } from '@/lib/api/http';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id: recipeId } = await ctx.params;
  const supabase = supabaseServer();

  // Join through recipe_media to return the media rows
  const { data, error } = await supabase
    .from('recipe_media')
    .select('id, media_id, media(*)')
    .eq('recipe_id', recipeId);

  if (error) return jsonError(error.message, 500);
  return jsonOk(data);
}

export async function POST(req: Request, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id: recipeId } = await ctx.params;
  const [body, err] = await parseJson<{ media_id?: string }>(req);
  if (err) return err;
  if (!body!.media_id) return jsonError('media_id is required');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('recipe_media')
    .insert({ recipe_id: recipeId, media_id: body!.media_id })
    .select()
    .single();

  if (error) return jsonError(error.message, 500);
  return jsonOk(data, 201);
}
