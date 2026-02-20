'use client';

import { useState } from 'react';
import { mockShoppingItems } from '@/lib/mockData';
import { ShoppingItem } from '@/lib/types';

function ShoppingItemRow({
  item,
  onToggle,
}: {
  item: ShoppingItem;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onToggle(item.id)}
      className={`w-full flex items-center gap-3 p-4 min-h-[56px] rounded-2xl border transition-all active:scale-[0.98] ${
        item.checked
          ? 'bg-gray-50/80 border-gray-200/60'
          : 'bg-white border-gray-200/80 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          item.checked
            ? 'bg-green-500 border-green-500 shadow-sm shadow-green-200'
            : 'border-gray-300'
        }`}
      >
        {item.checked && (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div className="flex-1 text-left">
        <span
          className={`text-base ${
            item.checked ? 'text-gray-400 line-through' : 'text-gray-900'
          }`}
        >
          {item.name}
        </span>
        {item.category && (
          <span className="ml-2 text-xs text-gray-400">{item.category}</span>
        )}
      </div>
    </button>
  );
}

export default function ShoppingPage() {
  const [items, setItems] = useState<ShoppingItem[]>(mockShoppingItems);

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const checkedCount = items.filter((item) => item.checked).length;
  const totalCount = items.length;

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Shopping</h1>
        <p className="text-sm text-gray-500">
          {checkedCount} of {totalCount} items checked
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(checkedCount / totalCount) * 100}%` }}
        />
      </div>

      {/* Items grouped by category */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="space-y-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide px-1">
              {category}
            </h2>
            <div className="space-y-2">
              {categoryItems.map((item) => (
                <ShoppingItemRow key={item.id} item={item} onToggle={handleToggle} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
