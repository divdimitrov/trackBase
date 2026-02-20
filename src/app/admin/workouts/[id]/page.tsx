'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/components/LanguageProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type { WorkoutSession, WorkoutSet, WorkoutSetMedia, MediaItem } from '@/lib/types';
import { sessionLabel } from '@/lib/types';
import DataTable, { type Column } from '@/components/admin/DataTable';
import FormModal, { TextField } from '@/components/admin/FormModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import StatusMessage from '@/components/admin/StatusMessage';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

export default function WorkoutDetailAdmin() {
  const { id } = useParams<{ id: string }>();
  const { apiKey } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Exercise modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<WorkoutSet | null>(null);
  const [exercise, setExerciseVal] = useState('');
  const [series, setSeries] = useState('1');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete exercise
  const [deletingSet, setDeletingSet] = useState<WorkoutSet | null>(null);

  // Media per exercise  { [setId]: WorkoutSetMedia[] }
  const [mediaMap, setMediaMap] = useState<Record<string, WorkoutSetMedia[]>>({});
  const [allMedia, setAllMedia] = useState<MediaItem[]>([]);

  // Link media modal
  const [linkTarget, setLinkTarget] = useState<WorkoutSet | null>(null);
  const [unlinkingMedia, setUnlinkingMedia] = useState<WorkoutSetMedia | null>(null);

  const load = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    const [sRes, setRes, amRes] = await Promise.all([
      apiGet<WorkoutSession>(`/api/workout-sessions/${id}`, apiKey),
      apiGet<WorkoutSet[]>(`/api/workout-sessions/${id}/sets`, apiKey),
      apiGet<MediaItem[]>('/api/media?limit=500', apiKey),
    ]);
    if (sRes.data) setSession(sRes.data);
    const setsData = setRes.data ?? [];
    setSets(setsData);
    setAllMedia(amRes.data ?? []);

    // Fetch media for each exercise in parallel
    const mMap: Record<string, WorkoutSetMedia[]> = {};
    await Promise.all(
      setsData.map(async (s) => {
        const mRes = await apiGet<WorkoutSetMedia[]>(`/api/workout-sets/${s.id}/media`, apiKey);
        mMap[s.id] = mRes.data ?? [];
      }),
    );
    setMediaMap(mMap);
    setLoading(false);
  }, [apiKey, id]);

  useEffect(() => { load(); }, [load]);

  // ---------------------------------------------------------------------------
  // Exercise CRUD
  // ---------------------------------------------------------------------------
  const openCreateSet = () => {
    setEditingSet(null);
    setExerciseVal('');
    setSeries('1');
    setReps('');
    setWeight('');
    setNotes('');
    setModalOpen(true);
  };

  const openEditSet = (s: WorkoutSet) => {
    setEditingSet(s);
    setExerciseVal(s.exercise ?? '');
    setSeries(s.series?.toString() ?? '1');
    setReps(s.reps ?? '');
    setWeight(s.weight?.toString() ?? '');
    setNotes(s.notes ?? '');
    setModalOpen(true);
  };

  const handleSaveSet = async () => {
    if (!apiKey || !exercise.trim()) return;
    setSaving(true);
    const body: Record<string, unknown> = {
      exercise: exercise.trim(),
      series: series ? Number(series) : 1,
      reps: reps.trim() || null,
      weight: weight ? Number(weight) : null,
      notes: notes.trim() || null,
    };

    if (editingSet) {
      const { error } = await apiPut(`/api/workout-sets/${editingSet.id}`, apiKey, body);
      if (error) setStatus({ msg: error, type: 'error' });
      else setStatus({ msg: t.admin.crud.updated, type: 'success' });
    } else {
      const { error } = await apiPost(`/api/workout-sessions/${id}/sets`, apiKey, body);
      if (error) setStatus({ msg: error, type: 'error' });
      else setStatus({ msg: t.admin.crud.created, type: 'success' });
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDeleteSet = async () => {
    if (!apiKey || !deletingSet) return;
    const { error } = await apiDelete(`/api/workout-sets/${deletingSet.id}`, apiKey);
    if (error) setStatus({ msg: error, type: 'error' });
    else setStatus({ msg: t.admin.crud.deleted, type: 'success' });
    setDeletingSet(null);
    load();
  };

  // ---------------------------------------------------------------------------
  // Media linking (per exercise — same pattern as recipe media)
  // ---------------------------------------------------------------------------
  const linkMedia = async (mediaId: string) => {
    if (!apiKey || !linkTarget) return;
    const { error } = await apiPost(`/api/workout-sets/${linkTarget.id}/media`, apiKey, { media_id: mediaId });
    if (error) setStatus({ msg: error, type: 'error' });
    else setStatus({ msg: t.admin.crud.created, type: 'success' });
    setLinkTarget(null);
    load();
  };

  const unlinkMedia = async () => {
    if (!apiKey || !unlinkingMedia) return;
    const { error } = await apiDelete(`/api/workout-set-media/${unlinkingMedia.id}`, apiKey);
    if (error) setStatus({ msg: error, type: 'error' });
    else setStatus({ msg: t.admin.crud.deleted, type: 'success' });
    setUnlinkingMedia(null);
    load();
  };

  // Available media for linking (exclude already linked for target exercise)
  const linkedIdsForTarget = new Set((linkTarget ? mediaMap[linkTarget.id] ?? [] : []).map((m) => m.media_id));
  const availableMedia = allMedia.filter((m) => !linkedIdsForTarget.has(m.id));

  const columns: Column<WorkoutSet>[] = [
    { key: 'set_no', header: '#', render: (s) => s.set_no },
    { key: 'exercise', header: t.admin.workouts.exercise, render: (s) => s.exercise },
    { key: 'series', header: t.admin.workouts.series, render: (s) => s.series ?? 1 },
    { key: 'reps', header: t.admin.workouts.reps, render: (s) => s.reps ?? '—' },
    { key: 'weight', header: t.admin.workouts.weight, render: (s) => s.weight ? `${s.weight} kg` : '—' },
    {
      key: 'notes',
      header: t.admin.workouts.setNotes,
      render: (s) => <span className="text-gray-500 truncate max-w-[120px] inline-block">{s.notes || '—'}</span>,
      className: 'hidden sm:table-cell',
    },
  ];

  if (loading) return <LoadingSpinner />;
  if (!session) return <p className="text-sm text-gray-500">{t.admin.crud.errorLoad}</p>;

  return (
    <div className="space-y-6">
      <StatusMessage message={status?.msg ?? null} type={status?.type} onDismiss={() => setStatus(null)} />

      {/* Back + title */}
      <div>
        <button onClick={() => router.push('/admin/workouts')} className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-flex items-center gap-1">
          ← {t.admin.crud.back}
        </button>
        <h1 className="text-xl font-bold text-gray-900">{sessionLabel(session)}</h1>
        {session.workout_date && <p className="text-sm text-gray-400">{new Date(session.workout_date + 'T00:00:00').toLocaleDateString()}</p>}
        {session.notes && <p className="text-sm text-gray-500 mt-1">{session.notes}</p>}
      </div>

      {/* Exercises table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{t.admin.workouts.sets}</h2>
          <button onClick={openCreateSet} className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors">
            + {t.admin.workouts.newSet}
          </button>
        </div>
        <DataTable
          columns={columns}
          rows={sets}
          getRowId={(s) => s.id}
          onEdit={openEditSet}
          onDelete={setDeletingSet}
          actionsLabel={t.admin.crud.actions}
          emptyMessage={t.admin.workouts.noSets}
          emptyIcon="🏋️"
          rowActions={(s) => (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLinkTarget(s); }}
              className="px-2 py-1 rounded text-xs text-blue-600 hover:bg-blue-50 transition-colors"
              title={t.admin.workouts.linkMedia}
            >
              🖼️
            </button>
          )}
        />
      </section>

      {/* Media per exercise (shown inline below the table) */}
      {sets.filter((s) => (mediaMap[s.id]?.length ?? 0) > 0).map((s) => (
        <section key={s.id} className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">
            📷 {s.exercise} — {t.admin.workouts.linkedMedia}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(mediaMap[s.id] ?? []).map((wsm) => (
              <div key={wsm.id} className="relative group">
                {wsm.media?.type === 'image' && wsm.media.url ? (
                  <img
                    src={wsm.media.url}
                    alt={wsm.media.title || s.exercise}
                    className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl border border-gray-200 flex items-center justify-center bg-gray-50 text-xs text-gray-400">
                    {wsm.media?.title || wsm.media?.url || 'media'}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setUnlinkingMedia(wsm)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs hidden group-hover:flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Exercise create/edit modal */}
      <FormModal
        open={modalOpen}
        title={editingSet ? t.admin.workouts.editSet : t.admin.workouts.newSet}
        onSubmit={handleSaveSet}
        onCancel={() => setModalOpen(false)}
        submitLabel={t.admin.crud.save}
        cancelLabel={t.admin.crud.cancel}
        loading={saving}
      >
        <TextField label={t.admin.workouts.exercise} value={exercise} onChange={setExerciseVal} required />
        <TextField label={t.admin.workouts.series} value={series} onChange={setSeries} type="number" />
        <TextField label={t.admin.workouts.reps} value={reps} onChange={setReps} placeholder="e.g. 8-12" />
        <TextField label={t.admin.workouts.weight} value={weight} onChange={setWeight} type="number" />
        <TextField label={t.admin.workouts.setNotes} value={notes} onChange={setNotes} />
      </FormModal>

      {/* Delete exercise confirm */}
      <ConfirmDialog
        open={!!deletingSet}
        title={t.admin.crud.confirmDelete}
        description={t.admin.crud.confirmDeleteDesc}
        confirmLabel={t.admin.crud.delete}
        cancelLabel={t.admin.crud.cancel}
        onConfirm={handleDeleteSet}
        onCancel={() => setDeletingSet(null)}
      />

      {/* Link media modal */}
      <FormModal
        open={!!linkTarget}
        title={`${t.admin.workouts.linkMedia} → ${linkTarget?.exercise ?? ''}`}
        onSubmit={() => setLinkTarget(null)}
        onCancel={() => setLinkTarget(null)}
        submitLabel={t.admin.crud.cancel}
        cancelLabel={t.admin.crud.cancel}
      >
        {availableMedia.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">{t.admin.crud.noResults}</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableMedia.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => linkMedia(m.id)}
                className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                {m.type === 'image' && m.url ? (
                  <img src={m.url} alt={m.title || ''} className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">🎬</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{m.title || m.url}</p>
                  <p className="text-xs text-gray-400">{m.type ?? 'unknown'}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </FormModal>

      {/* Unlink media confirm */}
      <ConfirmDialog
        open={!!unlinkingMedia}
        title={t.admin.crud.confirmDelete}
        description={t.admin.workouts.unlinkMedia + '?'}
        confirmLabel={t.admin.crud.confirm}
        cancelLabel={t.admin.crud.cancel}
        onConfirm={unlinkMedia}
        onCancel={() => setUnlinkingMedia(null)}
      />
    </div>
  );
}
