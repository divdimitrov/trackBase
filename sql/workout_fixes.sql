-- Workout schema fixes — run in Supabase SQL editor
-- 1. Make owner_id nullable (single-user app, no auth)
ALTER TABLE workout_sessions ALTER COLUMN owner_id DROP NOT NULL;

-- 2. Add series column to workout_sets (number of sets for this exercise)
ALTER TABLE workout_sets ADD COLUMN IF NOT EXISTS series int NOT NULL DEFAULT 1;

-- 3. Change reps from int to text so we can store ranges like "8-12"
ALTER TABLE workout_sets ALTER COLUMN reps TYPE text USING reps::text;

-- 4. Junction table: link media images to workout exercises
CREATE TABLE IF NOT EXISTS workout_set_media (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id      uuid NOT NULL REFERENCES workout_sets(id) ON DELETE CASCADE,
  media_id    uuid NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  sort_order  int NOT NULL DEFAULT 0,
  UNIQUE(set_id, media_id)
);
