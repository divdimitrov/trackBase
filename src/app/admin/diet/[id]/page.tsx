'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/components/LanguageProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type { DietDay, DietMeal, MealType } from '@/lib/types';
import { MEAL_TYPES, mealTypeLabels } from '@/lib/types';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { TextField, TextArea } from '@/components/admin/FormModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import StatusMessage from '@/components/admin/StatusMessage';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

export default function AdminDietDayDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useLanguage();
  const { apiKey } = useAuth();

  const [day, setDay] = useState<DietDay | null>(null);
  const [meals, setMeals] = useState<DietMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');

  // Meal form
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DietMeal | null>(null);
  const [formType, setFormType] = useState<MealType>('breakfast');
  const [formTitle, setFormTitle] = useState('');
  const [formIngredients, setFormIngredients] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formOrder, setFormOrder] = useState('0');

  // Delete confirm
  const [deleting, setDeleting] = useState<DietMeal | null>(null);

  const load = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    const [dRes, mRes] = await Promise.all([
      apiGet<DietDay>(`/api/diet-days/${id}`, apiKey),
      apiGet<DietMeal[]>(`/api/diet-days/${id}/meals`, apiKey),
    ]);
    if (dRes.data) setDay(dRes.data);
    setMeals(mRes.data ?? []);
    if (dRes.error || mRes.error) {
      setStatusType('error');
      setStatusMsg(t.admin.crud.errorLoad);
    }
    setLoading(false);
  }, [apiKey, id, t]);

  useEffect(() => { load(); }, [load]);

  /* ---------- Create / Edit ---------- */
  const openCreate = () => {
    setEditing(null);
    setFormType('breakfast');
    setFormTitle('');
    setFormIngredients('');
    setFormInstructions('');
    setFormOrder(String(meals.length));
    setShowForm(true);
  };

  const openEdit = (m: DietMeal) => {
    setEditing(m);
    setFormType(m.meal_type);
    setFormTitle(m.title);
    setFormIngredients(m.ingredients ?? '');
    setFormInstructions(m.instructions ?? '');
    setFormOrder(String(m.sort_order));
    setShowForm(true);
  };

  const save = async () => {
    if (!apiKey) return;
    const payload = {
      meal_type: formType,
      title: formTitle,
      ingredients: formIngredients || null,
      instructions: formInstructions || null,
      sort_order: Number(formOrder) || 0,
    };
    const res = editing
      ? await apiPut(`/api/diet-meals/${editing.id}`, apiKey, payload)
      : await apiPost(`/api/diet-days/${id}/meals`, apiKey, payload);
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
    const { error } = await apiDelete(`/api/diet-meals/${deleting.id}`, apiKey);
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/admin/diet" className="text-sm text-gray-500 hover:text-gray-900">
          ← {t.admin.crud.back}
        </Link>
        <h1 className="text-xl font-bold text-gray-900">{day?.label ?? '…'}</h1>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">{t.admin.diet.meals}</h2>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {t.admin.diet.newMeal}
        </button>
      </div>

      <StatusMessage message={statusMsg} type={statusType} onDismiss={() => setStatusMsg(null)} />

      <DataTable
        columns={[
          {
            key: 'meal_type',
            header: t.admin.diet.mealType,
            render: (m) => mealTypeLabels[m.meal_type][locale],
          },
          { key: 'title', header: t.admin.diet.mealTitle, render: (m) => m.title },
        ]}
        rows={meals}
        getRowId={(m) => m.id}
        onEdit={openEdit}
        onDelete={(m) => setDeleting(m)}
        emptyMessage={t.admin.diet.noMeals}
      />

      {/* Meal form modal */}
      <FormModal
        open={showForm}
        title={editing ? t.admin.diet.editMeal : t.admin.diet.newMeal}
        onCancel={() => setShowForm(false)}
        onSubmit={save}
        submitLabel={t.admin.crud.save}
        cancelLabel={t.admin.crud.cancel}
      >
        {/* Meal type selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.diet.mealType}</label>
          <select
            value={formType}
            onChange={(e) => setFormType(e.target.value as MealType)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {MEAL_TYPES.map((mt) => (
              <option key={mt} value={mt}>
                {mealTypeLabels[mt][locale]}
              </option>
            ))}
          </select>
        </div>
        <TextField label={t.admin.diet.mealTitle} value={formTitle} onChange={setFormTitle} />
        <TextArea label={t.admin.diet.mealIngredients} value={formIngredients} onChange={setFormIngredients} />
        <TextArea label={t.admin.diet.mealInstructions} value={formInstructions} onChange={setFormInstructions} />
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
