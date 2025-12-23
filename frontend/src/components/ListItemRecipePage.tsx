import React from 'react';
import FoodCard2 from './FoodCard2'; 
import NotificationCard from './NotificationCard';
type NotificationItem = {
  id: number;
  title: string;
  message: string;
  time: string;
};

type IngredientItem = {
  id: number;
  title: string;
  description: string;
};

type RecipeItem = {
  id: number;
  title: string;
  description?: string;
  author: string;
  likes: number;
  imageUrl?: string;
};

type ListItem = RecipeItem | NotificationItem | IngredientItem ;

interface ListItemRecipePageProps {
  item: ListItem;
  type: 'recipe' | 'notification' | 'ingredient';
}


const ListItemRecipePage: React.FC<ListItemRecipePageProps> = ({ item, type }) => {
  if (type === 'recipe') {
    const recipe = item as RecipeItem;
    return (
      <FoodCard2
        title={recipe.title}
        author={recipe.author}
        likes={recipe.likes}
        description={recipe.description}
        imageUrl={recipe.imageUrl}
      />
    );
  }

  if (type === 'notification') {
    const noti = item as NotificationItem;
    const match = noti.title.match(/^(.+?) likes your recipe: (.+)$/);
    const username = match ? match[1] : 'Ai đó';
    const recipeTitle = match ? match[2] : 'công thức của bạn';

    return (
      <NotificationCard
        username={username}
        action="likes your recipe"
        recipeTitle={recipeTitle}
        timeAgo={noti.time}
      />
    );
  }

  if (type === 'ingredient') {
    const ing = item as IngredientItem;
    return (
      <div className="rounded-2xl border-2 border-gray-800 bg-white p-5 hover:shadow-lg transition-shadow">
        <h3 className="font-bold text-gray-900 mb-2">{ing.title}</h3>
        <p className="text-sm text-gray-600">{ing.description}</p>
      </div>
    );
  }

  return null;
};

export default ListItemRecipePage;