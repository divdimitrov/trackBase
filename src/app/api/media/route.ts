import { supabaseServer } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson, parsePagination } from '@/lib/api/http';

export const GET = withAuth(async (req) => {
  const { limit, offset } = parsePagination(req);
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data);
});

export const POST = withAuth(async (req) => {
  const [body, err] = await parseJson<{
    url?: string;
    type?: string;
    title?: string;
    notes?: string;
  }>(req);
  if (err) return err;
  if (!body.url) return jsonError('url is required');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('media')
    .insert({
      url: body.url,
      type: body.type ?? null,
      title: body.title ?? null,
      notes: body.notes ?? null,
    })
    .select()
    .single();

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data, 201);
});
