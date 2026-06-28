import type { User as FirebaseUser } from "firebase/auth";

import { getUser } from "@/services/firestore/user-service";
import { getVendorByUid } from "@/services/firestore/vendor-service";
import { getAdminByUid } from "@/services/firestore/admin-service";

export type AppRole = "student" | "vendor" | "admin";

export interface ResolvedRole {
  role: AppRole | null;
  user: FirebaseUser | null;
  vendorId?: string;
}

export function getDashboardPath(role: AppRole | null) {
  switch (role) {
    case "student":
      return "/student/dashboard";
    case "vendor":
      return "/vendor/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/login";
  }
}

export async function resolveUserRole(
  firebaseUser: FirebaseUser | null
): Promise<ResolvedRole> {
  if (!firebaseUser) {
    return { role: null, user: null };
  }

  const adminDoc = await getAdminByUid(firebaseUser.uid);
  if (adminDoc) {
    return { role: "admin", user: firebaseUser };
  }

  const vendorDoc = await getVendorByUid(firebaseUser.uid);
  if (vendorDoc) {
    return {
      role: "vendor",
      user: firebaseUser,
      vendorId: vendorDoc.id,
    };
  }

  const studentDoc = await getUser(firebaseUser.uid);
  if (studentDoc?.role === "student") {
    return { role: "student", user: firebaseUser };
  }

  return { role: null, user: firebaseUser };
}
