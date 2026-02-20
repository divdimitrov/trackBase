'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/components/LanguageProvider';
import { apiGet } from '@/lib/api/client';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

interface Counts {
  recipes: number | null;
  workouts: number | null;
  shopping: number | null;
  media: number | null;
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { apiKey, logout } = useAuth();
  const [counts, setCounts] = useState<Counts>({
    recipes: null,
    workouts: null,
    shopping: null,
    media: null,
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    const [r, w, s, m] = await Promise.all([
      apiGet<unknown[]>('/api/recipes?limit=1000', apiKey),
      apiGet<unknown[]>('/api/workout-sessions?limit=1000', apiKey),
      apiGet<unknown[]>('/api/shopping-items?limit=1000', apiKey),
      apiGet<unknown[]>('/api/media?limit=1000', apiKey),
    ]);
    setCounts({
      recipes: r.data?.length ?? 0,
      workouts: w.data?.length ?? 0,
      shopping: s.data?.length ?? 0,
      media: m.data?.length ?? 0,
    });
    setLoading(false);
  }, [apiKey]);

  useEffect(() => { load(); }, [load]);

  const cards = [
    { href: '/admin/recipes', label: t.admin.dashboard.recipes, count: counts.recipes, icon: '📝' },
    { href: '/admin/workouts', label: t.admin.dashboard.workouts, count: counts.workouts, icon: '🏋️' },
    { href: '/admin/shopping', label: t.admin.dashboard.shopping, count: counts.shopping, icon: '🛒' },
    { href: '/admin/media', label: t.admin.dashboard.media, count: counts.media, icon: '🎬' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{t.admin.title}</h1>
          <p className="text-sm text-gray-500">{t.admin.subtitle}</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {t.admin.dashboard.logout}
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="flex flex-col items-center gap-2 p-5 bg-white rounded-2xl border border-gray-200/60 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="text-2xl font-bold text-gray-900">{c.count ?? '—'}</span>
              <span className="text-sm text-gray-500">{c.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
