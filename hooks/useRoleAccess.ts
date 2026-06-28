"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";

import { auth } from "@/lib/firebase/auth";
import { resolveUserRole, type AppRole } from "@/services/auth/role-access";

export function useRoleAccess(requiredRole: AppRole) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      const resolved = await resolveUserRole(firebaseUser);
      setRole(resolved.role);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    role,
    loading,
    isAuthorized: role === requiredRole,
  };
}
