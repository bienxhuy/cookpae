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
 * Convert File to base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Create a new recipe
 * @param data - Recipe creation data
 * @returns Promise with created recipe
 */
export const createRecipe = async (
  data: CreateRecipeRequest
): Promise<CreateRecipeResponse> => {
  // Convert thumbnail images to base64
  let thumbnailImagesBase64: { data: string }[] | undefined;
  if (data.thumbnailImages) {
    const base64Promises = data.thumbnailImages.map(file => fileToBase64(file));
    const base64Strings = await Promise.all(base64Promises);
    thumbnailImagesBase64 = base64Strings.map(data => ({ data }));
  }

  // Convert step images to base64
  let stepsWithBase64: { order: number; description: string; images?: { data: string }[] }[] | undefined;
  if (data.steps) {
    stepsWithBase64 = await Promise.all(
      data.steps.map(async (step) => {
        let stepImagesBase64: { data: string }[] | undefined;
        if (step.images && step.images.length > 0) {
          const base64Promises = step.images.map(file => fileToBase64(file));
          const base64Strings = await Promise.all(base64Promises);
          stepImagesBase64 = base64Strings.map(data => ({ data }));
        }
        return {
          order: step.order,
          description: step.description,
          images: stepImagesBase64,
        };
      })
    );
  }

  // Prepare JSON payload
  const payload = {
    name: data.name,
    description: data.description,
    userId: data.userId,
    areaId: data.areaId,
    categoryIds: data.categoryIds,
    thumbnailImages: thumbnailImagesBase64,
    steps: stepsWithBase64,
    recipeIngredients: data.recipeIngredients,
  };

  const response = await axiosInstance.post<CreateRecipeResponse>(
    "/api/recipes",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
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
  // Convert thumbnail images to base64
  let thumbnailImagesBase64: { data: string }[] | undefined;
  if (data.thumbnailImages) {
    const base64Promises = data.thumbnailImages.map(file => fileToBase64(file));
    const base64Strings = await Promise.all(base64Promises);
    thumbnailImagesBase64 = base64Strings.map(data => ({ data }));
  }

  // Convert step images to base64
  let stepsWithBase64: { order: number; description: string; images?: { data: string }[] }[] | undefined;
  if (data.steps) {
    stepsWithBase64 = await Promise.all(
      data.steps.map(async (step) => {
        let stepImagesBase64: { data: string }[] | undefined;
        if (step.images && step.images.length > 0) {
          const base64Promises = step.images.map(file => fileToBase64(file));
          const base64Strings = await Promise.all(base64Promises);
          stepImagesBase64 = base64Strings.map(data => ({ data }));
        }
        return {
          order: step.order,
          description: step.description,
          images: stepImagesBase64,
        };
      })
    );
  }

  // Prepare JSON payload
  const payload: any = {};
  if (data.name) payload.name = data.name;
  if (data.description) payload.description = data.description;
  if (data.areaId) payload.areaId = data.areaId;
  if (data.categoryIds) payload.categoryIds = data.categoryIds;
  if (thumbnailImagesBase64) payload.thumbnailImages = thumbnailImagesBase64;
  if (stepsWithBase64) payload.steps = stepsWithBase64;
  if (data.recipeIngredients) payload.recipeIngredients = data.recipeIngredients;

  const response = await axiosInstance.put<UpdateRecipeResponse>(
    `/api/recipes/${id}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
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
