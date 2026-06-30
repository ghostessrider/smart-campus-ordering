import React, { useState, useEffect } from "react";
import { getCartVendorId, updateCartQuantity, removeCartItem } from "@/services/cart/cart-store";
import { createOrder, updatePaymentStatus } from "@/services/firestore/order-service";
import { auth } from "@/lib/firebase/auth";
import { getCart, clearCart, subscribe } from "@/services/cart/cart-store";

// Razorpay will be loaded from the external script at runtime
// Fake payment gateway – no external script needed

interface CartProps {
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ onClose }) => {
  const [items, setItems] = useState(getCart());
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState<boolean>(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  // Load Razorpay script once
  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };
    if (!(window as any).Razorpay) loadScript();
    const unsubscribe = subscribe(() => setItems([...getCart()]));
    return () => unsubscribe();
  }, []);

  const handlePay = async () => {
    if (!currentOrderId) {
      setOrderError('Order ID missing.');
      return;
    }
    try {
      // Initialize Razorpay checkout using test mode
      const options = {
        key: 'rzp_test_T7Wl5quWf15frz', // Razorpay Test Key ID (test mode)
        amount: Math.round(total * 100), // amount in paise
        currency: 'INR',
        name: 'Smart Campus Ordering',
        description: `Order ${currentOrderId}`,
        handler: async function (response: any) {
          // Payment successful, update payment status in Firestore
          await updatePaymentStatus(currentOrderId, 'paid');
          clearCart();
          setOrderCreated(false);
          setCurrentOrderId(null);
          onClose();
        },
        prefill: {
          email: auth.currentUser?.email || ''
        },
        theme: {
          color: '#34c759'
        }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e) {
      setOrderError(e instanceof Error ? e.message : 'Payment failed');
    }
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="max-w-md w-full bg-[#12151a] text-slate-100 p-6 rounded-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {items.length === 0 ? (
          <p className="text-sm text-slate-400">Your cart is currently empty.</p>
        ) : (
          <div>
            <ul className="space-y-2">
              {items.map(item => (
                <li key={item.itemId} className="flex justify-between text-sm items-center">
                    <span>{item.name}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateCartQuantity(item.itemId, item.quantity - 1)} className="px-2 py-1 bg-slate-700 rounded">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.itemId, item.quantity + 1)} className="px-2 py-1 bg-slate-700 rounded">+</button>
                      <button onClick={() => removeCartItem(item.itemId)} className="text-red-400 ml-2">✕</button>
                    </div>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
              {orderCreated && (
                <button
                  onClick={handlePay}
                  className="mt-2 w-full rounded-md bg-[#34c759] py-2 font-medium text-[#1a1304] hover:bg-[#4cd96e]"
                >
                  Pay Now
                </button>
              )}
            </ul>
            <div className="mt-4 border-t border-slate-700 pt-2 flex justify-between font-medium">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button
                onClick={() => { clearCart(); onClose(); }}
                className="mt-4 w-full rounded-md bg-[#f2a93b] py-2 font-medium text-[#1a1304] hover:bg-[#f5b85c]"
              >
                Clear Cart &amp; Close</button>
            {items.length > 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-2 w-full rounded-md bg-[#5b9dff] py-2 font-medium text-[#0c1a33] hover:bg-[#7badff]"
              >
                Place Order
              </button>
            )}
          </div>
        )}
        <button
                onClick={onClose}
                className="mt-4 w-full rounded-md bg-slate-700 py-2 font-medium text-slate-200 hover:bg-slate-600"
              >
                Close</button>
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setShowModal(false)}>
                <div className="bg-[#12151a] p-6 rounded-lg w-96" onClick={e => e.stopPropagation()}>
                  <h3 className="text-lg font-semibold mb-4 text-white">Confirm Order</h3>
                  <p className="text-sm text-[#9aa3ae] mb-2">Total: ₹{total.toFixed(2)}</p>
                  <textarea
                    placeholder="Add notes (e.g., special instructions)"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full mb-2 p-2 bg-[#0b0d10] text-white placeholder-[#9aa3ae]/50 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Pickup location / room number"
                    value={pickupLocation}
                    onChange={e => setPickupLocation(e.target.value)}
                    className="w-full mb-4 p-2 bg-[#0b0d10] text-white placeholder-[#9aa3ae]/50 rounded"
                  />
                  {orderError && <p className="text-red-400 text-sm mb-2">{orderError}</p>}
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-slate-700 rounded text-sm"
                    >Cancel</button>
                    <button
                      onClick={async () => {
                        try {
                          const vendorId = getCartVendorId();
                          const userId = auth.currentUser?.uid;
                          if (!vendorId || !userId) throw new Error('Vendor or user not identified');
                          const orderId = await createOrder({
                            vendorId,
                            userId,
                            items,
                            total,
                            status: 'pending_confirmation',
                            notes,
                            pickupLocation,
                          });
                          setCurrentOrderId(orderId);
                          setOrderCreated(true);
                          setShowModal(false);
                          // Cart will be cleared after successful payment.
                        } catch (e) {
                          setOrderError(e instanceof Error ? e.message : 'Failed to place order');
                        }
                      }}
                      className="px-4 py-2 bg-[#5b9dff] rounded text-sm"
                    >Confirm</button>
                  </div>
                </div>
              </div>
            )}
      </div>
    </div>
  );
};

export default Cart;
