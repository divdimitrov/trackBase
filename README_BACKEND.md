# TrackBase — Backend API

## Required Environment Variables

| Variable | Where | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` + Vercel | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` + Vercel | Supabase service-role key (server-only) |
| `APP_API_KEY` | `.env.local` + Vercel | Secret key for `x-api-key` header guard. If unset, all requests are allowed (dev convenience). |

## Authentication

Every API endpoint requires the `x-api-key` header:

```
x-api-key: <your APP_API_KEY value>
```

Requests without a valid key receive `401 Unauthorized`.

## Example curl (local)

```bash
# List recipes
curl http://localhost:3000/api/recipes -H "x-api-key: YOUR_KEY"

# Create a recipe
curl -X POST http://localhost:3000/api/recipes \
  -H "x-api-key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title": "Pancakes", "notes": "Weekend breakfast"}'

# Update a recipe
curl -X PUT http://localhost:3000/api/recipes/<id> \
  -H "x-api-key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Updated notes"}'

# Delete a recipe
curl -X DELETE http://localhost:3000/api/recipes/<id> \
  -H "x-api-key: YOUR_KEY"
```

## API Routes

### Recipes
| Method | Route | Description |
|---|---|---|
| GET | `/api/recipes` | List all recipes (ordered by created_at desc) |
| POST | `/api/recipes` | Create recipe `{ title, notes? }` |
| GET | `/api/recipes/:id` | Get recipe by id |
| PUT | `/api/recipes/:id` | Update recipe `{ title?, notes? }` |
| DELETE | `/api/recipes/:id` | Delete recipe |

### Recipe Ingredients
| Method | Route | Description |
|---|---|---|
| GET | `/api/recipes/:id/ingredients` | List ingredients for a recipe |
| POST | `/api/recipes/:id/ingredients` | Add ingredient `{ name, qty_text? }` |
| PUT | `/api/ingredients/:id` | Update ingredient `{ name?, qty_text? }` |
| DELETE | `/api/ingredients/:id` | Delete ingredient |

### Shopping Items
| Method | Route | Description |
|---|---|---|
| GET | `/api/shopping-items` | List all items (ordered by created_at desc) |
| POST | `/api/shopping-items` | Create item `{ name, qty_text?, is_checked? }` |
| PUT | `/api/shopping-items/:id` | Update item `{ name?, qty_text?, is_checked? }` |
| DELETE | `/api/shopping-items/:id` | Delete item |

### Workout Sessions
| Method | Route | Description |
|---|---|---|
| GET | `/api/workout-sessions` | List sessions (ordered by session_date or created_at desc) |
| POST | `/api/workout-sessions` | Create session `{ title/name, notes?, session_date? }` |
| GET | `/api/workout-sessions/:id` | Get session by id |
| PUT | `/api/workout-sessions/:id` | Update session `{ title?, name?, notes?, session_date? }` |
| DELETE | `/api/workout-sessions/:id` | Delete session |

### Workout Sets
| Method | Route | Description |
|---|---|---|
| GET | `/api/workout-sessions/:id/sets` | List sets for a session |
| POST | `/api/workout-sessions/:id/sets` | Create set `{ exercise/name, reps?, weight?, notes? }` |
| PUT | `/api/workout-sets/:id` | Update set `{ exercise?, name?, reps?, weight?, notes? }` |
| DELETE | `/api/workout-sets/:id` | Delete set |

### Media
| Method | Route | Description |
|---|---|---|
| GET | `/api/media` | List all media (ordered by created_at desc) |
| POST | `/api/media` | Create media `{ url, type?, title?, notes? }` |
| GET | `/api/media/:id` | Get media by id |
| PUT | `/api/media/:id` | Update media `{ url?, type?, title?, notes? }` |
| DELETE | `/api/media/:id` | Delete media |

### Recipe ↔ Media Linking
| Method | Route | Description |
|---|---|---|
| GET | `/api/recipes/:id/media` | List linked media for a recipe (via recipe_media join) |
| POST | `/api/recipes/:id/media` | Link media to recipe `{ media_id }` |
| DELETE | `/api/recipe-media/:id` | Unlink media from recipe by recipe_media row id |

## Response Format

**Success:** Returns the data directly (single object or array).

**Error:**
```json
{
  "error": "Error message",
  "details": "optional additional info"
}
```

**HTTP Status Codes:**
- `200` — Success
- `201` — Created
- `400` — Bad request / validation error
- `401` — Unauthorized (missing/invalid x-api-key)
- `404` — Not found
- `500` — Server / database error
