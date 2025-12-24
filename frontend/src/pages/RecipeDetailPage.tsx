import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRecipeById, voteRecipe, unvoteRecipe } from '../services/recipe.service';
import { Recipe } from '../types/recipe.type';
import { Button } from '../components/ui/button';
import { ArrowBigLeft, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getRecipeById(Number(id))
      .then(res => setRecipe(res.data))
      .catch(() => setError('Failed to load recipe'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleVote = async () => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }
    
    if (!recipe || !id) return;
    
    setIsVoting(true);
    
    try {
      if (hasVoted) {
        await unvoteRecipe(Number(id));
        toast.success('Vote removed successfully');
      } else {
        await voteRecipe(Number(id));
        toast.success('Voted successfully');
      }
      
      // Refresh recipe data
      const response = await getRecipeById(Number(id));
      setRecipe(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to vote');
    } finally {
      setIsVoting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!recipe) return null;

  const hasVoted = user && recipe.votedUserIds?.includes(Number(user.id));
  console.log(user);

  const formatDateTime = (date: string) => {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-4 sm:px-8 bg-white min-h-screen border-l border-r">
      {/* Header with back button and title */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="size-5 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowBigLeft />
        </Button>
        <h1 className="text-2xl font-bold flex-1 text-[var(--dark-blue)] break-words">{recipe.name}</h1>
      </div>

      {/* Metadata */}
      <div className="mb-4 space-y-1">
        <div className="text-sm text-[var(--dark-blue)]">
          by {recipe.user.name}
        </div>
        <div className="text-sm text-gray-500">
          {formatDateTime(recipe.createdAt)}
        </div>
        <div className="flex items-center gap-1.5">
          <Heart size={16} fill={hasVoted ? "#ef4444" : "none"} stroke="#ef4444" />
          <span className="text-sm font-semibold text-[var(--dark-blue)]">
            {recipe.votedUserIds?.length || 0}
          </span>
        </div>
      </div>

      {/* Area and category tags */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {recipe.area && (
          <span className="px-3 py-1 rounded-full bg-[var(--shine-yellow)] text-[var(--dark-blue)] text-xs font-medium">
            {recipe.area.name}
          </span>
        )}
        {recipe.categories && recipe.categories.length > 0 && recipe.categories.map(c => (
          <span
            key={c.id}
            className="px-3 py-1 rounded-full border-2 border-[var(--dark-blue)] text-[var(--dark-blue)] text-xs font-medium"
          >
            {c.name}
          </span>
        ))}
      </div>

      {/* Description and thumbnail */}
      <div className="mb-6">
        <p className="mb-4 text-[var(--dark-blue)] text-sm leading-relaxed">
          {recipe.description}
        </p>
        {recipe.thumbnails && recipe.thumbnails[0] && (
          <div className="flex justify-center mb-6">
            <img
              src={recipe.thumbnails[0].url}
              alt={recipe.name}
              className="rounded-2xl object-cover w-full border-2 border-[var(--dark-blue-light)]"
            />
          </div>
        )}
      </div>

      {/* Ingredients section */}
      <div className="mb-6">
        <h2 className="font-bold text-lg mb-3 text-[var(--dark-blue)]">Ingredients</h2>
        <ul className="space-y-1">
          {recipe.recipeIngredients
            .sort((a, b) => a.order - b.order)
            .map(ri => (
              <li key={ri.id} className="text-[var(--dark-blue)] text-sm flex items-start">
                <span className="mr-2">•</span>
                <span>
                  {ri.ingredient.name} - <span className="text-gray-600">{ri.quantity} {ri.unit}</span>
                </span>
              </li>
            ))}
        </ul>
      </div>

      {/* Steps section */}
      <div className="mb-8">
        <h2 className="font-bold text-lg mb-3 text-[var(--dark-blue)]">Steps</h2>
        <div className="space-y-4">
          {recipe.steps.sort((a, b) => a.order - b.order).map((step) => (
            <div key={step.id} className="space-y-2">
              <p className="text-[var(--dark-blue)] text-sm leading-relaxed">
                {step.description}
              </p>
              {step.attachments && step.attachments.length > 0 && (
                <div className="rounded-2xl bg-[var(--shine-yellow)] p-4 h-40 flex items-center justify-center border-2 border-[var(--shine-yellow-dark)]">
                  <img
                    src={step.attachments[0].url}
                    alt={`Step ${step.order}`}
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Vote section */}
      <div className="mb-8 text-center">
        <h3 className="font-bold text-base mb-3 text-[var(--dark-blue)]">Was this helpful?</h3>
        <Button
          variant="outline"
          className="border-2 border-[var(--dark-blue)] text-[var(--dark-blue)] hover:bg-[var(--dark-blue)] hover:text-white font-semibold px-8 py-2 rounded-full cursor-pointer"
          onClick={handleVote}
          disabled={isVoting}
        >
          {isVoting ? 'Loading...' : hasVoted ? 'Unvote' : 'Vote'}
        </Button>
      </div>
    </div>
  );
}
