import { supabaseServer } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson, parsePagination } from '@/lib/api/http';

export const GET = withAuth(async (req) => {
  const { limit, offset } = parsePagination(req);
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('shopping_items')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data);
});

export const POST = withAuth(async (req) => {
  const [body, err] = await parseJson<{
    name?: string;
    qty_text?: string;
    is_checked?: boolean;
  }>(req);
  if (err) return err;
  if (!body.name) return jsonError('name is required');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('shopping_items')
    .insert({
      name: body.name,
      qty_text: body.qty_text ?? null,
      is_checked: body.is_checked ?? false,
    })
    .select()
    .single();

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data, 201);
});
