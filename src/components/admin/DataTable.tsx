'use client';

import { type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Column definition
// ---------------------------------------------------------------------------

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

// ---------------------------------------------------------------------------
// DataTable component
// ---------------------------------------------------------------------------

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  /** Extra actions rendered per row */
  rowActions?: (row: T) => ReactNode;
  actionsLabel?: string;
  emptyIcon?: string;
  emptyMessage?: string;
  onClickRow?: (row: T) => void;
}

export default function DataTable<T>({
  columns,
  rows,
  getRowId,
  onEdit,
  onDelete,
  rowActions,
  actionsLabel = 'Actions',
  emptyIcon = '📭',
  emptyMessage = 'Nothing here yet',
  onClickRow,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl mb-3">{emptyIcon}</span>
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const showActions = onEdit || onDelete || rowActions;

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200/60 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left font-medium text-gray-500 ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
            {showActions && (
              <th className="px-4 py-3 text-right font-medium text-gray-500 w-36">
                {actionsLabel}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowId(row)}
              className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors ${
                onClickRow ? 'cursor-pointer' : ''
              }`}
              onClick={() => onClickRow?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 ${col.className ?? ''}`}>
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key] ?? '—')}
                </td>
              ))}
              {showActions && (
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="inline-flex items-center gap-1">
                    {rowActions?.(row)}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        ✏️
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
