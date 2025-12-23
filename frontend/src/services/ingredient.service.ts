import axiosInstance from "../lib/axios";
import { Ingredient } from "../types/ingredient.type";
import { ApiResponse } from "../types/api.type";
import { Pagination } from "../types/pagination.type";

// Request types
interface CreateIngredientRequest {
  name: string;
}

interface UpdateIngredientRequest {
  name: string;
}

interface GetIngredientsRequest {
  page?: number;
  pageSize?: number;
}

// Response data types
interface GetIngredientsData {
  ingredients: Ingredient[];
  pagination: Pagination;
}

// Response types
type CreateIngredientResponse = ApiResponse<Ingredient>;
type GetIngredientsResponse = ApiResponse<GetIngredientsData>;
type GetIngredientResponse = ApiResponse<Ingredient>;
type UpdateIngredientResponse = ApiResponse<Ingredient>;

/**
 * Create a new ingredient
 * @param data - Ingredient creation data
 * @returns Promise with created ingredient
 */
export const createIngredient = async (
  data: CreateIngredientRequest
): Promise<CreateIngredientResponse> => {
  const response = await axiosInstance.post<CreateIngredientResponse>(
    "/api/ingredients",
    data
  );
  return response.data;
};

/**
 * Get all ingredients with pagination
 * @param params - Pagination parameters (optional)
 * @returns Promise with ingredients and pagination data
 */
export const getIngredients = async (
  params?: GetIngredientsRequest
): Promise<GetIngredientsResponse> => {
  const response = await axiosInstance.get<GetIngredientsResponse>(
    "/api/ingredients",
    { params }
  );
  return response.data;
};

/**
 * Get ingredient by ID
 * @param id - The ingredient ID
 * @returns Promise with ingredient data
 */
export const getIngredientById = async (
  id: number
): Promise<GetIngredientResponse> => {
  const response = await axiosInstance.get<GetIngredientResponse>(
    `/api/ingredients/${id}`
  );
  return response.data;
};

/**
 * Update ingredient by ID
 * @param id - The ingredient ID
 * @param data - Ingredient update data
 * @returns Promise with updated ingredient
 */
export const updateIngredient = async (
  id: number,
  data: UpdateIngredientRequest
): Promise<UpdateIngredientResponse> => {
  const response = await axiosInstance.put<UpdateIngredientResponse>(
    `/api/ingredients/${id}`,
    data
  );
  return response.data;
};
