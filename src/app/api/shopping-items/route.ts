import { supabaseServer } from '@/lib/supabase/server';
import { requireApiKey } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson } from '@/lib/api/http';

export async function GET(req: Request) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('shopping_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return jsonError(error.message, 500);
  return jsonOk(data);
}

export async function POST(req: Request) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const [body, err] = await parseJson<{
    name?: string;
    qty_text?: string;
    is_checked?: boolean;
  }>(req);
  if (err) return err;
  if (!body!.name) return jsonError('name is required');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('shopping_items')
    .insert({
      name: body!.name,
      qty_text: body!.qty_text ?? null,
      is_checked: body!.is_checked ?? false,
    })
    .select()
    .single();

  if (error) return jsonError(error.message, 500);
  return jsonOk(data, 201);
}
