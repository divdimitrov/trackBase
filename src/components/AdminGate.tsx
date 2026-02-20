'use client';

import { useState, type ReactNode, type FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/components/LanguageProvider';

export default function AdminGate({ children }: { children: ReactNode }) {
  const { apiKey, setApiKey } = useAuth();
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (apiKey) return <>{children}</>;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      setError(t.admin.gate.errorEmpty);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmed }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? t.admin.gate.errorWrong);
        return;
      }

      setApiKey(json.apiKey);
    } catch {
      setError(t.admin.gate.errorWrong);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl border border-gray-200/60 shadow-sm p-6 space-y-4"
      >
        <div className="text-center space-y-1">
          <span className="text-3xl">🔐</span>
          <h2 className="text-lg font-semibold text-gray-900">
            {t.admin.gate.title}
          </h2>
          <p className="text-sm text-gray-500">{t.admin.gate.subtitle}</p>
        </div>

        <input
          type="password"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError('');
          }}
          placeholder={t.admin.gate.placeholder}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition"
          autoFocus
        />

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 active:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {loading ? '…' : t.admin.gate.submit}
        </button>
      </form>
    </div>
  );
}
