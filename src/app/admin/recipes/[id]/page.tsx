'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/components/LanguageProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type { Recipe, RecipeIngredient, RecipeMedia, MediaItem } from '@/lib/types';
import DataTable, { type Column } from '@/components/admin/DataTable';
import FormModal, { TextField } from '@/components/admin/FormModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import StatusMessage from '@/components/admin/StatusMessage';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

export default function RecipeDetailAdmin() {
  const { id } = useParams<{ id: string }>();
  const { apiKey } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [recipeMedia, setRecipeMedia] = useState<RecipeMedia[]>([]);
  const [allMedia, setAllMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Ingredient modal
  const [ingModalOpen, setIngModalOpen] = useState(false);
  const [editingIng, setEditingIng] = useState<RecipeIngredient | null>(null);
  const [ingName, setIngName] = useState('');
  const [ingQty, setIngQty] = useState('');
  const [savingIng, setSavingIng] = useState(false);

  // Delete ingredient
  const [deletingIng, setDeletingIng] = useState<RecipeIngredient | null>(null);

  // Link media modal
  const [linkModalOpen, setLinkModalOpen] = useState(false);

  // Unlink media
  const [unlinkingMedia, setUnlinkingMedia] = useState<RecipeMedia | null>(null);

  const load = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    const [rRes, iRes, mRes, amRes] = await Promise.all([
      apiGet<Recipe>(`/api/recipes/${id}`, apiKey),
      apiGet<RecipeIngredient[]>(`/api/recipes/${id}/ingredients`, apiKey),
      apiGet<RecipeMedia[]>(`/api/recipes/${id}/media`, apiKey),
      apiGet<MediaItem[]>('/api/media?limit=500', apiKey),
    ]);
    if (rRes.data) setRecipe(rRes.data);
    setIngredients(iRes.data ?? []);
    setRecipeMedia(mRes.data ?? []);
    setAllMedia(amRes.data ?? []);
    setLoading(false);
  }, [apiKey, id]);

  useEffect(() => { load(); }, [load]);

  // ---------------------------------------------------------------------------
  // Ingredients CRUD
  // ---------------------------------------------------------------------------
  const openCreateIng = () => {
    setEditingIng(null);
    setIngName('');
    setIngQty('');
    setIngModalOpen(true);
  };

  const openEditIng = (ing: RecipeIngredient) => {
    setEditingIng(ing);
    setIngName(ing.name);
    setIngQty(ing.qty_text ?? '');
    setIngModalOpen(true);
  };

  const saveIng = async () => {
    if (!apiKey || !ingName.trim()) return;
    setSavingIng(true);
    const body = { name: ingName.trim(), qty_text: ingQty.trim() || null };

    if (editingIng) {
      const { error } = await apiPut(`/api/ingredients/${editingIng.id}`, apiKey, body);
      if (error) setStatus({ msg: error, type: 'error' });
      else setStatus({ msg: t.admin.crud.updated, type: 'success' });
    } else {
      const { error } = await apiPost(`/api/recipes/${id}/ingredients`, apiKey, body);
      if (error) setStatus({ msg: error, type: 'error' });
      else setStatus({ msg: t.admin.crud.created, type: 'success' });
    }
    setSavingIng(false);
    setIngModalOpen(false);
    load();
  };

  const deleteIng = async () => {
    if (!apiKey || !deletingIng) return;
    const { error } = await apiDelete(`/api/ingredients/${deletingIng.id}`, apiKey);
    if (error) setStatus({ msg: error, type: 'error' });
    else setStatus({ msg: t.admin.crud.deleted, type: 'success' });
    setDeletingIng(null);
    load();
  };

  // ---------------------------------------------------------------------------
  // Media linking
  // ---------------------------------------------------------------------------
  const linkMedia = async (mediaId: string) => {
    if (!apiKey) return;
    const { error } = await apiPost(`/api/recipes/${id}/media`, apiKey, { media_id: mediaId });
    if (error) setStatus({ msg: error, type: 'error' });
    else setStatus({ msg: t.admin.crud.created, type: 'success' });
    setLinkModalOpen(false);
    load();
  };

  const unlinkMedia = async () => {
    if (!apiKey || !unlinkingMedia) return;
    const { error } = await apiDelete(`/api/recipe-media/${unlinkingMedia.id}`, apiKey);
    if (error) setStatus({ msg: error, type: 'error' });
    else setStatus({ msg: t.admin.crud.deleted, type: 'success' });
    setUnlinkingMedia(null);
    load();
  };

  // IDs already linked so we can filter
  const linkedIds = new Set(recipeMedia.map((rm) => rm.media_id));
  const availableMedia = allMedia.filter((m) => !linkedIds.has(m.id));

  const ingColumns: Column<RecipeIngredient>[] = [
    { key: 'name', header: t.admin.recipes.ingredientName },
    { key: 'qty_text', header: t.admin.recipes.ingredientQty, render: (i) => i.qty_text || '—' },
  ];

  if (loading) return <LoadingSpinner />;
  if (!recipe) return <p className="text-sm text-gray-500">{t.admin.crud.errorLoad}</p>;

  return (
    <div className="space-y-8">
      <StatusMessage message={status?.msg ?? null} type={status?.type} onDismiss={() => setStatus(null)} />

      {/* Back + title */}
      <div>
        <button onClick={() => router.push('/admin/recipes')} className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-flex items-center gap-1">
          ← {t.admin.crud.back}
        </button>
        <h1 className="text-xl font-bold text-gray-900">{recipe.title}</h1>
        {recipe.notes && <p className="text-sm text-gray-500 mt-1">{recipe.notes}</p>}
      </div>

      {/* Ingredients */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{t.admin.recipes.ingredients}</h2>
          <button onClick={openCreateIng} className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors">
            + {t.admin.recipes.newIngredient}
          </button>
        </div>
        <DataTable
          columns={ingColumns}
          rows={ingredients}
          getRowId={(i) => i.id}
          onEdit={openEditIng}
          onDelete={setDeletingIng}
          actionsLabel={t.admin.crud.actions}
          emptyMessage={t.admin.recipes.noIngredients}
          emptyIcon="🥬"
        />
      </section>

      {/* Linked Media */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{t.admin.recipes.linkedMedia}</h2>
          <button onClick={() => setLinkModalOpen(true)} className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors">
            + {t.admin.recipes.linkMedia}
          </button>
        </div>
        {recipeMedia.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">{t.admin.recipes.noMedia}</p>
        ) : (
          <div className="space-y-2">
            {recipeMedia.map((rm) => (
              <div key={rm.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200/60">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{rm.media?.title || rm.media?.url || rm.media_id}</p>
                  {rm.media?.type && <span className="text-xs text-gray-400">{rm.media.type}</span>}
                </div>
                <button
                  onClick={() => setUnlinkingMedia(rm)}
                  className="shrink-0 ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  {t.admin.recipes.unlinkMedia}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Ingredient modal */}
      <FormModal
        open={ingModalOpen}
        title={editingIng ? t.admin.recipes.editIngredient : t.admin.recipes.newIngredient}
        onSubmit={saveIng}
        onCancel={() => setIngModalOpen(false)}
        submitLabel={t.admin.crud.save}
        cancelLabel={t.admin.crud.cancel}
        loading={savingIng}
      >
        <TextField label={t.admin.recipes.ingredientName} value={ingName} onChange={setIngName} required />
        <TextField label={t.admin.recipes.ingredientQty} value={ingQty} onChange={setIngQty} placeholder="e.g. 200g" />
      </FormModal>

      {/* Delete ingredient confirm */}
      <ConfirmDialog
        open={!!deletingIng}
        title={t.admin.crud.confirmDelete}
        description={t.admin.crud.confirmDeleteDesc}
        confirmLabel={t.admin.crud.delete}
        cancelLabel={t.admin.crud.cancel}
        onConfirm={deleteIng}
        onCancel={() => setDeletingIng(null)}
      />

      {/* Link media modal */}
      <FormModal
        open={linkModalOpen}
        title={t.admin.recipes.linkMedia}
        onSubmit={() => setLinkModalOpen(false)}
        onCancel={() => setLinkModalOpen(false)}
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
                className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm font-medium text-gray-900 truncate">{m.title || m.url}</p>
                <p className="text-xs text-gray-400">{m.type ?? 'unknown'}</p>
              </button>
            ))}
          </div>
        )}
      </FormModal>

      {/* Unlink media confirm */}
      <ConfirmDialog
        open={!!unlinkingMedia}
        title={t.admin.crud.confirmDelete}
        description={t.admin.recipes.unlinkMedia + '?'}
        confirmLabel={t.admin.crud.confirm}
        cancelLabel={t.admin.crud.cancel}
        onConfirm={unlinkMedia}
        onCancel={() => setUnlinkingMedia(null)}
      />
    </div>
  );
}
