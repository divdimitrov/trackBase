'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import type { DietDay, DietMeal, MealType } from '@/lib/types';
import { MEAL_TYPES, mealTypeLabels } from '@/lib/types';

/**
 * Public diet page — shows the daily meal plan.
 * Fetches from the API (requires stored API key from admin gate, or
 * works when APP_API_KEY env is unset — dev convenience).
 */
export default function DietPage() {
  const { t, locale } = useLanguage();
  const [days, setDays] = useState<(DietDay & { meals: DietMeal[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const apiKey = typeof window !== 'undefined' ? localStorage.getItem('trackbase_api_key') ?? '' : '';
        const headers: HeadersInit = apiKey ? { 'x-api-key': apiKey } : {};

        const daysRes = await fetch('/api/diet-days?limit=100', { headers });
        if (!daysRes.ok) throw new Error('days');
        const daysData: DietDay[] = await daysRes.json();

        // Fetch meals per day in parallel
        const withMeals = await Promise.all(
          daysData.map(async (day) => {
            const mRes = await fetch(`/api/diet-days/${day.id}/meals`, { headers });
            const meals: DietMeal[] = mRes.ok ? await mRes.json() : [];
            return { ...day, meals };
          }),
        );

        setDays(withMeals);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const mealLabel = (mt: MealType) => mealTypeLabels[mt][locale];

  // Group meals by type for a day
  const groupByType = (meals: DietMeal[]) => {
    const map: Record<MealType, DietMeal[]> = { breakfast: [], lunch: [], dinner: [], snack: [] };
    for (const m of meals) map[m.meal_type]?.push(m);
    return map;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{t.diet.title}</h1>
        <p className="text-sm text-gray-500">{t.diet.subtitle}</p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-500 text-center py-8">{t.diet.noData}</p>
      )}

      {!loading && !error && days.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-12">{t.diet.noData}</p>
      )}

      {days.map((day) => {
        const grouped = groupByType(day.meals);
        return (
          <section
            key={day.id}
            className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden"
          >
            {/* Day header */}
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">{day.label}</h2>
            </div>

            <div className="divide-y divide-gray-100">
              {MEAL_TYPES.map((mt) => {
                const meals = grouped[mt];
                if (meals.length === 0) return null;
                return (
                  <div key={mt} className="px-5 py-4 space-y-3">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {mealLabel(mt)}
                    </h3>
                    {meals.map((meal) => (
                      <div key={meal.id} className="space-y-1.5">
                        <p className="text-sm font-medium text-gray-900">{meal.title}</p>
                        {meal.ingredients && (
                          <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              {t.diet.ingredients}
                            </span>
                            <p className="text-sm text-gray-600 whitespace-pre-line mt-0.5">{meal.ingredients}</p>
                          </div>
                        )}
                        {meal.instructions && (
                          <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              {t.diet.instructions}
                            </span>
                            <p className="text-sm text-gray-600 whitespace-pre-line mt-0.5">{meal.instructions}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
