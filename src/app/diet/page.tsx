import { mockRecipes } from '@/lib/mockData';
import { Recipe } from '@/lib/types';

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">{recipe.title}</h3>
        
        {recipe.notes && (
          <p className="text-sm text-gray-600">{recipe.notes}</p>
        )}
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredients</h4>
          <ul className="space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Diet</h1>
        <p className="text-gray-600">Your saved recipes and meal ideas</p>
      </div>

      <div className="space-y-4">
        {mockRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
