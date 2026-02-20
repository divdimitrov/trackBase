-- Diet tables — run in Supabase SQL editor
-- Creates diet_days and diet_meals for the daily meal plan feature

CREATE TABLE IF NOT EXISTS diet_days (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  label       text NOT NULL,              -- e.g. "Monday" / "Понеделник"
  sort_order  int  NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS diet_meals (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  day_id       uuid NOT NULL REFERENCES diet_days(id) ON DELETE CASCADE,
  meal_type    text NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  title        text NOT NULL,
  ingredients  text,       -- free-text ingredient list
  instructions text,       -- cooking steps
  sort_order   int  NOT NULL DEFAULT 0,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diet_meals_day ON diet_meals(day_id);
