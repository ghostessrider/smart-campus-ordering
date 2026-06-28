import React, { useState, useEffect } from "react";
import { getCart, clearCart, subscribe } from "@/services/cart/cart-store";

interface CartProps {
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ onClose }) => {
  const [items, setItems] = useState(getCart());

  useEffect(() => {
    const unsubscribe = subscribe(() => setItems([...getCart()]));
    return () => unsubscribe();
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="max-w-md w-full bg-[#12151a] text-slate-100 p-6 rounded-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {items.length === 0 ? (
          <p className="text-sm text-slate-400">Your cart is currently empty.</p>
        ) : (
          <div>
            <ul className="space-y-2">
              {items.map(item => (
                <li key={item.itemId} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-slate-700 pt-2 flex justify-between font-medium">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => { clearCart(); onClose(); }}
              className="mt-4 w-full rounded-md bg-[#f2a93b] py-2 font-medium text-[#1a1304] hover:bg-[#f5b85c]"
            >
              Clear Cart & Close
            </button>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-md bg-slate-700 py-2 font-medium text-slate-200 hover:bg-slate-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Cart;
