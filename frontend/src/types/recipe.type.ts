import { BaseUser } from './user.type';
import { Area } from './area.type';
import { Category } from './category.type';
import { Attachment } from './attachment.type';
import { Step } from './step.type';
import { Ingredient } from './ingredient.type';

export interface RecipeIngredient {
  id: number;
  order: number;
  quantity: number;
  unit: string;
  ingredient: Ingredient;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  user: BaseUser;
  area: Area;
  categories: Category[];
  thumbnails: Attachment[];
  steps: Step[];
  recipeIngredients: RecipeIngredient[];
  createdAt: string;
  updatedAt: string;
}
