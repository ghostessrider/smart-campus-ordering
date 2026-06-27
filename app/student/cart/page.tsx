"use client";
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  X,
} from "lucide-react";
import {
  CartItem,
  getCart,
  getCartVendorId,
  updateCartQuantity,
  removeCartItem,
  clearCart,
} from "@/services/cart/cart-store";
import { createOrder } from "@/services/firestore/order-service";
import { auth } from "@/lib/firebase/auth";
import { getVendorById } from "@/services/firestore/vendor-service";

export default function StudentCartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>(getCart());
  const [vendorId, setVendorId] = useState<string | null>(getCartVendorId());
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [vendorName, setVendorName] = useState<string | null>(null);
  const [vendorLoading, setVendorLoading] = useState(false);

  function refresh() {
    setCart([...getCart()]);
    setVendorId(getCartVendorId());
  }

  useEffect(() => {
    let mounted = true;
    async function loadVendor() {
      if (!vendorId) {
        if (mounted) setVendorName(null);
        return;
      }

      setVendorLoading(true);
      const v = await getVendorById(vendorId);
      if (!mounted) return;
      setVendorName(v?.name ?? null);
      setVendorLoading(false);
    }

    void loadVendor();

    return () => {
      mounted = false;
    };
  }, [vendorId]);

  function increase(item: CartItem) {
    updateCartQuantity(item.itemId, item.quantity + 1);
    refresh();
  }

  function decrease(item: CartItem) {
    if (item.quantity <= 1) return;
    updateCartQuantity(item.itemId, item.quantity - 1);
    refresh();
  }

  function removeItem(item: CartItem) {
    removeCartItem(item.itemId);
    refresh();
  }

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  async function handlePlaceOrder() {
    const user = auth.currentUser;
    if (!user) {
      setMessage("Please sign in to place an order.");
      return;
    }

    if (!vendorId) {
      setMessage("Please select a vendor before placing an order.");
      return;
    }

    const payload = {
      userId: user.uid,
      vendorId,
      items: cart.map((c) => ({ itemId: c.itemId, name: c.name, price: c.price, quantity: c.quantity })),
      total,
      status: "pending",
      paymentStatus: "pending",
    } as const;

    try {
      setPlacing(true);
      await createOrder(payload);
      clearCart();
      router.push("/student/orders");
    } catch (err) {
      if (err instanceof Error) setMessage(err.message);
      else setMessage("Unable to place order.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center gap-4">
          <ShoppingCart className="h-6 w-6 text-amber-300" />
          <h1 className="text-2xl font-semibold">Smart Cow — Your Cart</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {cart.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-12 text-center">
            <h2 className="text-xl font-semibold text-white">Your cart is empty</h2>
            <p className="mt-3 text-sm text-slate-400">Browse stores and add tasty dishes to your cart.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-sm text-slate-400">Current vendor</h3>
              <p className="mt-1 text-lg font-semibold">
                {vendorLoading ? "Loading vendor…" : vendorName ?? vendorId}
              </p>
            </div>

            <div className="grid gap-4">
              {cart.map((item) => (
                <div key={item.itemId} className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <div className="flex-1">
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-400">₹{item.price} each</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => decrease(item)} className="rounded-full bg-slate-800 p-2 hover:bg-slate-700">
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="w-10 text-center">{item.quantity}</div>
                    <button onClick={() => increase(item)} className="rounded-full bg-slate-800 p-2 hover:bg-slate-700">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="w-28 text-right">
                    <div className="text-sm text-slate-400">Subtotal</div>
                    <div className="font-semibold">₹{item.price * item.quantity}</div>
                  </div>

                  <button onClick={() => removeItem(item)} className="ml-4 rounded-md bg-rose-600/10 px-3 py-2 text-sm text-rose-300 hover:bg-rose-600/20">
                    <Trash2 className="h-4 w-4 inline-block mr-2" /> Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total</div>
                <div className="text-2xl font-semibold">₹{total}</div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => { clearCart(); refresh(); }} className="rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500">
                  <X className="inline-block mr-2 h-4 w-4" /> Clear
                </button>

                <button onClick={handlePlaceOrder} disabled={placing} className="rounded-3xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300">
                  <CreditCard className="inline-block mr-2 h-4 w-4" /> {placing ? "Placing…" : "Place Order"}
                </button>
              </div>
            </div>

            {message ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">{message}</div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
