import { supabaseServer } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson, validateUuid, type RouteCtx } from '@/lib/api/http';

/** GET  /api/diet-days/[id]/meals → all meals for a day */
export const GET = withAuth(async (_req, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const bad = validateUuid(id);
  if (bad) return bad;

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('diet_meals')
    .select('*')
    .eq('day_id', id)
    .order('sort_order', { ascending: true });

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data);
});

/** POST /api/diet-days/[id]/meals → create a meal for this day */
export const POST = withAuth(async (req, ctx: RouteCtx) => {
  const { id } = await ctx.params;
  const bad = validateUuid(id);
  if (bad) return bad;

  const [body, err] = await parseJson<{
    meal_type?: string;
    title?: string;
    ingredients?: string;
    instructions?: string;
    sort_order?: number;
  }>(req);
  if (err) return err;

  if (!body.meal_type) return jsonError('meal_type is required');
  if (!body.title) return jsonError('title is required');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('diet_meals')
    .insert({
      day_id: id,
      meal_type: body.meal_type,
      title: body.title,
      ingredients: body.ingredients ?? null,
      instructions: body.instructions ?? null,
      sort_order: body.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data, 201);
});
