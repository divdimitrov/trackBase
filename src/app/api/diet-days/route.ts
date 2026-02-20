import { supabaseServer } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson, parsePagination } from '@/lib/api/http';

export const GET = withAuth(async (req) => {
  const { limit, offset } = parsePagination(req);
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('diet_days')
    .select('*')
    .order('sort_order', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data);
});

export const POST = withAuth(async (req) => {
  const [body, err] = await parseJson<{ label?: string; sort_order?: number }>(req);
  if (err) return err;

  if (!body.label) return jsonError('label is required');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('diet_days')
    .insert({ label: body.label, sort_order: body.sort_order ?? 0 })
    .select()
    .single();

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data, 201);
});
