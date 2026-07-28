"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Create Authentication Context
const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on initial page load
  useEffect(() => {
    async function initializeAuth() {
      try {
        const storedToken = localStorage.getItem("campushub_token");
        const storedUser = localStorage.getItem("campushub_user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Verify token validity with Python backend
          const res = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (res.ok) {
            const verifiedUser = await res.json();
            setUser(verifiedUser);
            localStorage.setItem("campushub_user", JSON.stringify(verifiedUser));
          } else {
            // Token expired or invalid
            logout();
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();
  }, []);

  // Login Function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid login credentials.");
      }

      // Save user & token in state and persistent storage
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("campushub_token", data.token);
      localStorage.setItem("campushub_user", JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("campushub_token");
    localStorage.removeItem("campushub_user");

    // Optional notification to backend
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook for consuming Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};