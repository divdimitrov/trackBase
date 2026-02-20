'use client';

interface EmptyStateProps {
  icon?: string;
  message: string;
  action?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon = '📭', message, action, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl mb-3">{icon}</span>
      <p className="text-sm text-gray-500 mb-4">{message}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  );
}
