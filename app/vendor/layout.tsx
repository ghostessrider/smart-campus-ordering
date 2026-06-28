"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LayoutGrid, UtensilsCrossed } from "lucide-react";

import { RoleRouteGuard } from "@/components/auth/RoleRouteGuard";

const NAV_ITEMS = [
  { href: "/vendor/dashboard", label: "Orders", icon: LayoutGrid },
  { href: "/vendor/menu", label: "Menu", icon: UtensilsCrossed },
];

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <RoleRouteGuard requiredRole="vendor">
      <div className="min-h-screen bg-[#0b0d10]">
        <nav className="border-b border-white/10 px-6 lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center gap-1 py-3">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-[#9aa3ae] hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon size={16} strokeWidth={1.75} />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>

        {children}
      </div>
    </RoleRouteGuard>
  );
}