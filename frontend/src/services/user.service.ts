// User service functions to call API
import axiosInstance from "@/lib/axios";
import { BaseUser } from "@/types/user.type";

// Fetch all users
export async function fetchUsers(): Promise<BaseUser[]> {
  const response = await axiosInstance.get<BaseUser[]>("/api/users");
  return response.data;
}

// Fetch single user by ID
export async function fetchUserById(id: string): Promise<BaseUser> {
  const response = await axiosInstance.get<BaseUser>(`/api/users/${id}`);
  return response.data;
}

// Create new user
export async function createUser(userData: Omit<BaseUser, "id">): Promise<BaseUser> {
  const response = await axiosInstance.post<BaseUser>("/api/users", userData);
  return response.data;
}

// Update user
export async function updateUser(id: string, userData: Partial<BaseUser>): Promise<BaseUser> {
  const response = await axiosInstance.put<BaseUser>(`/api/users/${id}`, userData);
  return response.data;
}

// Delete user
export async function deleteUser(id: string): Promise<void> {
  await axiosInstance.delete(`/api/users/${id}`);
}