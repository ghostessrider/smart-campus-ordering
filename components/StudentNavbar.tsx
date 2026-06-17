"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function StudentNavbar({ showBack = false }: { showBack?: boolean }) {
  const { totalItems } = useCart();

  return (
    <nav className="bg-white border-b border-gray-200 py-4 w-full flex justify-center">
      <div className="max-w-7xl mx-auto px-8 md:px-16 flex justify-between w-full items-center">
        {showBack ? (
          <Link href="/student/dashboard" className="text-blue-600 font-medium hover:underline">
            &larr; Back to Dashboard
          </Link>
        ) : (
          <h1 className="text-xl font-bold text-blue-600">Smart Campus</h1>
        )}
        <div className="flex items-center gap-4">
          <Link href="/student/orders" className="text-gray-600 font-medium hover:text-blue-600 transition-colors text-sm">
            Orders
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/student/cart" className="text-blue-600 font-bold hover:underline">
            Cart ({totalItems})
          </Link>
        </div>
      </div>
    </nav>
  );
}
