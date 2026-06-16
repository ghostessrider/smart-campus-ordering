"use client";

import { useState } from "react";
import CartItem from "@/components/CartItem";
import Link from "next/link";

// Dummy Data
const INITIAL_CART = [
  { id: "c1", name: "Masala Dosa", price: 60, quantity: 2 },
  { id: "c2", name: "Cold Coffee", price: 50, quantity: 1 },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(INITIAL_CART);

  const handleIncrease = (id: string) => {
    setCartItems(items => items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const handleDecrease = (id: string) => {
    setCartItems(items => items.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
  };

  const handleRemove = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const itemTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const taxesAndFees = itemTotal > 0 ? 15 : 0;
  const grandTotal = itemTotal + taxesAndFees;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b dark:border-gray-800 pb-6">
          <Link href="/student/dashboard" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2">
            {cartItems.length > 0 ? (
              <div>
                {cartItems.map((item) => (
                  <CartItem 
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added any food yet.</p>
                <Link href="/student/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-colors inline-block">
                  Browse Stores
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{itemTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{taxesAndFees}</span>
                  </div>
                </div>
                
                <div className="border-t dark:border-gray-700 pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Grand Total</span>
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">₹{grandTotal}</span>
                  </div>
                </div>
                
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex justify-between items-center group"
                  onClick={() => alert("Checkout not implemented yet in this demo!")}
                >
                  <span>Checkout</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
