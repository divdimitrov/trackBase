import { supabaseServer } from '@/lib/supabase/server';
import { requireApiKey } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson } from '@/lib/api/http';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id } = await ctx.params;
  const [body, err] = await parseJson<{ name?: string; qty_text?: string }>(req);
  if (err) return err;

  const updates: Record<string, unknown> = {};
  if (body!.name !== undefined) updates.name = body!.name;
  if (body!.qty_text !== undefined) updates.qty_text = body!.qty_text;
  if (Object.keys(updates).length === 0) return jsonError('No fields to update');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('recipe_ingredients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return jsonError('Ingredient not found', 404);
    return jsonError(error.message, 500);
  }
  return jsonOk(data);
}

export async function DELETE(req: Request, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id } = await ctx.params;
  const supabase = supabaseServer();
  const { error } = await supabase
    .from('recipe_ingredients')
    .delete()
    .eq('id', id);

  if (error) return jsonError(error.message, 500);
  return jsonOk({ deleted: true });
}
