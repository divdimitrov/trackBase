'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import type { WorkoutSession, WorkoutSet, WorkoutSetMedia } from '@/lib/types';

type SetWithMedia = WorkoutSet & { media: WorkoutSetMedia[] };
type SessionWithSets = WorkoutSession & { sets: SetWithMedia[] };

/* ── Badge colours for exercise numbers ─────────────────────────────────── */
const badgeColors = [
  'bg-amber-400 text-amber-900',
  'bg-blue-400 text-blue-900',
  'bg-emerald-400 text-emerald-900',
  'bg-rose-400 text-rose-900',
  'bg-violet-400 text-violet-900',
  'bg-cyan-400 text-cyan-900',
];

/* ── Single exercise card ───────────────────────────────────────────────── */
function ExerciseCard({ set, index }: { set: SetWithMedia; index: number }) {
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
        <h4 className="text-base font-semibold text-gray-900">{set.exercise}</h4>
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

      {/* Series × reps + weight */}
      <p className="text-sm text-gray-700">
        {(set.series ?? 1) > 0 && set.reps
          ? <>{set.series} × {set.reps}</>
          : set.reps
            ? <>{set.reps}</>
            : null}
        {set.weight != null && (
          <span className="text-gray-500 ml-1">@ {set.weight} kg</span>
        )}
      </p>

      {/* Notes / instructions */}
      {set.notes && (
        <p className="text-sm text-gray-500 leading-relaxed">{set.notes}</p>
      )}
    </div>
  );
}

/* ── Session / day card ─────────────────────────────────────────────────── */
function SessionCard({ session, locale }: { session: SessionWithSets; locale: string }) {
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
            <ExerciseCard key={set.id} set={set} index={i} />
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

  useEffect(() => {
    (async () => {
      try {
        const apiKey = typeof window !== 'undefined'
          ? localStorage.getItem('trackbase_api_key') ?? ''
          : '';
        const headers: HeadersInit = apiKey ? { 'x-api-key': apiKey } : {};

        // 1. Fetch all sessions
        const sessRes = await fetch('/api/workout-sessions?limit=100', { headers });
        if (!sessRes.ok) throw new Error('sessions');
        const sessData: WorkoutSession[] = await sessRes.json();

        // 2. Fetch exercises + media per session
        const withSets: SessionWithSets[] = await Promise.all(
          sessData.map(async (s) => {
            const setsRes = await fetch(`/api/workout-sessions/${s.id}/sets`, { headers });
            const setsData: WorkoutSet[] = setsRes.ok ? await setsRes.json() : [];

            // Fetch media per exercise in parallel
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
    })();
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
            <SessionCard key={session.id} session={session} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
