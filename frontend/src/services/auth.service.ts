import axiosInstance from "@/lib/axios";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  status: string;
  data: {
    accessToken: string;
  };
}

/**
 * Register a new user
 */
export async function register(data: RegisterRequest): Promise<string> {
  const response = await axiosInstance.post<AuthResponse>(
    "/api/auth/register",
    data,
    { withCredentials: true }
  );
  return response.data.data.accessToken;
}

/**
 * Login user
 */
export async function login(data: LoginRequest): Promise<string> {
  const response = await axiosInstance.post<AuthResponse>(
    "/api/auth/login",
    data,
    { withCredentials: true }
  );
  return response.data.data.accessToken;
}

/**
 * Refresh access token using refresh token cookie
 */
export async function refreshAccessToken(): Promise<string> {
  const response = await axiosInstance.post<AuthResponse>(
    "/api/auth/refresh",
    {},
    { withCredentials: true }
  );
  return response.data.data.accessToken;
}

/**
 * Logout from current device
 */
export async function logout(): Promise<void> {
  await axiosInstance.post("/api/auth/logout", {}, { withCredentials: true });
}

/**
 * Logout from all devices
 */
export async function logoutAll(): Promise<void> {
  await axiosInstance.post("/api/auth/logout-all", {}, { withCredentials: true });
}
