import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRecipeById } from '../services/recipe.service';
import { Recipe } from '../types/recipe.type';
import { Button } from '../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getRecipeById(Number(id))
      .then(res => setRecipe(res.data))
      .catch(() => setError('Failed to load recipe'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!recipe) return null;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white min-h-screen">
      
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" className="bg-blue-900 mr-2" onClick={() => navigate(-1)}>
          <span className="text-2xl font-bold text-white mb-1">←</span>
        </Button>
        <h1 className="text-2xl font-bold flex-1 text-black break-words">{recipe.name}</h1>
      </div>
      <div className="flex items-center mb-2 flex-wrap gap-2 justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Avatar>
            <AvatarImage src={undefined} alt={recipe.user.name} />
            <AvatarFallback>{recipe.user.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-blue-900">by {recipe.user.name}</span>
          <span className="text-xs text-gray-400 ml-2">{new Date(recipe.createdAt).toLocaleDateString()}</span>
        </div>
        
        <span className="inline-flex items-center gap-1 text-lg font-semibold ml-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="#ef4444" viewBox="0 0 24 24" stroke="#ef4444" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          0
        </span>
      </div>
      
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {recipe.area && (
          <button className="px-2 py-1 rounded-full border text-yellow-900 border-yellow-900 text-xs hover:bg-yellow-100 transition-colors cursor-pointer">
            {recipe.area.name}
          </button>
        )}
        {recipe.categories && recipe.categories.length > 0 && recipe.categories.map(c => (
          <button key={c.id} className="px-2 py-1 rounded-full border text-blue-900 border-blue-900 text-xs hover:bg-blue-100 transition-colors cursor-pointer">
            {c.name}
          </button>
        ))}
      </div>
      
      <div className="mb-4">
        <p className="mb-2 text-black text-base md:text-lg break-words text-center">{recipe.description}</p>
        {recipe.thumbnails && recipe.thumbnails[0] && (
          <div className="flex justify-center">
            <img src={recipe.thumbnails[0].url} alt={recipe.name} className="rounded-xl object-cover w-full max-w-md h-56 md:h-72" />
          </div>
        )}
      </div>
      <div className="mb-4">
        <h2 className="font-semibold mb-2 text-blue-900">Ingredients</h2>
        <ul className="list-disc list-inside">
          {recipe.recipeIngredients.map(ri => (
            <li key={ri.id}>{ri.ingredient.name} <span className="text-gray-500">({ri.quantity} {ri.unit})</span></li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold mb-2 text-blue-900">Steps</h2>
        <ol className="list-decimal list-inside">
          {recipe.steps.sort((a, b) => a.order - b.order).map(step => (
            <li key={step.id} className="mb-1">{step.description}</li>
          ))}
        </ol>
      </div>
      
      <div className="flex gap-4 mt-8 justify-center">
        <Button variant="outline" className="text-black border-black border-2 font-bold px-6 py-2">Vote</Button>
        <Button variant="default" className="bg-blue-900 text-white font-bold px-6 py-2">Add to Favourite</Button>
      </div>
    </div>
  );
}
