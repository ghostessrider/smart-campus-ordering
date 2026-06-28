"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Clock3, Info, ShoppingCart, Star, X } from "lucide-react";
import StudentNavbar from "@/components/StudentNavbar";
import { getMenuItems } from "@/services/firestore/menu-service";
import {
  addToCart,
  clearCart,
  getCart,
  getCartVendorId,
  setCartVendorId,
} from "@/services/cart/cart-store";
import { MenuItem } from "@/types/menu-item";

export default function VendorMenuPage() {
  const params = useParams();
  const vendorId = params.vendorId as string;

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pendingItem, setPendingItem] = useState<MenuItem | null>(null);

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

  function addItemToCart(item: MenuItem) {
    setCartVendorId(vendorId);
    addToCart({
      itemId: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: 1,
    });
    setMessage(`${item.name} added to cart.`);
  }

  function handleAdd(item: MenuItem) {
    const currentVendorId = getCartVendorId();
    const cartItems = getCart();

    if (cartItems.length > 0 && currentVendorId && currentVendorId !== vendorId) {
      setPendingItem(item);
      return;
    }

    addItemToCart(item);
  }

  function handleCancel() {
    setPendingItem(null);
  }

  function handleContinue() {
    if (!pendingItem) {
      return;
    }

    clearCart();
    addItemToCart(pendingItem);
    setPendingItem(null);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <StudentNavbar showBack={true} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-[0_25px_60px_-25px_rgba(15,23,42,0.9)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Smart Cow</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Food Menu</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                Browse dishes from this vendor and add them to your cart. Smart Cow keeps the ordering experience smooth and fast.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 text-slate-200 shadow-inner shadow-slate-950/20">
              <div className="flex items-center gap-3 text-slate-300">
                <ShoppingCart className="h-5 w-5 text-amber-300" />
                <span className="text-sm">One vendor per cart enforced</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                If your cart already contains items from another vendor, you can empty it before adding new items.
              </p>
            </div>
          </div>
        </section>

        {loading ? (
          <p className="text-slate-400">Loading menu items…</p>
        ) : error ? (
          <p className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</p>
        ) : menuItems.length === 0 ? (
          <p className="text-slate-400">No available items found for this vendor.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/40"
              >
                <div className="relative h-56 bg-slate-800">
                  {item.imageURL || item.image ? (
                    <img
                      src={item.imageURL || item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-800 text-slate-500">
                      <Info className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{item.name}</h2>
                      <p className="mt-2 text-sm uppercase tracking-[0.25em] text-slate-500">
                        {item.category || "General"}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-amber-300">₹{item.price}</p>
                  </div>

                  <p className="mt-4 min-h-[3rem] text-sm leading-6 text-slate-400">
                    {item.description || "Tasty dish ready for your order."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-950/80 px-3 py-2 text-slate-200">
                      <Clock3 className="h-4 w-4" />
                      {item.avgPrepTime ? `${item.avgPrepTime} mins` : "Prep time unknown"}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-950/80 px-3 py-2 text-slate-200">
                      <Star className="h-4 w-4 text-amber-400" />
                      {item.rating !== undefined ? item.rating.toFixed(1) : "No rating"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdd(item)}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {message ? (
          <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-200 shadow-inner shadow-emerald-900/20">
            <p className="text-sm">{message}</p>
          </div>
        ) : null}
      </main>

      {pendingItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-10">
          <div className="w-full max-w-xl rounded-[2rem] border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-slate-950/80">
            <div className="flex items-center gap-3 text-amber-300">
              <ShoppingCart className="h-6 w-6" />
              <h2 className="text-xl font-semibold text-white">Another vendor in cart</h2>
            </div>
            <p className="mt-4 text-slate-300">
              Your cart contains items from another vendor. Empty cart and continue?
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-100 hover:border-slate-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="inline-flex items-center justify-center rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300"
              >
                Continue
              </button>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-300"
            >
              <X className="h-4 w-4" />
              Keep existing cart
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
