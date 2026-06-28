"use client";

import { RoleRouteGuard } from "@/components/auth/RoleRouteGuard";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleRouteGuard requiredRole="student">{children}</RoleRouteGuard>;
}
