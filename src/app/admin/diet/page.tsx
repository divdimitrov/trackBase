'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/components/LanguageProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type { DietDay } from '@/lib/types';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { TextField } from '@/components/admin/FormModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import StatusMessage from '@/components/admin/StatusMessage';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

export default function AdminDietPage() {
  const { t } = useLanguage();
  const { apiKey } = useAuth();
  const [days, setDays] = useState<DietDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DietDay | null>(null);
  const [formLabel, setFormLabel] = useState('');
  const [formOrder, setFormOrder] = useState('0');

  // Delete confirm
  const [deleting, setDeleting] = useState<DietDay | null>(null);

  const load = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    const { data, error } = await apiGet<DietDay[]>('/api/diet-days?limit=100', apiKey);
    if (error) {
      setStatusType('error');
      setStatusMsg(t.admin.crud.errorLoad);
    } else {
      setDays(data ?? []);
    }
    setLoading(false);
  }, [apiKey, t]);

  useEffect(() => { load(); }, [load]);

  /* ---------- Create / Edit ---------- */
  const openCreate = () => {
    setEditing(null);
    setFormLabel('');
    setFormOrder(String(days.length));
    setShowForm(true);
  };

  const openEdit = (d: DietDay) => {
    setEditing(d);
    setFormLabel(d.label);
    setFormOrder(String(d.sort_order));
    setShowForm(true);
  };

  const save = async () => {
    if (!apiKey) return;
    const payload = { label: formLabel, sort_order: Number(formOrder) || 0 };
    const res = editing
      ? await apiPut(`/api/diet-days/${editing.id}`, apiKey, payload)
      : await apiPost('/api/diet-days', apiKey, payload);
    if (res.error) {
      setStatusType('error');
      setStatusMsg(t.admin.crud.errorSave);
    } else {
      setStatusType('success');
      setStatusMsg(editing ? t.admin.crud.updated : t.admin.crud.created);
      setShowForm(false);
      load();
    }
  };

  /* ---------- Delete ---------- */
  const confirmDelete = async () => {
    if (!apiKey || !deleting) return;
    const { error } = await apiDelete(`/api/diet-days/${deleting.id}`, apiKey);
    if (error) {
      setStatusType('error');
      setStatusMsg(t.admin.crud.errorDelete);
    } else {
      setStatusType('success');
      setStatusMsg(t.admin.crud.deleted);
      load();
    }
    setDeleting(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{t.admin.diet.title}</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {t.admin.diet.newDay}
        </button>
      </div>

      <StatusMessage message={statusMsg} type={statusType} onDismiss={() => setStatusMsg(null)} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={[
            { key: 'sort_order', header: '#', render: (d) => String(d.sort_order) },
            {
              key: 'label',
              header: t.admin.diet.dayLabel,
              render: (d) => (
                <Link href={`/admin/diet/${d.id}`} className="text-blue-600 hover:underline font-medium">
                  {d.label}
                </Link>
              ),
            },
          ]}
          rows={days}
          getRowId={(d) => d.id}
          onEdit={openEdit}
          onDelete={(d) => setDeleting(d)}
          emptyMessage={t.admin.crud.noResults}
        />
      )}

      {/* Form modal */}
      <FormModal
        open={showForm}
        title={editing ? t.admin.diet.editDay : t.admin.diet.newDay}
        onCancel={() => setShowForm(false)}
        onSubmit={save}
        submitLabel={t.admin.crud.save}
        cancelLabel={t.admin.crud.cancel}
      >
        <TextField label={t.admin.diet.dayLabel} value={formLabel} onChange={setFormLabel} />
        <TextField label={t.admin.diet.sortOrder} value={formOrder} onChange={setFormOrder} />
      </FormModal>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleting}
        title={t.admin.crud.confirmDelete}
        description={t.admin.crud.confirmDeleteDesc}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
        confirmLabel={t.admin.crud.confirm}
        cancelLabel={t.admin.crud.cancel}
      />
    </div>
  );
}
