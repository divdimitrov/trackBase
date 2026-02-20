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

export const GET = withAuth(async (_req, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const bad = validateUuid(id);
  if (bad) return bad;

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('diet_days')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return notFoundOr500(error, 'Diet day');
  return jsonOk(data);
});

export const PUT = withAuth(async (req, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const bad = validateUuid(id);
  if (bad) return bad;

  const [body, err] = await parseJson<{ label?: string; sort_order?: number }>(req);
  if (err) return err;

  const [fields, hasFields] = pickFields(body as Record<string, unknown>, ['label', 'sort_order']);
  if (!hasFields) return jsonError('No fields to update');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('diet_days')
    .update(fields)
    .eq('id', id)
    .select()
    .single();

  if (error) return notFoundOr500(error, 'Diet day');
  return jsonOk(data);
});

export const DELETE = withAuth(async (_req, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const bad = validateUuid(id);
  if (bad) return bad;

  const supabase = supabaseServer();
  const { error } = await supabase.from('diet_days').delete().eq('id', id);
  if (error) return notFoundOr500(error, 'Diet day');
  return jsonOk({ deleted: true });
});
