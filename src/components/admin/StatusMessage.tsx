'use client';

import { useEffect, useState } from 'react';

interface StatusMessageProps {
  message: string | null;
  type?: 'success' | 'error';
  onDismiss: () => void;
  duration?: number;
}

export default function StatusMessage({
  message,
  type = 'success',
  onDismiss,
  duration = 3000,
}: StatusMessageProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // wait for fade transition
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  const bg = type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800';

  return (
    <div
      className={`fixed top-20 right-4 z-50 max-w-sm px-4 py-3 rounded-xl border shadow-lg text-sm font-medium transition-all duration-300 ${bg} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      {message}
    </div>
  );
}
