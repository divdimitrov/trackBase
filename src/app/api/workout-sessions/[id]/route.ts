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
    .from('workout_sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return jsonError('Session not found', 404);
    return jsonError(error.message, 500);
  }
  return jsonOk(data);
}

export async function PUT(req: Request, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id } = await ctx.params;
  const [body, err] = await parseJson<Record<string, unknown>>(req);
  if (err) return err;

  const allowed = ['title', 'name', 'notes', 'session_date'];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body![key] !== undefined) updates[key] = body![key];
  }
  if (Object.keys(updates).length === 0) return jsonError('No fields to update');

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('workout_sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return jsonError('Session not found', 404);
    return jsonError(error.message, 500);
  }
  return jsonOk(data);
}

export async function DELETE(req: Request, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id } = await ctx.params;
  const supabase = supabaseServer();
  const { error } = await supabase
    .from('workout_sessions')
    .delete()
    .eq('id', id);

  if (error) return jsonError(error.message, 500);
  return jsonOk({ deleted: true });
}
