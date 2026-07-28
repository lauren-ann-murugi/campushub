"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { authService } from "@/services/authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const defaultPresence = {
  avatarUrl: null,
  lastSeenAt: null,
  firstSeenAt: null,
  activeMinutes: 0,
  isOnline: false,
};

const AuthContext = createContext({
  session: null,
  user: null,
  role: null,
  loading: true,
  displayName: "",
  avatarUrl: null,
  presence: defaultPresence,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export function resolveDisplayName(user) {
  if (!user) return "";
  const first = user.first_name?.trim();
  const last = user.last_name?.trim();
  if (first && last) return `${first} ${last}`;
  if (first) return first;
  if (user.full_name) return user.full_name;
  if (user.email) return user.email.split("@")[0];
  return "";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [presence, setPresence] = useState(defaultPresence);
  const sessionStartRef = useRef(Date.now());

  const getAuthToken = () => authService.getToken() || "";

  // Fetch current user and profile from FastAPI
  const loadProfileData = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setUser(data.user || data);
      setRole(data.role || data.user?.role || "student");
      setAvatarUrl(data.avatar_url || data.user?.avatar_url || null);
      setPresence({
        avatarUrl: data.avatar_url || null,
        lastSeenAt: data.last_seen_at || null,
        firstSeenAt: data.first_seen_at || null,
        activeMinutes: data.active_minutes || 0,
        isOnline: data.is_online ?? true,
      });
    } catch (err) {
      console.error("Failed to load user session:", err);
      authService.logout();
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = async () => {
    await loadProfileData();
  };

  // Heartbeat update to FastAPI
  const sendHeartbeat = useCallback(async (isOnline = true) => {
    const token = getAuthToken();
    if (!token) return;

    const elapsedMin = Math.round((Date.now() - sessionStartRef.current) / 60000);
    try {
      await fetch(`${API_BASE_URL}/auth/heartbeat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_online: isOnline,
          active_minutes: elapsedMin,
          last_seen_at: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Heartbeat update failed:", err);
    }
  }, []);

  useEffect(() => {
    loadProfileData();

    // Send heartbeat every 60 seconds
    const interval = setInterval(() => {
      sendHeartbeat(true);
    }, 60000);

    const handleVisibility = () => {
      if (document.hidden) {
        sendHeartbeat(false);
      } else {
        sendHeartbeat(true);
      }
    };

    const handleBeforeUnload = () => {
      sendHeartbeat(false);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      sendHeartbeat(false);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [loadProfileData, sendHeartbeat]);

  const signOut = async () => {
    await sendHeartbeat(false);
    authService.logout();
    setUser(null);
    setRole(null);
    setAvatarUrl(null);
    setPresence(defaultPresence);
  };

  const displayName = resolveDisplayName(user);

  return (
    <AuthContext.Provider
      value={{
        session: user ? { user } : null,
        user,
        role,
        loading,
        displayName,
        avatarUrl,
        presence,
        refreshProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function formatLastSeen(lastSeenAt) {
  if (!lastSeenAt) return "Never";
  const date = new Date(lastSeenAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatActiveDuration(minutes) {
  if (!minutes || minutes < 0) return "0m";
  if (minutes < 60) return `${minutes}m`;
  const hr = Math.floor(minutes / 60);
  const min = minutes % 60;
  if (hr < 24) return min > 0 ? `${hr}h ${min}m` : `${hr}h`;
  const days = Math.floor(hr / 24);
  const remHr = hr % 24;
  return remHr > 0 ? `${days}d ${remHr}h` : `${days}d`;
}