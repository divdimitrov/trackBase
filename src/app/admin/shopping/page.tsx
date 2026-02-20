'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/components/LanguageProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type { ShoppingItem } from '@/lib/types';
import DataTable, { type Column } from '@/components/admin/DataTable';
import FormModal, { TextField } from '@/components/admin/FormModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import StatusMessage from '@/components/admin/StatusMessage';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

export default function ShoppingAdmin() {
  const { apiKey } = useAuth();
  const { t } = useLanguage();

  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ShoppingItem | null>(null);
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleting, setDeleting] = useState<ShoppingItem | null>(null);

  const load = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    const { data, error } = await apiGet<ShoppingItem[]>('/api/shopping-items?limit=500', apiKey);
    if (error) setStatus({ msg: error, type: 'error' });
    else setItems(data ?? []);
    setLoading(false);
  }, [apiKey]);

  useEffect(() => { load(); }, [load]);

  const toggleChecked = async (item: ShoppingItem) => {
    if (!apiKey) return;
    const { error } = await apiPut(`/api/shopping-items/${item.id}`, apiKey, {
      is_checked: !item.is_checked,
    });
    if (error) setStatus({ msg: error, type: 'error' });
    else {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_checked: !i.is_checked } : i)),
      );
    }
  };

  const openCreate = () => {
    setEditing(null);
    setName('');
    setQty('');
    setModalOpen(true);
  };

  const openEdit = (item: ShoppingItem) => {
    setEditing(item);
    setName(item.name);
    setQty(item.qty_text ?? '');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!apiKey || !name.trim()) return;
    setSaving(true);
    const body = { name: name.trim(), qty_text: qty.trim() || null };

    if (editing) {
      const { error } = await apiPut(`/api/shopping-items/${editing.id}`, apiKey, body);
      if (error) setStatus({ msg: error, type: 'error' });
      else setStatus({ msg: t.admin.crud.updated, type: 'success' });
    } else {
      const { error } = await apiPost('/api/shopping-items', apiKey, body);
      if (error) setStatus({ msg: error, type: 'error' });
      else setStatus({ msg: t.admin.crud.created, type: 'success' });
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!apiKey || !deleting) return;
    const { error } = await apiDelete(`/api/shopping-items/${deleting.id}`, apiKey);
    if (error) setStatus({ msg: error, type: 'error' });
    else setStatus({ msg: t.admin.crud.deleted, type: 'success' });
    setDeleting(null);
    load();
  };

  const columns: Column<ShoppingItem>[] = [
    {
      key: 'is_checked',
      header: '✓',
      className: 'w-12',
      render: (item) => (
        <button
          onClick={(e) => { e.stopPropagation(); toggleChecked(item); }}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
            item.is_checked
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {item.is_checked && '✓'}
        </button>
      ),
    },
    {
      key: 'name',
      header: t.admin.shopping.itemName,
      render: (item) => (
        <span className={item.is_checked ? 'line-through text-gray-400' : 'text-gray-900'}>
          {item.name}
        </span>
      ),
    },
    { key: 'qty_text', header: t.admin.shopping.itemQty, render: (item) => item.qty_text || '—' },
  ];

  return (
    <div className="space-y-4">
      <StatusMessage message={status?.msg ?? null} type={status?.type} onDismiss={() => setStatus(null)} />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{t.admin.shopping.title}</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + {t.admin.shopping.newItem}
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          getRowId={(i) => i.id}
          onEdit={openEdit}
          onDelete={setDeleting}
          actionsLabel={t.admin.crud.actions}
          emptyMessage={t.admin.crud.noResults}
          emptyIcon="🛒"
        />
      )}

      <FormModal
        open={modalOpen}
        title={editing ? t.admin.shopping.editItem : t.admin.shopping.newItem}
        onSubmit={handleSave}
        onCancel={() => setModalOpen(false)}
        submitLabel={t.admin.crud.save}
        cancelLabel={t.admin.crud.cancel}
        loading={saving}
      >
        <TextField label={t.admin.shopping.itemName} value={name} onChange={setName} required />
        <TextField label={t.admin.shopping.itemQty} value={qty} onChange={setQty} placeholder="e.g. 2kg" />
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
