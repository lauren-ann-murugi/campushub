import { useAuth as useAuthContext } from "../context/AuthContext";

/**
 * Re-export wrapper hook for consuming AuthContext
 */
export function useAuth() {
  return useAuthContext();
}