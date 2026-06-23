"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-xl font-bold"
        >
          Smart Campus Ordering
        </Link>

        <div className="hidden gap-6 md:flex">
          <Link href="/">Home</Link>
          <Link href="/student">Student</Link>
          <Link href="/vendor">Vendor</Link>
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