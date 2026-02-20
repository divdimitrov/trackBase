'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import type { WorkoutSession, WorkoutSet, WorkoutSetMedia } from '@/lib/types';

type SetWithMedia = WorkoutSet & { media: WorkoutSetMedia[] };
type SessionWithSets = WorkoutSession & { sets: SetWithMedia[] };

function getApiKey() {
  return typeof window !== 'undefined' ? localStorage.getItem('trackbase_api_key') ?? '' : '';
}

function getHeaders(): Record<string, string> {
  const k = getApiKey();
  const h: Record<string, string> = { 'content-type': 'application/json' };
  if (k) h['x-api-key'] = k;
  return h;
}

/* ── Badge colours for exercise numbers ─────────────────────────────────── */
const badgeColors = [
  'bg-amber-400 text-amber-900',
  'bg-blue-400 text-blue-900',
  'bg-emerald-400 text-emerald-900',
  'bg-rose-400 text-rose-900',
  'bg-violet-400 text-violet-900',
  'bg-cyan-400 text-cyan-900',
];

/* ── Inline editable field ──────────────────────────────────────────────── */
function InlineField({
  value,
  onSave,
  label,
  suffix,
  className = '',
  inputType = 'text',
  placeholder,
}: {
  value: string;
  onSave: (v: string) => void;
  label: string;
  suffix?: string;
  className?: string;
  inputType?: string;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = () => {
    setEditing(false);
    if (draft !== value) onSave(draft);
  };

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={inputType}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
        placeholder={placeholder}
        className={`bg-white border border-blue-300 rounded-lg px-2 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 w-full ${className}`}
        aria-label={label}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={`text-left rounded-lg px-2 py-1 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-text border border-transparent hover:border-blue-200 ${className}`}
      title={`Click to edit ${label}`}
    >
      {value || <span className="text-gray-300">{placeholder ?? '—'}</span>}
      {suffix && value && <span className="text-gray-400 ml-0.5">{suffix}</span>}
    </button>
  );
}

/* ── Save indicator ─────────────────────────────────────────────────────── */
function SaveIndicator({ saving }: { saving: boolean }) {
  if (!saving) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-blue-500 animate-pulse">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> saving…
    </span>
  );
}

/* ── Single exercise card (editable) ────────────────────────────────────── */
function ExerciseCard({
  set,
  index,
  onUpdate,
  saving,
}: {
  set: SetWithMedia;
  index: number;
  onUpdate: (setId: string, field: string, value: string) => void;
  saving: boolean;
}) {
  const badge = badgeColors[index % badgeColors.length];
  const images = set.media
    .map((m) => m.media)
    .filter((m): m is NonNullable<typeof m> => !!m && m.type === 'image' && !!m.url);

  return (
    <div className="space-y-3">
      {/* Number + name */}
      <div className="flex items-center gap-2.5">
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-bold ${badge}`}>
          {index + 1}
        </span>
        <h4 className="text-base font-semibold text-gray-900 flex-1">{set.exercise}</h4>
        <SaveIndicator saving={saving} />
      </div>

      {/* Reference images */}
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((m) => (
            <img
              key={m.id}
              src={m.url}
              alt={m.title || set.exercise}
              className="w-44 h-32 sm:w-52 sm:h-36 rounded-xl object-cover border border-gray-200/60 flex-shrink-0"
            />
          ))}
        </div>
      )}

      {/* Editable: series × reps @ weight */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <InlineField
          value={String(set.series ?? 1)}
          onSave={(v) => onUpdate(set.id, 'series', v)}
          label="Series"
          inputType="number"
          className="w-12 text-center"
          placeholder="0"
        />
        <span className="text-gray-400 text-sm font-medium">×</span>
        <InlineField
          value={set.reps ?? ''}
          onSave={(v) => onUpdate(set.id, 'reps', v)}
          label="Reps"
          className="w-16 text-center"
          placeholder="reps"
        />
        <span className="text-gray-300 text-sm mx-1">@</span>
        <InlineField
          value={set.weight != null ? String(set.weight) : ''}
          onSave={(v) => onUpdate(set.id, 'weight', v)}
          label="Weight"
          inputType="number"
          className="w-16 text-center"
          placeholder="kg"
          suffix="kg"
        />
      </div>

      {/* Notes / instructions */}
      {set.notes && (
        <p className="text-sm text-gray-500 leading-relaxed">{set.notes}</p>
      )}
    </div>
  );
}

/* ── Session / day card ─────────────────────────────────────────────────── */
function SessionCard({
  session,
  locale,
  onUpdate,
  savingIds,
}: {
  session: SessionWithSets;
  locale: string;
  onUpdate: (setId: string, field: string, value: string) => void;
  savingIds: Set<string>;
}) {
  const formattedDate = session.workout_date
    ? new Date(session.workout_date + 'T00:00:00').toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : '';

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
        <span className="inline-block w-3 h-3 rounded-full bg-emerald-400 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {session.title || formattedDate}
          </h3>
          {session.title && formattedDate && (
            <p className="text-xs text-gray-400 mt-0.5">{formattedDate}</p>
          )}
        </div>
      </div>

      {/* Session description */}
      {session.notes && (
        <div className="px-5 pt-3">
          <p className="text-sm text-gray-500">{session.notes}</p>
        </div>
      )}

      {/* Exercises */}
      <div className="p-5 space-y-6">
        {session.sets.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-4">—</p>
        ) : (
          session.sets.map((set, i) => (
            <ExerciseCard
              key={set.id}
              set={set}
              index={i}
              onUpdate={onUpdate}
              saving={savingIds.has(set.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export default function WorkoutsPage() {
  const { t, locale } = useLanguage();
  const [sessions, setSessions] = useState<SessionWithSets[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    try {
      const headers = getHeaders();
      const sessRes = await fetch('/api/workout-sessions?limit=100', { headers });
      if (!sessRes.ok) throw new Error('sessions');
      const sessData: WorkoutSession[] = await sessRes.json();

      const withSets: SessionWithSets[] = await Promise.all(
        sessData.map(async (s) => {
          const setsRes = await fetch(`/api/workout-sessions/${s.id}/sets`, { headers });
          const setsData: WorkoutSet[] = setsRes.ok ? await setsRes.json() : [];
          const setsWithMedia: SetWithMedia[] = await Promise.all(
            setsData.map(async (set) => {
              const mRes = await fetch(`/api/workout-sets/${set.id}/media`, { headers });
              const media: WorkoutSetMedia[] = mRes.ok ? await mRes.json() : [];
              return { ...set, media };
            }),
          );
          return { ...s, sets: setsWithMedia };
        }),
      );

      setSessions(withSets);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /** Optimistic inline update — saves to API and updates local state. */
  const handleUpdate = useCallback(async (setId: string, field: string, raw: string) => {
    // Build the body
    const body: Record<string, unknown> = {};
    if (field === 'series') body.series = raw ? Number(raw) : 1;
    else if (field === 'weight') body.weight = raw ? Number(raw) : null;
    else if (field === 'reps') body.reps = raw.trim() || null;
    else return;

    // Optimistic local update
    setSessions((prev) =>
      prev.map((s) => ({
        ...s,
        sets: s.sets.map((ex) =>
          ex.id === setId ? { ...ex, [field]: body[field] } : ex,
        ),
      })),
    );

    // Save to API
    setSavingIds((prev) => new Set(prev).add(setId));
    try {
      await fetch(`/api/workout-sets/${setId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
    } catch { /* silently fail — could add toast */ }
    setSavingIds((prev) => {
      const next = new Set(prev);
      next.delete(setId);
      return next;
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{t.workouts.title}</h1>
        <p className="text-sm text-gray-500">{t.workouts.subtitle}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        </div>
      ) : error ? (
        <p className="text-sm text-red-500 text-center py-8">Failed to load workouts</p>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <p className="text-4xl">🏋️</p>
          <p className="text-sm text-gray-500">{t.workouts.noSessions}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              locale={locale}
              onUpdate={handleUpdate}
              savingIds={savingIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}
