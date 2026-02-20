import { supabaseServer } from '@/lib/supabase/server';
import { requireApiKey } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson } from '@/lib/api/http';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id } = await ctx.params;
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return jsonError('Media not found', 404);
    return jsonError(error.message, 500);
  }
  return jsonOk(data);
}

export async function PUT(req: Request, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id } = await ctx.params;
  const [body, err] = await parseJson<{
    url?: string;
    type?: string;
    title?: string;
    notes?: string;
  }>(req);
  if (err) return err;

  const updates: Record<string, unknown> = {};
  if (body!.url !== undefined) updates.url = body!.url;
  if (body!.type !== undefined) updates.type = body!.type;
  if (body!.title !== undefined) updates.title = body!.title;
  if (body!.notes !== undefined) updates.notes = body!.notes;
  if (Object.keys(updates).length === 0) return jsonError('No fields to update');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('media')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return jsonError('Media not found', 404);
    return jsonError(error.message, 500);
  }
  return jsonOk(data);
}

export async function DELETE(req: Request, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id } = await ctx.params;
  const supabase = supabaseServer();
  const { error } = await supabase.from('media').delete().eq('id', id);

  if (error) return jsonError(error.message, 500);
  return jsonOk({ deleted: true });
}
