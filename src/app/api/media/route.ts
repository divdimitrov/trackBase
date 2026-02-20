import { supabaseServer } from '@/lib/supabase/server';
import { requireApiKey } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson } from '@/lib/api/http';

export async function GET(req: Request) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return jsonError(error.message, 500);
  return jsonOk(data);
}

export async function POST(req: Request) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const [body, err] = await parseJson<{
    url?: string;
    type?: string;
    title?: string;
    notes?: string;
  }>(req);
  if (err) return err;
  if (!body!.url) return jsonError('url is required');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('media')
    .insert({
      url: body!.url,
      type: body!.type ?? null,
      title: body!.title ?? null,
      notes: body!.notes ?? null,
    })
    .select()
    .single();

  if (error) return jsonError(error.message, 500);
  return jsonOk(data, 201);
}
