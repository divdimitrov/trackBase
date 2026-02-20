'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/components/LanguageProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type { Recipe } from '@/lib/types';
import DataTable, { type Column } from '@/components/admin/DataTable';
import FormModal, { TextField, TextArea } from '@/components/admin/FormModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import StatusMessage from '@/components/admin/StatusMessage';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

export default function RecipesAdmin() {
  const { apiKey } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleting, setDeleting] = useState<Recipe | null>(null);

  const load = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    const { data, error } = await apiGet<Recipe[]>('/api/recipes?limit=500', apiKey);
    if (error) {
      setStatus({ msg: error, type: 'error' });
    } else {
      setRecipes(data ?? []);
    }
    setLoading(false);
  }, [apiKey]);

  useEffect(() => { load(); }, [load]);

  // Open create / edit modal
  const openCreate = () => {
    setEditing(null);
    setTitle('');
    setNotes('');
    setModalOpen(true);
  };

  const openEdit = (r: Recipe) => {
    setEditing(r);
    setTitle(r.title);
    setNotes(r.notes ?? '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!apiKey || !title.trim()) return;
    setSaving(true);
    const body = { title: title.trim(), notes: notes.trim() || null };

    if (editing) {
      const { error } = await apiPut(`/api/recipes/${editing.id}`, apiKey, body);
      if (error) { setStatus({ msg: error, type: 'error' }); }
      else { setStatus({ msg: t.admin.crud.updated, type: 'success' }); }
    } else {
      const { error } = await apiPost('/api/recipes', apiKey, body);
      if (error) { setStatus({ msg: error, type: 'error' }); }
      else { setStatus({ msg: t.admin.crud.created, type: 'success' }); }
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!apiKey || !deleting) return;
    const { error } = await apiDelete(`/api/recipes/${deleting.id}`, apiKey);
    if (error) { setStatus({ msg: error, type: 'error' }); }
    else { setStatus({ msg: t.admin.crud.deleted, type: 'success' }); }
    setDeleting(null);
    load();
  };

  const columns: Column<Recipe>[] = [
    { key: 'title', header: t.admin.recipes.recipeName },
    {
      key: 'notes',
      header: t.admin.recipes.recipeNotes,
      render: (r) => (
        <span className="text-gray-500 truncate max-w-[200px] inline-block">
          {r.notes || '—'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (r) => new Date(r.created_at).toLocaleDateString(),
      className: 'hidden sm:table-cell',
    },
  ];

  return (
    <div className="space-y-4">
      <StatusMessage message={status?.msg ?? null} type={status?.type} onDismiss={() => setStatus(null)} />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{t.admin.recipes.title}</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + {t.admin.recipes.newRecipe}
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          rows={recipes}
          getRowId={(r) => r.id}
          onEdit={openEdit}
          onDelete={setDeleting}
          actionsLabel={t.admin.crud.actions}
          emptyMessage={t.admin.crud.noResults}
          onClickRow={(r) => router.push(`/admin/recipes/${r.id}`)}
        />
      )}

      {/* Create / Edit modal */}
      <FormModal
        open={modalOpen}
        title={editing ? t.admin.recipes.editRecipe : t.admin.recipes.newRecipe}
        onSubmit={handleSave}
        onCancel={() => setModalOpen(false)}
        submitLabel={t.admin.crud.save}
        cancelLabel={t.admin.crud.cancel}
        loading={saving}
      >
        <TextField
          label={t.admin.recipes.recipeName}
          value={title}
          onChange={setTitle}
          required
        />
        <TextArea
          label={t.admin.recipes.recipeNotes}
          value={notes}
          onChange={setNotes}
        />
      </FormModal>

      {/* Delete confirm */}
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
