'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/components/LanguageProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type { MediaItem } from '@/lib/types';
import DataTable, { type Column } from '@/components/admin/DataTable';
import FormModal, { TextField, TextArea } from '@/components/admin/FormModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import StatusMessage from '@/components/admin/StatusMessage';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

export default function MediaAdmin() {
  const { apiKey } = useAuth();
  const { t } = useLanguage();

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [url, setUrl] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleting, setDeleting] = useState<MediaItem | null>(null);

  // Search
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    const { data, error } = await apiGet<MediaItem[]>('/api/media?limit=500', apiKey);
    if (error) setStatus({ msg: error, type: 'error' });
    else setMedia(data ?? []);
    setLoading(false);
  }, [apiKey]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setUrl('');
    setMediaType('video');
    setTitle('');
    setNotes('');
    setModalOpen(true);
  };

  const openEdit = (m: MediaItem) => {
    setEditing(m);
    setUrl(m.url);
    setMediaType(m.type ?? '');
    setTitle(m.title ?? '');
    setNotes(m.notes ?? '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!apiKey || !url.trim()) return;
    setSaving(true);
    const body = {
      url: url.trim(),
      type: mediaType.trim() || null,
      title: title.trim() || null,
      notes: notes.trim() || null,
    };

    if (editing) {
      const { error } = await apiPut(`/api/media/${editing.id}`, apiKey, body);
      if (error) setStatus({ msg: error, type: 'error' });
      else setStatus({ msg: t.admin.crud.updated, type: 'success' });
    } else {
      const { error } = await apiPost('/api/media', apiKey, body);
      if (error) setStatus({ msg: error, type: 'error' });
      else setStatus({ msg: t.admin.crud.created, type: 'success' });
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!apiKey || !deleting) return;
    const { error } = await apiDelete(`/api/media/${deleting.id}`, apiKey);
    if (error) setStatus({ msg: error, type: 'error' });
    else setStatus({ msg: t.admin.crud.deleted, type: 'success' });
    setDeleting(null);
    load();
  };

  // Filter by search
  const filtered = search.trim()
    ? media.filter((m) => {
        const q = search.toLowerCase();
        return (
          m.url.toLowerCase().includes(q) ||
          (m.title?.toLowerCase().includes(q) ?? false) ||
          (m.type?.toLowerCase().includes(q) ?? false)
        );
      })
    : media;

  const columns: Column<MediaItem>[] = [
    {
      key: 'title',
      header: t.admin.media.mediaTitle,
      render: (m) => (
        <span className="truncate max-w-[160px] inline-block">{m.title || '—'}</span>
      ),
    },
    {
      key: 'url',
      header: t.admin.media.url,
      render: (m) => (
        <a
          href={m.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline truncate max-w-[200px] inline-block"
          onClick={(e) => e.stopPropagation()}
        >
          {m.url}
        </a>
      ),
    },
    { key: 'type', header: t.admin.media.mediaType, render: (m) => m.type || '—', className: 'hidden sm:table-cell' },
  ];

  return (
    <div className="space-y-4">
      <StatusMessage message={status?.msg ?? null} type={status?.type} onDismiss={() => setStatus(null)} />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{t.admin.media.title}</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + {t.admin.media.newMedia}
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t.admin.crud.search}
        className="w-full max-w-xs px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition"
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          getRowId={(m) => m.id}
          onEdit={openEdit}
          onDelete={setDeleting}
          actionsLabel={t.admin.crud.actions}
          emptyMessage={t.admin.crud.noResults}
          emptyIcon="🎬"
        />
      )}

      <FormModal
        open={modalOpen}
        title={editing ? t.admin.media.editMedia : t.admin.media.newMedia}
        onSubmit={handleSave}
        onCancel={() => setModalOpen(false)}
        submitLabel={t.admin.crud.save}
        cancelLabel={t.admin.crud.cancel}
        loading={saving}
      >
        <TextField label={t.admin.media.url} value={url} onChange={setUrl} required placeholder="https://..." />
        <TextField label={t.admin.media.mediaType} value={mediaType} onChange={setMediaType} placeholder="video / image" />
        <TextField label={t.admin.media.mediaTitle} value={title} onChange={setTitle} />
        <TextArea label={t.admin.media.mediaNotes} value={notes} onChange={setNotes} />
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
