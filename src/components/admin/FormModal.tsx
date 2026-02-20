'use client';

import { type ReactNode, type FormEvent } from 'react';

interface FormModalProps {
  open: boolean;
  title: string;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  children: ReactNode;
  loading?: boolean;
}

export default function FormModal({
  open,
  title,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  children,
  loading = false,
}: FormModalProps) {
  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

        <div className="space-y-3">{children}</div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? '…' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reusable form field components
// ---------------------------------------------------------------------------

interface FieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}

export function TextField({ label, value, onChange, placeholder, required, type = 'text' }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition"
      />
    </label>
  );
}

export function TextArea({ label, value, onChange, placeholder }: Omit<FieldProps, 'type' | 'required'>) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition resize-none"
      />
    </label>
  );
}
