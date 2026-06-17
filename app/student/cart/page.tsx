"use client";

import CartItem from "@/components/CartItem";
import Link from "next/link";
import StudentNavbar from "@/components/StudentNavbar";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const handleIncrease = (id: string) => {
    const item = cart.find(i => i.id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const handleDecrease = (id: string) => {
    const item = cart.find(i => i.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  const itemTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const taxesAndFees = itemTotal > 0 ? 15 : 0;
  const grandTotal = itemTotal + taxesAndFees;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans w-full flex flex-col items-center">
      
      {/* Navbar */}
      <StudentNavbar showBack={true} />

      <main className="max-w-7xl w-full px-8 md:px-16 py-12 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          
          <div className="mb-8 border-b border-gray-200 pb-4 text-center">
            <h1 className="text-3xl font-bold">Your Cart</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              {cart.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <CartItem 
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      price={item.price}
                      quantity={item.quantity}
                      storeName={item.storeName}
                      onIncrease={handleIncrease}
                      onDecrease={handleDecrease}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded p-8 border border-gray-200 text-center">
                  <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-4">Looks like you haven't added any food yet.</p>
                  <Link href="/student/dashboard" className="text-blue-600 font-medium hover:underline">
                    Browse Stores
                  </Link>
                </div>
              )}
            </div>

            {/* Order Summary */}
            {cart.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded p-6 border border-gray-200 sticky top-6 text-center">
                  <h3 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">Order Summary</h3>
                  
                  <div className="space-y-2 mb-4 text-gray-600">
                    <div className="flex justify-between">
                      <span>Item Total</span>
                      <span>₹{itemTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & Fees</span>
                      <span>₹{taxesAndFees}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Grand Total</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded"
                    onClick={() => alert("Checkout not implemented yet in this demo!")}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
