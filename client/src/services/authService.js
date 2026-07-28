const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

/**
 * Custom Error class for API response issues
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic JSON Fetch Wrapper with default headers & error handling
 */
async function apiFetch(endpoint, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      data.detail || data.message || "An unexpected error occurred.",
      response.status,
      data
    );
  }

  return data;
}

export const authService = {
  /**
   * Log in user with email and password
   * @param {Object} credentials - { email, password, role }
   */
  async login({ email, password, role }) {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    });

    // Data should have: { message, email, requires_verification, user }
    return data;
  },

  /**
   * Register a new user
   * @param {Object} userData - { name, email, password, role }
   */
  async register(userData) {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    // Data should have: { message, email, requires_verification }
    return data;
  },

  /**
   * Verify 6-digit code
   * @param {Object} payload - { email, code }
   */
  async verifyCode({ email, code }) {
    const data = await apiFetch("/auth/verify-code", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });

    if (data.access_token) {
      this.setToken(data.access_token);
    }

    // Data should have: { message, access_token, token_type, user }
    return data;
  },

  /**
   * Resend verification code
   * @param {string} email
   */
  async resendCode(email) {
    return await apiFetch("/auth/resend-code", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Get current authenticated user profile
   */
  async getCurrentUser() {
    return await apiFetch("/users/me");
  },

  /**
   * Clear session token & logout
   */
  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  },

  setToken(token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  },

  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },
};