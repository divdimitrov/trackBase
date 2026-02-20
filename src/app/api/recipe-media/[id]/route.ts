import { supabaseServer } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, validateUuid, type RouteCtx } from '@/lib/api/http';

export const DELETE = withAuth(async (_req, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const bad = validateUuid(id);
  if (bad) return bad;

  const supabase = supabaseServer();
  const { error } = await supabase
    .from('recipe_media')
    .delete()
    .eq('id', id);

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk({ deleted: true });
});
