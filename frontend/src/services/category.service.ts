import axiosInstance from "../lib/axios";
import { Category } from "../types/category.type";
import { ApiResponse } from "../types/api.type";
import { Pagination } from "../types/pagination.type";

// Request types
interface CreateCategoryRequest {
  name: string;
}

interface UpdateCategoryRequest {
  name: string;
}

interface GetCategoriesRequest {
  page?: number;
  pageSize?: number;
}

// Response data types
interface GetCategoriesData {
  categories: Category[];
  pagination: Pagination;
}

// Response types
type CreateCategoryResponse = ApiResponse<Category>;
type GetCategoriesResponse = ApiResponse<GetCategoriesData>;
type GetCategoryResponse = ApiResponse<Category>;
type UpdateCategoryResponse = ApiResponse<Category>;
type ActivateCategoryResponse = ApiResponse<{ message: string }>;
type DeactivateCategoryResponse = ApiResponse<{ message: string }>;

/**
 * Create a new category
 * @param data - Category creation data
 * @returns Promise with created category
 */
export const createCategory = async (
  data: CreateCategoryRequest
): Promise<CreateCategoryResponse> => {
  const response = await axiosInstance.post<CreateCategoryResponse>(
    "/api/categories",
    data
  );
  return response.data;
};

/**
 * Get all categories with pagination
 * @param params - Pagination parameters (optional)
 * @returns Promise with categories and pagination data
 */
export const getCategories = async (
  params?: GetCategoriesRequest
): Promise<GetCategoriesResponse> => {
  const response = await axiosInstance.get<GetCategoriesResponse>(
    "/api/categories",
    { params }
  );
  return response.data;
};

/**
 * Get category by ID
 * @param id - The category ID
 * @returns Promise with category data
 */
export const getCategoryById = async (
  id: number
): Promise<GetCategoryResponse> => {
  const response = await axiosInstance.get<GetCategoryResponse>(
    `/api/categories/${id}`
  );
  return response.data;
};

/**
 * Update category by ID
 * @param id - The category ID
 * @param data - Category update data
 * @returns Promise with updated category
 */
export const updateCategory = async (
  id: number,
  data: UpdateCategoryRequest
): Promise<UpdateCategoryResponse> => {
  const response = await axiosInstance.put<UpdateCategoryResponse>(
    `/api/categories/${id}`,
    data
  );
  return response.data;
};

/**
 * Activate category by ID
 * @param id - The category ID
 * @returns Promise with success message
 */
export const activateCategory = async (
  id: number
): Promise<ActivateCategoryResponse> => {
  const response = await axiosInstance.patch<ActivateCategoryResponse>(
    `/api/categories/${id}/activate`
  );
  return response.data;
};

/**
 * Deactivate category by ID
 * @param id - The category ID
 * @returns Promise with success message
 */
export const deactivateCategory = async (
  id: number
): Promise<DeactivateCategoryResponse> => {
  const response = await axiosInstance.patch<DeactivateCategoryResponse>(
    `/api/categories/${id}/deactivate`
  );
  return response.data;
};
