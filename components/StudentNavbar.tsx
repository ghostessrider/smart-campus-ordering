"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface StudentNavbarProps {
  showBack?: boolean;
}

export default function Navbar({ showBack }: StudentNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            {showBack ? (
              <Link
                href="/student/dashboard"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Back
              </Link>
            ) : null}
            <Link
              href="/"
              className="text-xl font-bold"
            >
              Smart Campus Ordering
            </Link>
          </div>

          <div className="hidden gap-6 md:flex">
            <Link href="/">Home</Link>
            <Link href="/student/dashboard">Student</Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-3 border-t px-4 py-4 md:hidden">
          <Link href="/">Home</Link>
          <Link href="/student">Student</Link>
          <Link href="/vendor">Vendor</Link>
        </div>
      )}
    </nav>
  );
}