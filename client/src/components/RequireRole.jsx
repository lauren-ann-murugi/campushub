"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

const HOME_FOR_ROLE = {
  administrator: "/dashboard/administrator",
  teacher: "/dashboard/teacher",
  student: "/dashboard/student",
};

/** Keeps a dashboard route to the role it belongs to. */
export function RequireRole({ role, children }) {
  const router = useRouter();
  const { user, role: currentRole, loading } = useAuth();

  const wrongRole = Boolean(user && currentRole && currentRole !== role);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (wrongRole) {
      router.replace(HOME_FOR_ROLE[currentRole] || "/login");
    }
  }, [currentRole, loading, router, user, wrongRole]);

  if (loading || !user || wrongRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc]">
        <p className="text-sm text-[#6b7280]">Loading your portal…</p>
      </div>
    );
  }

  return children;
}

export default RequireRole;
