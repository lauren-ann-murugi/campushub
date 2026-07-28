import { authService, ApiError } from "./authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function adminFetch(endpoint, options = {}) {
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

export const adminService = {
  async getSettings() {
    const data = await adminFetch("/admin/settings");
    return data.settings ?? data;
  },

  async updateSettings(settings) {
    const data = await adminFetch("/admin/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
    return data.settings ?? data;
  },

  async changePassword({ currentPassword, newPassword }) {
    return await adminFetch("/users/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};
