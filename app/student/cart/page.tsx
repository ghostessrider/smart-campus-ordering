"use client";

import { useState } from "react";
import StudentNavbar from "@/components/StudentNavbar";
import { auth } from "@/lib/firebase/auth";
import {
  CartItem,
  clearCart,
  getCart,
  getCartVendorId,
  removeCartItem,
  updateCartQuantity,
} from "@/services/cart/cart-store";
import { createOrder } from "@/services/firestore/order-service";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(getCart());
  const [vendorId, setVendorId] = useState<string | null>(getCartVendorId());
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function refreshCart() {
    setCart(getCart());
    setVendorId(getCartVendorId());
  }

  const handleIncrease = (itemId: string) => {
    updateCartQuantity(itemId, (cart.find((item) => item.itemId === itemId)?.quantity ?? 0) + 1);
    refreshCart();
  };

  const handleDecrease = (itemId: string) => {
    const current = cart.find((item) => item.itemId === itemId);
    if (current && current.quantity > 1) {
      updateCartQuantity(itemId, current.quantity - 1);
      refreshCart();
    }
  };

  const handleRemove = (itemId: string) => {
    removeCartItem(itemId);
    refreshCart();
  };

  const itemTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  async function handlePlaceOrder() {
    setError("");
    setMessage("");

    if (!auth.currentUser) {
      setError("You must be signed in to place an order.");
      return;
    }

    if (!vendorId) {
      setError("No vendor selected for the order.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      const order = {
        userId: auth.currentUser.uid,
        vendorId,
        items: cart.map((item) => ({
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: itemTotal,
        status: "pending",
        paymentStatus: "pending",
      };

      await createOrder(order);
      clearCart();
      refreshCart();
      setMessage("Order placed successfully.");
    } catch {
      setError("Unable to place order. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <StudentNavbar showBack={true} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <p className="mt-2 text-gray-600">
            Review items in your cart and place the order for the selected vendor.
          </p>
        </div>

        {vendorId ? (
          <p className="mb-4 text-sm text-gray-600">Vendor ID: {vendorId}</p>
        ) : (
          <p className="mb-4 text-sm text-red-600">No vendor selected yet.</p>
        )}

        {cart.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-gray-600">Your cart is empty.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.itemId} className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="mt-1 text-sm text-gray-600">₹{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDecrease(item.itemId)}
                      className="rounded-full border px-3 py-1 text-sm"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleIncrease(item.itemId)}
                      className="rounded-full border px-3 py-1 text-sm"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemove(item.itemId)}
                      className="rounded-full border border-red-200 px-3 py-1 text-sm text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{itemTotal}</span>
              </div>
            </div>

            {error ? (
              <div className="rounded-3xl bg-red-50 p-4 text-red-700">{error}</div>
            ) : null}
            {message ? (
              <div className="rounded-3xl bg-green-50 p-4 text-green-700">{message}</div>
            ) : null}

            <button
              onClick={handlePlaceOrder}
              className="inline-flex w-full justify-center rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Place Order
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
