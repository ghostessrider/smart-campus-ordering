"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudentNavbar from "@/components/StudentNavbar";
import { getMenuItems } from "@/services/firestore/menu-service";
import { addToCart, setCartVendorId } from "@/services/cart/cart-store";

type MenuItem = {
  id: string;
  name: string;
  category?: string;
  price: number;
  available?: boolean;
};

export default function VendorMenuPage() {
  const params = useParams();
  const vendorId = params.vendorId as string;

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadMenu() {
      try {
        setLoading(true);
        const items = await getMenuItems(vendorId);
        setMenuItems(items as MenuItem[]);
      } catch {
        setError("Unable to load menu items. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (vendorId) {
      loadMenu();
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Vendor Menu</h1>
          <p className="mt-2 text-gray-600">
            Browse available items and add them to your cart.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading menu items…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : menuItems.length === 0 ? (
          <p className="text-gray-600">No available items found for this vendor.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-slate-900">{item.name}</h2>
                <p className="mt-3 text-sm text-slate-500">Category: {item.category || "General"}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">₹{item.price}</p>
                <button
                  type="button"
                  onClick={() => handleAdd(item)}
                  className="mt-6 inline-flex w-full justify-center rounded-3xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
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
