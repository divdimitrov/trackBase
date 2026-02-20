'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/components/LanguageProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type { WorkoutSession } from '@/lib/types';
import { sessionLabel } from '@/lib/types';
import DataTable, { type Column } from '@/components/admin/DataTable';
import FormModal, { TextField, TextArea } from '@/components/admin/FormModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import StatusMessage from '@/components/admin/StatusMessage';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

export default function WorkoutsAdmin() {
  const { apiKey } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<WorkoutSession | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleting, setDeleting] = useState<WorkoutSession | null>(null);

  const load = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    const { data, error } = await apiGet<WorkoutSession[]>('/api/workout-sessions?limit=500', apiKey);
    if (error) setStatus({ msg: error, type: 'error' });
    else setSessions(data ?? []);
    setLoading(false);
  }, [apiKey]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setFormTitle('');
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormNotes('');
    setModalOpen(true);
  };

  const openEdit = (s: WorkoutSession) => {
    setEditing(s);
    setFormTitle(s.title || s.name || '');
    setFormDate(s.session_date?.slice(0, 10) ?? '');
    setFormNotes(s.notes ?? '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!apiKey) return;
    setSaving(true);
    const body: Record<string, unknown> = {};
    if (formTitle.trim()) body.title = formTitle.trim();
    if (formDate) body.session_date = formDate;
    if (formNotes.trim()) body.notes = formNotes.trim();

    if (editing) {
      const { error } = await apiPut(`/api/workout-sessions/${editing.id}`, apiKey, body);
      if (error) setStatus({ msg: error, type: 'error' });
      else setStatus({ msg: t.admin.crud.updated, type: 'success' });
    } else {
      if (!body.title) body.title = 'Workout';
      const { error } = await apiPost('/api/workout-sessions', apiKey, body);
      if (error) setStatus({ msg: error, type: 'error' });
      else setStatus({ msg: t.admin.crud.created, type: 'success' });
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!apiKey || !deleting) return;
    const { error } = await apiDelete(`/api/workout-sessions/${deleting.id}`, apiKey);
    if (error) setStatus({ msg: error, type: 'error' });
    else setStatus({ msg: t.admin.crud.deleted, type: 'success' });
    setDeleting(null);
    load();
  };

  const columns: Column<WorkoutSession>[] = [
    { key: 'title', header: t.admin.workouts.sessionTitle, render: (s) => sessionLabel(s) },
    {
      key: 'session_date',
      header: t.admin.workouts.sessionDate,
      render: (s) => s.session_date ? new Date(s.session_date).toLocaleDateString() : '—',
    },
    {
      key: 'notes',
      header: t.admin.workouts.sessionNotes,
      render: (s) => (
        <span className="text-gray-500 truncate max-w-[160px] inline-block">{s.notes || '—'}</span>
      ),
      className: 'hidden sm:table-cell',
    },
  ];

  return (
    <div className="space-y-4">
      <StatusMessage message={status?.msg ?? null} type={status?.type} onDismiss={() => setStatus(null)} />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{t.admin.workouts.title}</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + {t.admin.workouts.newSession}
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          rows={sessions}
          getRowId={(s) => s.id}
          onEdit={openEdit}
          onDelete={setDeleting}
          actionsLabel={t.admin.crud.actions}
          emptyMessage={t.admin.crud.noResults}
          onClickRow={(s) => router.push(`/admin/workouts/${s.id}`)}
        />
      )}

      <FormModal
        open={modalOpen}
        title={editing ? t.admin.workouts.editSession : t.admin.workouts.newSession}
        onSubmit={handleSave}
        onCancel={() => setModalOpen(false)}
        submitLabel={t.admin.crud.save}
        cancelLabel={t.admin.crud.cancel}
        loading={saving}
      >
        <TextField label={t.admin.workouts.sessionTitle} value={formTitle} onChange={setFormTitle} />
        <TextField label={t.admin.workouts.sessionDate} value={formDate} onChange={setFormDate} type="date" />
        <TextArea label={t.admin.workouts.sessionNotes} value={formNotes} onChange={setFormNotes} />
      </FormModal>

      <ConfirmDialog
        open={!!deleting}
        title={t.admin.crud.confirmDelete}
        description={t.admin.crud.confirmDeleteDesc}
        confirmLabel={t.admin.crud.delete}
        cancelLabel={t.admin.crud.cancel}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
