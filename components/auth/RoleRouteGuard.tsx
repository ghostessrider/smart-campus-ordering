"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useRoleAccess } from "@/hooks/useRoleAccess";
import { getDashboardPath, type AppRole } from "@/services/auth/role-access";

export function RoleRouteGuard({
  requiredRole,
  children,
}: {
  requiredRole: AppRole;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, role, loading, isAuthorized } = useRoleAccess(requiredRole);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!isAuthorized) {
      router.replace(getDashboardPath(role));
    }
  }, [isAuthorized, loading, role, router, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0d10] text-[#9aa3ae]">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Checking access…</span>
        </div>
      </div>
    );
  }

  if (!user || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
