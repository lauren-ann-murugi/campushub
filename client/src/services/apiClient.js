import { authService, ApiError } from "./authService";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function apiFetch(endpoint, options = {}) {
  const token = authService.getToken();
  if (!token) throw new ApiError("No authentication token found", 401);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      data.message || data.detail || "Request failed",
      response.status,
      data
    );
  }

  return data;
}

export function query(params = {}) {
  const search = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  ).toString();
  return search ? `?${search}` : "";
}

export { ApiError };
