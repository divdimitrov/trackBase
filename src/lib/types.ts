// ---------------------------------------------------------------------------
// Database-aligned types  (match Supabase table columns)
// ---------------------------------------------------------------------------

export interface Recipe {
  id: string;
  title: string;
  notes: string | null;
  created_at: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  name: string;
  qty_text: string | null;
  created_at: string;
}

/** Junction row returned by GET /api/recipes/[id]/media (with nested media). */
export interface RecipeMedia {
  id: string;
  recipe_id: string;
  media_id: string;
  media?: MediaItem | null;
}

export interface MediaItem {
  id: string;
  url: string;
  type: string | null;   // 'video' | 'image' | free text
  title: string | null;
  notes: string | null;
  created_at: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  qty_text: string | null;
  is_checked: boolean;
  created_at: string;
}

export interface WorkoutSession {
  id: string;
  title?: string | null;
  name?: string | null;
  notes: string | null;
  session_date?: string | null;
  created_at: string;
}

export interface WorkoutSet {
  id: string;
  session_id: string;
  exercise?: string | null;
  name?: string | null;
  reps: number | null;
  weight: number | null;
  notes: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Convenience helpers
// ---------------------------------------------------------------------------

/** Display name for a workout session (title || name || date || "Untitled"). */
export function sessionLabel(s: WorkoutSession): string {
  return s.title || s.name || s.session_date || 'Untitled session';
}

/** Display name for a workout set exercise (exercise || name || "—"). */
export function setExercise(s: WorkoutSet): string {
  return s.exercise || s.name || '—';
}
