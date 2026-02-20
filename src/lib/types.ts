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
  owner_id?: string | null;
  title: string;
  notes: string | null;
  workout_date: string;       // DATE (NOT NULL in DB)
  created_at: string;
  updated_at?: string;
}

export interface WorkoutSet {
  id: string;
  session_id: string;
  exercise: string;            // NOT NULL in DB
  set_no: number;              // sort order / set number
  series: number;              // how many series (default 1)
  reps: string | null;         // text to support ranges like "8-12"
  weight: number | null;
  notes: string | null;
}

/** Junction row: media linked to a workout exercise */
export interface WorkoutSetMedia {
  id: string;
  set_id: string;
  media_id: string;
  sort_order: number;
  media?: MediaItem | null;
}

// --------------- Diet (daily meal plan) ------------------------------------

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export const mealTypeLabels: Record<MealType, { en: string; bg: string }> = {
  breakfast: { en: 'Breakfast', bg: 'Закуска' },
  lunch:     { en: 'Lunch',     bg: 'Обяд' },
  dinner:    { en: 'Dinner',    bg: 'Вечеря' },
  snack:     { en: 'Snack',     bg: 'Следвечерна закуска' },
};

export interface DietDay {
  id: string;
  label: string;           // e.g. "Понеделник" / "Monday"
  sort_order: number;
  created_at: string;
}

export interface DietMeal {
  id: string;
  day_id: string;
  meal_type: MealType;
  title: string;
  ingredients: string | null;   // free-text list
  instructions: string | null;  // cooking steps
  sort_order: number;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Convenience helpers
// ---------------------------------------------------------------------------

/** Display name for a workout session. */
export function sessionLabel(s: WorkoutSession): string {
  return s.title || s.workout_date || 'Untitled session';
}
