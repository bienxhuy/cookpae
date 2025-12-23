import axiosInstance from "../lib/axios";
import { Area } from "../types/area.type";
import { ApiResponse } from "../types/api.type";
import { Pagination } from "../types/pagination.type";

// Request types
interface CreateAreaRequest {
  name: string;
}

interface UpdateAreaRequest {
  name: string;
}

interface GetAreasRequest {
  page?: number;
  pageSize?: number;
}

// Response data types
interface GetAreasData {
  areas: Area[];
  pagination: Pagination;
}

// Response types
type CreateAreaResponse = ApiResponse<Area>;
type GetAreasResponse = ApiResponse<GetAreasData>;
type GetAreaResponse = ApiResponse<Area>;
type UpdateAreaResponse = ApiResponse<Area>;
type ActivateAreaResponse = ApiResponse<{ message: string }>;
type DeactivateAreaResponse = ApiResponse<{ message: string }>;

/**
 * Create a new area
 * @param data - Area creation data
 * @returns Promise with created area
 */
export const createArea = async (
  data: CreateAreaRequest
): Promise<CreateAreaResponse> => {
  const response = await axiosInstance.post<CreateAreaResponse>(
    "/api/areas",
    data
  );
  return response.data;
};

/**
 * Get all areas with pagination
 * @param params - Pagination parameters (optional)
 * @returns Promise with areas and pagination data
 */
export const getAreas = async (
  params?: GetAreasRequest
): Promise<GetAreasResponse> => {
  const response = await axiosInstance.get<GetAreasResponse>("/api/areas", {
    params,
  });
  return response.data;
};

/**
 * Get area by ID
 * @param id - The area ID
 * @returns Promise with area data
 */
export const getAreaById = async (id: number): Promise<GetAreaResponse> => {
  const response = await axiosInstance.get<GetAreaResponse>(
    `/api/areas/${id}`
  );
  return response.data;
};

/**
 * Update area by ID
 * @param id - The area ID
 * @param data - Area update data
 * @returns Promise with updated area
 */
export const updateArea = async (
  id: number,
  data: UpdateAreaRequest
): Promise<UpdateAreaResponse> => {
  const response = await axiosInstance.put<UpdateAreaResponse>(
    `/api/areas/${id}`,
    data
  );
  return response.data;
};

/**
 * Activate area by ID
 * @param id - The area ID
 * @returns Promise with success message
 */
export const activateArea = async (
  id: number
): Promise<ActivateAreaResponse> => {
  const response = await axiosInstance.patch<ActivateAreaResponse>(
    `/api/areas/${id}/activate`
  );
  return response.data;
};

/**
 * Deactivate area by ID
 * @param id - The area ID
 * @returns Promise with success message
 */
export const deactivateArea = async (
  id: number
): Promise<DeactivateAreaResponse> => {
  const response = await axiosInstance.patch<DeactivateAreaResponse>(
    `/api/areas/${id}/deactivate`
  );
  return response.data;
};
