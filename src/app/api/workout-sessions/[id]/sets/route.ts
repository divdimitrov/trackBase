import { supabaseServer } from '@/lib/supabase/server';
import { requireApiKey } from '@/lib/api/requireApiKey';
import { jsonOk, jsonError, parseJson } from '@/lib/api/http';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id: sessionId } = await ctx.params;
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('workout_sets')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) return jsonError(error.message, 500);
  return jsonOk(data);
}

export async function POST(req: Request, ctx: Ctx) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  const { id: sessionId } = await ctx.params;
  const [body, err] = await parseJson<Record<string, unknown>>(req);
  if (err) return err;

  const row: Record<string, unknown> = { session_id: sessionId };
  // Accept common possible column names
  if (body!.exercise !== undefined) row.exercise = body!.exercise;
  if (body!.name !== undefined) row.name = body!.name;
  if (body!.reps !== undefined) row.reps = body!.reps;
  if (body!.weight !== undefined) row.weight = body!.weight;
  if (body!.notes !== undefined) row.notes = body!.notes;

  if (!row.exercise && !row.name) {
    return jsonError('exercise or name is required');
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('workout_sets')
    .insert(row)
    .select()
    .single();

  if (error) return jsonError(error.message, 500, error.details);
  return jsonOk(data, 201);
}
