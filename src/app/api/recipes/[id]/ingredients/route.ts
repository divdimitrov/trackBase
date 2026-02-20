import { supabaseServer } from '@/lib/supabase/server';
import { requireApiKey } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson } from '@/lib/api/http';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id: recipeId } = await ctx.params;
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('recipe_ingredients')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: true });

  if (error) return jsonError(error.message, 500);
  return jsonOk(data);
}

export async function POST(req: Request, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id: recipeId } = await ctx.params;
  const [body, err] = await parseJson<{ name?: string; qty_text?: string }>(req);
  if (err) return err;
  if (!body!.name) return jsonError('name is required');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('recipe_ingredients')
    .insert({
      recipe_id: recipeId,
      name: body!.name,
      qty_text: body!.qty_text ?? null,
    })
    .select()
    .single();

  if (error) return jsonError(error.message, 500);
  return jsonOk(data, 201);
}
