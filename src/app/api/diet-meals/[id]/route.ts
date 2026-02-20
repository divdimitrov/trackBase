import { supabaseServer } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api/requireApiKey';
import {
  jsonOk,
  jsonError,
  parseJson,
  validateUuid,
  notFoundOr500,
  pickFields,
  type RouteCtx,
} from '@/lib/api/http';

export const PUT = withAuth(async (req, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const bad = validateUuid(id);
  if (bad) return bad;

  const [body, err] = await parseJson<{
    meal_type?: string;
    title?: string;
    ingredients?: string | null;
    instructions?: string | null;
    sort_order?: number;
  }>(req);
  if (err) return err;

  const [fields, hasFields] = pickFields(body as Record<string, unknown>, [
    'meal_type',
    'title',
    'ingredients',
    'instructions',
    'sort_order',
  ]);
  if (!hasFields) return jsonError('No fields to update');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('diet_meals')
    .update(fields)
    .eq('id', id)
    .select()
    .single();

  if (error) return notFoundOr500(error, 'Diet meal');
  return jsonOk(data);
});

export const DELETE = withAuth(async (_req, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const bad = validateUuid(id);
  if (bad) return bad;

  const supabase = supabaseServer();
  const { error } = await supabase.from('diet_meals').delete().eq('id', id);
  if (error) return notFoundOr500(error, 'Diet meal');
  return jsonOk({ deleted: true });
});
