"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import StudentNavbar from "@/components/StudentNavbar";
import { getActiveVendors } from "@/services/firestore/vendor-service";
import { getMenuItems } from "@/services/firestore/menu-service";
import { addToCart, setCartVendorId } from "@/services/cart/cart-store";

type Vendor = {
  id: string;
  name: string;
};

type MenuItem = {
  id: string;
  name: string;
  category?: string;
  price: number;
  available: boolean;
};

export default function StorePage({ params }: { params: { storeId: string } }) {
  const vendorId = params.storeId;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadVendorMenu() {
      try {
        setLoading(true);
        const [vendors, items] = await Promise.all([
          getActiveVendors(),
          getMenuItems(vendorId),
        ]);

        setVendor((vendors as Vendor[]).find((item) => item.id === vendorId) ?? null);
        setMenuItems(items as MenuItem[]);
      } catch {
        setError("Unable to load vendor menu. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadVendorMenu();
  }, [vendorId]);

  function handleAdd(item: MenuItem) {
    setCartVendorId(vendorId);
    addToCart({
      itemId: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: 1,
    });
    setMessage(`${item.name} added to cart.`);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <StudentNavbar showBack={true} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{vendor?.name ?? "Vendor Menu"}</h1>
            <p className="mt-2 text-gray-600">
              Add available items from this vendor to your cart.
            </p>
          </div>
          <Link
            href="/student/cart"
            className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            View Cart
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading menu…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : menuItems.length === 0 ? (
          <p className="text-gray-600">No available items found for this vendor.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <ProductCard
                key={item.id}
                name={item.name}
                price={Number(item.price)}
                available={Boolean(item.available)}
                description={item.category}
                onAdd={() => handleAdd(item)}
              />
            ))}
          </div>
        )}

        {message ? (
          <div className="mt-8 rounded-2xl bg-green-50 p-4 text-green-700">{message}</div>
        ) : null}
      </main>
    </div>
  );
}
