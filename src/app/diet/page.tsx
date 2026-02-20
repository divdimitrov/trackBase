'use client';

import { mockRecipes, type MockRecipe } from '@/lib/mockData';
import { useLanguage } from '@/components/LanguageProvider';

function RecipeCard({ recipe, ingredientsLabel }: { recipe: MockRecipe; ingredientsLabel: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {recipe.media?.imageUrl && (
        <div className="aspect-video relative bg-gray-100">
          <img
            src={recipe.media.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          {recipe.media.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="p-4 sm:p-5 space-y-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{recipe.title}</h3>
        
        {recipe.notes && (
          <p className="text-sm text-gray-500 leading-relaxed">{recipe.notes}</p>
        )}
        
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{ingredientsLabel}</h4>
          <ul className="space-y-1.5">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-gray-300 mt-0.5">•</span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function DietPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{t.diet.title}</h1>
        <p className="text-sm text-gray-500">{t.diet.subtitle}</p>
      </div>

      <div className="space-y-4">
        {mockRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} ingredientsLabel={t.diet.ingredients} />
        ))}
      </div>
    </div>
  );
}
