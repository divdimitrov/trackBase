import { supabaseServer } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api/requireApiKey';
import {
  jsonOk, jsonError, parseJson, validateUuid,
  notFoundOr500, pickFields, type RouteCtx,
} from '@/lib/api/http';

export const PUT = withAuth(async (req, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const bad = validateUuid(id);
  if (bad) return bad;

  const [body, err] = await parseJson(req);
  if (err) return err;

  const [updates, hasFields] = pickFields(body, ['name', 'qty_text', 'is_checked']);
  if (!hasFields) return jsonError('No fields to update');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('shopping_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return notFoundOr500(error, 'Shopping item');
  return jsonOk(data);
});

export const DELETE = withAuth(async (_req, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const bad = validateUuid(id);
  if (bad) return bad;

  const supabase = supabaseServer();
  const { error } = await supabase
    .from('shopping_items')
    .delete()
    .eq('id', id);

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk({ deleted: true });
});
