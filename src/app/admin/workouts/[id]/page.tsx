'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/components/LanguageProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type { WorkoutSession, WorkoutSet } from '@/lib/types';
import { sessionLabel, setExercise } from '@/lib/types';
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

  // Set modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<WorkoutSet | null>(null);
  const [exercise, setExerciseVal] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete set
  const [deletingSet, setDeletingSet] = useState<WorkoutSet | null>(null);

  const load = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    const [sRes, setRes] = await Promise.all([
      apiGet<WorkoutSession>(`/api/workout-sessions/${id}`, apiKey),
      apiGet<WorkoutSet[]>(`/api/workout-sessions/${id}/sets`, apiKey),
    ]);
    if (sRes.data) setSession(sRes.data);
    setSets(setRes.data ?? []);
    setLoading(false);
  }, [apiKey, id]);

  useEffect(() => { load(); }, [load]);

  const openCreateSet = () => {
    setEditingSet(null);
    setExerciseVal('');
    setReps('');
    setWeight('');
    setNotes('');
    setModalOpen(true);
  };

  const openEditSet = (s: WorkoutSet) => {
    setEditingSet(s);
    setExerciseVal(s.exercise || s.name || '');
    setReps(s.reps?.toString() ?? '');
    setWeight(s.weight?.toString() ?? '');
    setNotes(s.notes ?? '');
    setModalOpen(true);
  };

  const handleSaveSet = async () => {
    if (!apiKey || !exercise.trim()) return;
    setSaving(true);
    const body: Record<string, unknown> = {
      exercise: exercise.trim(),
      reps: reps ? Number(reps) : null,
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

  const columns: Column<WorkoutSet>[] = [
    { key: 'exercise', header: t.admin.workouts.exercise, render: (s) => setExercise(s) },
    { key: 'reps', header: t.admin.workouts.reps, render: (s) => s.reps ?? '—' },
    { key: 'weight', header: t.admin.workouts.weight, render: (s) => s.weight ?? '—' },
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

      <div>
        <button onClick={() => router.push('/admin/workouts')} className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-flex items-center gap-1">
          ← {t.admin.crud.back}
        </button>
        <h1 className="text-xl font-bold text-gray-900">{sessionLabel(session)}</h1>
        {session.session_date && <p className="text-sm text-gray-400">{new Date(session.session_date).toLocaleDateString()}</p>}
        {session.notes && <p className="text-sm text-gray-500 mt-1">{session.notes}</p>}
      </div>

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
        />
      </section>

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
        <TextField label={t.admin.workouts.reps} value={reps} onChange={setReps} type="number" />
        <TextField label={t.admin.workouts.weight} value={weight} onChange={setWeight} type="number" />
        <TextField label={t.admin.workouts.setNotes} value={notes} onChange={setNotes} />
      </FormModal>

      <ConfirmDialog
        open={!!deletingSet}
        title={t.admin.crud.confirmDelete}
        description={t.admin.crud.confirmDeleteDesc}
        confirmLabel={t.admin.crud.delete}
        cancelLabel={t.admin.crud.cancel}
        onConfirm={handleDeleteSet}
        onCancel={() => setDeletingSet(null)}
      />
    </div>
  );
}
