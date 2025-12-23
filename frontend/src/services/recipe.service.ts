import axiosInstance from "../lib/axios";
import { Recipe } from "../types/recipe.type";
import { Pagination } from "../types/pagination.type";
import { ApiResponse } from "../types/api.type";

// Request types
interface CreateRecipeRequest {
  name: string;
  description: string;
  userId: number;
  areaId: number;
  categoryIds: number[];
  thumbnailImages?: File[];
  steps?: {
    order: number;
    description: string;
    images?: File[];
  }[];
  recipeIngredients?: {
    ingredientId: number;
    order: number;
    quantity: number;
    unit: string;
  }[];
}

interface UpdateRecipeRequest {
  name?: string;
  description?: string;
  areaId?: number;
  categoryIds?: number[];
  thumbnailImages?: File[];
  steps?: {
    order: number;
    description: string;
    images?: File[];
  }[];
  recipeIngredients?: {
    ingredientId: number;
    order: number;
    quantity: number;
    unit: string;
  }[];
}

interface GetRecipesRequest {
  page?: number;
  pageSize?: number;
}

interface FilterRecipesRequest {
  ingredientIds?: number[];
  categoryIds?: number[];
  areaIds?: number[];
  page?: number;
  pageSize?: number;
}

interface GetUserRecipesRequest {
  page?: number;
  pageSize?: number;
}

// Response data types
interface GetRecipesData {
  recipes: Recipe[];
  pagination: Pagination;
}

interface GetUserRecipesData {
  recipes: Recipe[];
  pagination: Pagination;
}

interface GetUserRecipesCountData {
  count: number;
}

// Response types
type CreateRecipeResponse = ApiResponse<Recipe>;
type GetRecipesResponse = ApiResponse<GetRecipesData>;
type GetRecipeResponse = ApiResponse<Recipe>;
type UpdateRecipeResponse = ApiResponse<Recipe>;
type DeleteRecipeResponse = ApiResponse<{ message: string }>;
type FilterRecipesResponse = ApiResponse<GetRecipesData>;
type VoteRecipeResponse = ApiResponse<{ message: string }>;
type UnvoteRecipeResponse = ApiResponse<{ message: string }>;
type GetUserRecipesResponse = ApiResponse<GetUserRecipesData>;
type GetUserRecipesCountResponse = ApiResponse<GetUserRecipesCountData>;

/**
 * Create a new recipe
 * @param data - Recipe creation data
 * @returns Promise with created recipe
 */
export const createRecipe = async (
  data: CreateRecipeRequest
): Promise<CreateRecipeResponse> => {
  // Convert to FormData for file uploads
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("userId", data.userId.toString());
  formData.append("areaId", data.areaId.toString());
  formData.append("categoryIds", JSON.stringify(data.categoryIds));

  if (data.thumbnailImages) {
    data.thumbnailImages.forEach((file) => {
      formData.append("thumbnailImages", file);
    });
  }

  if (data.steps) {
    formData.append("steps", JSON.stringify(data.steps.map(s => ({
      order: s.order,
      description: s.description
    }))));
    
    data.steps.forEach((step, stepIndex) => {
      if (step.images) {
        step.images.forEach((file) => {
          formData.append(`stepImages_${stepIndex}`, file);
        });
      }
    });
  }

  if (data.recipeIngredients) {
    formData.append("recipeIngredients", JSON.stringify(data.recipeIngredients));
  }

  const response = await axiosInstance.post<CreateRecipeResponse>(
    "/api/recipes",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Get all recipes with pagination
 * @param params - Pagination parameters (optional)
 * @returns Promise with recipes and pagination data
 */
export const getRecipes = async (
  params?: GetRecipesRequest
): Promise<GetRecipesResponse> => {
  const response = await axiosInstance.get<GetRecipesResponse>("/api/recipes", {
    params,
  });
  return response.data;
};

/**
 * Get recipe by ID
 * @param id - The recipe ID
 * @returns Promise with recipe data
 */
export const getRecipeById = async (id: number): Promise<GetRecipeResponse> => {
  const response = await axiosInstance.get<GetRecipeResponse>(
    `/api/recipes/${id}`
  );
  return response.data;
};

/**
 * Update recipe by ID
 * @param id - The recipe ID
 * @param data - Recipe update data
 * @returns Promise with updated recipe
 */
export const updateRecipe = async (
  id: number,
  data: UpdateRecipeRequest
): Promise<UpdateRecipeResponse> => {
  // Convert to FormData for file uploads
  const formData = new FormData();
  
  if (data.name) formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  if (data.areaId) formData.append("areaId", data.areaId.toString());
  if (data.categoryIds) formData.append("categoryIds", JSON.stringify(data.categoryIds));

  if (data.thumbnailImages) {
    data.thumbnailImages.forEach((file) => {
      formData.append("thumbnailImages", file);
    });
  }

  if (data.steps) {
    formData.append("steps", JSON.stringify(data.steps.map(s => ({
      order: s.order,
      description: s.description
    }))));
    
    data.steps.forEach((step, stepIndex) => {
      if (step.images) {
        step.images.forEach((file) => {
          formData.append(`stepImages_${stepIndex}`, file);
        });
      }
    });
  }

  if (data.recipeIngredients) {
    formData.append("recipeIngredients", JSON.stringify(data.recipeIngredients));
  }

  const response = await axiosInstance.put<UpdateRecipeResponse>(
    `/api/recipes/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Delete recipe by ID
 * @param id - The recipe ID
 * @returns Promise with success message
 */
export const deleteRecipe = async (
  id: number
): Promise<DeleteRecipeResponse> => {
  const response = await axiosInstance.delete<DeleteRecipeResponse>(
    `/api/recipes/${id}`
  );
  return response.data;
};

/**
 * Filter recipes by ingredients, categories, and areas
 * @param params - Filter and pagination parameters
 * @returns Promise with filtered recipes and pagination data
 */
export const filterRecipes = async (
  params: FilterRecipesRequest
): Promise<FilterRecipesResponse> => {
  const response = await axiosInstance.get<FilterRecipesResponse>(
    "/api/recipes/filter",
    { params }
  );
  return response.data;
};

/**
 * Vote for a recipe
 * @param id - The recipe ID
 * @returns Promise with success message
 */
export const voteRecipe = async (
  id: number
): Promise<VoteRecipeResponse> => {
  const response = await axiosInstance.post<VoteRecipeResponse>(
    `/api/recipes/${id}/vote`
  );
  return response.data;
};

/**
 * Remove vote from a recipe
 * @param id - The recipe ID
 * @returns Promise with success message
 */
export const unvoteRecipe = async (
  id: number
): Promise<UnvoteRecipeResponse> => {
  const response = await axiosInstance.delete<UnvoteRecipeResponse>(
    `/api/recipes/${id}/unvote`
  );
  return response.data;
};

/**
 * Get all recipes created by a specific user
 * @param userId - The ID of the user
 * @param params - Pagination parameters (optional)
 * @returns Promise with recipes and pagination data
 */
export const getUserRecipes = async (
  userId: number,
  params?: GetUserRecipesRequest
): Promise<GetUserRecipesResponse> => {
  const response = await axiosInstance.get<GetUserRecipesResponse>(
    `/api/users/${userId}/recipes`,
    { params }
  );
  return response.data;
};

/**
 * Get all recipes voted by a specific user
 * @param userId - The ID of the user
 * @param params - Pagination parameters (optional)
 * @returns Promise with recipes and pagination data
 */
export const getUserVotedRecipes = async (
  userId: number,
  params?: GetUserRecipesRequest
): Promise<GetUserRecipesResponse> => {
  const response = await axiosInstance.get<GetUserRecipesResponse>(
    `/api/users/${userId}/recipes/voted`,
    { params }
  );
  return response.data;
};

/**
 * Get total number of recipes created by a specific user
 * @param userId - The ID of the user
 * @returns Promise with the count of recipes
 */
export const getUserRecipesCount = async (
  userId: number
): Promise<GetUserRecipesCountResponse> => {
  const response = await axiosInstance.get<GetUserRecipesCountResponse>(
    `/api/users/${userId}/recipes/count`
  );
  return response.data;
};
