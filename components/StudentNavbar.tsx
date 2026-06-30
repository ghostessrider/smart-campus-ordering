"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface StudentNavbarProps {
  showBack?: boolean;
}

export default function StudentNavbar({ showBack }: StudentNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-white/5 bg-[#12151a]/60 backdrop-blur-md sticky top-0 z-50 text-slate-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {showBack ? (
            <Link
              href="/student/dashboard"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-[#9aa3ae] hover:bg-white/10 hover:text-white transition-colors"
            >
              Back
            </Link>
          ) : null}
          <Link
            href="/student/dashboard"
            className="text-lg font-bold text-white tracking-tight"
          >
            Smart Campus Ordering
          </Link>
        </div>

        {/* Desktop Menu - Home link removed, properly themed */}
        <div className="hidden items-center gap-6 md:flex text-sm font-semibold text-[#9aa3ae]">
          <Link href="/student/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <Link href="/student/orders" className="hover:text-white transition-colors">Orders</Link>
          <Link href="/student/profile" className="hover:text-white transition-colors">Profile</Link>
        </div>

        <button
          className="md:hidden text-[#9aa3ae] hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - Cleaned up and properly themed */}
      {isOpen && (
        <div className="flex flex-col gap-4 border-t border-white/5 bg-[#0b0d10] px-6 py-5 md:hidden text-sm font-semibold text-[#9aa3ae]">
          <Link href="/student/dashboard" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Dashboard</Link>
          <Link href="/student/orders" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Orders</Link>
          <Link href="/student/profile" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Profile</Link>
        </div>
      )}
    </nav>
  );
}