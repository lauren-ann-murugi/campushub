import { authService, ApiError } from "./authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function authFetch(endpoint, options = {}) {
  const token = authService.getToken();
  if (!token) throw new ApiError("No authentication token found", 401);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      data.detail || data.message || "Request failed",
      response.status,
      data
    );
  }

  return data;
}

export const userService = {
  /**
   * Fetch complete profile of logged in user
   */
  async getProfile() {
    return await authFetch("/users/profile");
  },

  /**
   * Update personal profile details
   * @param {Object} profileData
   */
  async updateProfile(profileData) {
    return await authFetch("/users/profile", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });
  },

  /**
   * Update security settings / password
   * @param {Object} passwordPayload - { currentPassword, newPassword }
   */
  async changePassword(passwordPayload) {
    return await authFetch("/users/change-password", {
      method: "POST",
      body: JSON.stringify(passwordPayload),
    });
  },

  /**
   * Upload user profile avatar image
   * @param {File} imageFile
   */
  async uploadAvatar(imageFile) {
    const token = authService.getToken();
    const formData = new FormData();
    formData.append("avatar", imageFile);

    const response = await fetch(`${API_BASE_URL}/users/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(data.detail || "Failed to upload avatar", response.status);
    }
    return data;
  },
};