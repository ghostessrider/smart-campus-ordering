"use client";

import { useEffect, useState } from "react";
import { Clock, FileText, Star, CreditCard } from "lucide-react";
import { auth } from "@/lib/firebase/auth";
import { listenToStudentOrders } from "@/services/firestore/order-service";
import { getVendorById } from "@/services/firestore/vendor-service";
import { getVendorMenuItems } from "@/services/firestore/menu-service";
import { VendorOrder } from "@/types/order";

export default function StudentOrdersPage() {
  // router not required here; kept simple client component
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // caches
  const [vendorNames, setVendorNames] = useState<Record<string, string>>({});
  const [menuAvgMap, setMenuAvgMap] = useState<Record<string, Record<string, number>>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<string, { rating?: number; comment?: string } | null>>({});
  const [formState, setFormState] = useState<Record<string, { rating: number; comment: string; submitting?: boolean; error?: string }>>({});

  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  // Load Razorpay script once
  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };
    if (!(window as any).Razorpay) loadScript();
  }, []);

  const handlePay = async (order: VendorOrder) => {
    setPayError(null);
    setPayingOrderId(order.id);
    try {
      // Create Razorpay order via backend
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: order.total, orderId: order.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create Razorpay order');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_T7Wl5quWf15frz',
        amount: Math.round(order.total * 100),
        currency: 'INR',
        name: 'Smart Campus Ordering',
        description: `Order #${order.orderNumber ?? order.id}`,
        order_id: data.order_id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                firebase_order_id: order.id
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed');
            // Real-time listener will update the UI automatically
            setPayingOrderId(null);
          } catch (err: any) {
            setPayError(err.message || 'Payment verification failed');
            setPayingOrderId(null);
          }
        },
        prefill: {
          email: auth.currentUser?.email || ''
        },
        theme: {
          color: '#34c759'
        }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setPayError(response.error.description);
        setPayingOrderId(null);
      });
      rzp.open();
    } catch (e) {
      setPayError(e instanceof Error ? e.message : 'Payment initialization failed');
      setPayingOrderId(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const user = auth.currentUser;
    if (!user) {
      setError("Please sign in to view your orders.");
      setLoading(false);
      return;
    }

    // Real-time listener for student orders
    const unsubscribe = listenToStudentOrders(user.uid, async (fetched) => {
      if (!mounted) return;
      setOrders(fetched);
      setLoading(false);

      // preload vendor names and menu avg prep times per vendor
      const vendorIds = Array.from(new Set(fetched.map((o) => o.vendorId)));

      const names: Record<string, string> = {};
      const avgMap: Record<string, Record<string, number>> = {};
      const fbMap: Record<string, { rating?: number; comment?: string } | null> = {};

      await Promise.all(
        vendorIds.map(async (vid) => {
          const v = await getVendorById(vid);
          names[vid] = v?.name ?? vid;

          const items = await getVendorMenuItems(vid);
          const map: Record<string, number> = {};
          for (const it of items) {
            if (it.avgPrepTime !== undefined) map[it.id] = it.avgPrepTime;
          }
          avgMap[vid] = map;
        })
      );

      // preload feedback existence for completed or delivered orders
      await Promise.all(
        fetched.map(async (o) => {
          if (o.status === "completed" || o.status === "delivered") {
            try {
              const mod = await import("@/services/firestore/feedback-service");
              const fbMod = (await mod.getFeedbackByOrderId(o.id)) as { rating?: number; comment?: string } | null;
              if (fbMod) fbMap[o.id] = fbMod;
            } catch {
              // ignore — we handle missing feedback by absence
            }
          }
        })
      );

      if (!mounted) return;
      setVendorNames(names);
      setMenuAvgMap(avgMap);
      setFeedbackMap(fbMap);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  function estimatedPrepForOrder(order: VendorOrder) {
    const map = menuAvgMap[order.vendorId] ?? {};
    const times = order.items
      .map((it) => map[it.itemId])
      .filter((t) => typeof t === "number") as number[];
    if (times.length === 0) return null;
    return Math.max(...times);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-slate-400">Loading orders…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="max-w-5xl mx-auto px-6 py-10">
        <header className="mb-6 flex items-center gap-3">
          <FileText className="h-6 w-6 text-amber-300" />
          <h1 className="text-2xl font-semibold">Smart Cow — Your Orders</h1>
        </header>

        {error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-300">{error}</div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-12 text-center">
            <h2 className="text-xl font-semibold text-white">You have no orders yet</h2>
            <p className="mt-3 text-sm text-slate-400">Place an order from a vendor to see it listed here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">Order #{order.orderNumber ?? order.id}</div>
                    <div className="mt-1 text-lg font-semibold">{vendorNames[order.vendorId] ?? order.vendorId}</div>
                  </div>
                  <div className="text-sm text-slate-400">Status: <span className="font-semibold text-white">{order.status}</span> | Payment: <span className="font-semibold text-white">{order.paymentStatus ?? "N/A"}</span></div>
                </div>

                <div className="mt-4 border-t border-slate-800 pt-4">
                  <ul className="space-y-2">
                    {order.items.map((it) => (
                      <li key={it.itemId} className="flex items-center justify-between text-sm text-slate-300">
                        <div>{it.name} x{it.quantity}</div>
                        <div>₹{it.price * it.quantity}</div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="h-4 w-4 text-amber-300" />
                      <span>
                        Estimated preparation: {estimatedPrepForOrder(order) ? `${estimatedPrepForOrder(order)} minutes` : "Unknown"}
                      </span>
                    </div>

                    <div className="text-lg font-semibold">Total ₹{order.total}</div>
                  </div>
                </div>

                {/* Pay Now button — only shows when vendor accepted and payment is not yet done */}
                {order.status === "accepted" && order.paymentStatus !== "paid" && (
                  <div className="mt-4 border-t border-slate-800 pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-emerald-300">Vendor has accepted your order! Please complete payment.</p>
                      <button
                        onClick={() => handlePay(order)}
                        disabled={payingOrderId === order.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-slate-900 font-semibold text-sm hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <CreditCard className="h-4 w-4" />
                        {payingOrderId === order.id ? 'Processing…' : 'Pay Now'}
                      </button>
                    </div>
                    {payError && payingOrderId === null && (
                      <p className="mt-2 text-sm text-rose-400">{payError}</p>
                    )}
                  </div>
                )}

                {/* Payment completed badge */}
                {order.paymentStatus === "paid" && (
                  <div className="mt-4 border-t border-slate-800 pt-4">
                    <p className="text-sm text-emerald-400 font-semibold">✅ Payment Completed</p>
                  </div>
                )}

                {(order.status === "completed" || order.status === "delivered") && (
                  <div className="mt-4 border-t border-slate-800 pt-4">
                    {feedbackMap[order.id] ? (
                      <div className="text-sm text-emerald-300">You already reviewed this order. Thanks!</div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setFormState((s) => ({ ...s, [order.id]: { ...(s[order.id] ?? { rating: 0, comment: "" }), rating: i + 1 } }))}
                              className={`p-1 rounded ${((formState[order.id]?.rating ?? 0) > i) ? 'text-amber-400' : 'text-slate-500'}`}
                            >
                              <Star className="w-5 h-5" />
                            </button>
                          ))}
                        </div>

                        <textarea
                          value={formState[order.id]?.comment ?? ""}
                          onChange={(e) => setFormState((s) => ({ ...s, [order.id]: { ...(s[order.id] ?? { rating: 0, comment: "" }), comment: e.target.value } }))}
                          placeholder="Write a short review (min 5 chars)"
                          className="w-full p-2 rounded bg-slate-800 text-slate-100 text-sm"
                        />

                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              const st = formState[order.id] ?? { rating: 0, comment: "" };
                              if (!st.rating) {
                                setFormState((s) => ({ ...s, [order.id]: { ...(s[order.id] ?? { rating: 0, comment: "" }), error: "Please select a rating" } }));
                                return;
                              }
                              if ((st.comment ?? "").trim().length < 5) {
                                setFormState((s) => ({ ...s, [order.id]: { ...(s[order.id] ?? { rating: 0, comment: "" }), error: "Comment too short" } }));
                                return;
                              }

                              setFormState((s) => ({ ...s, [order.id]: { ...(s[order.id] ?? { rating: 0, comment: "" }), submitting: true, error: undefined } }));

                              try {
                                const fbService = await import("@/services/firestore/feedback-service");
                                const user = auth.currentUser;
                                if (!user) throw new Error("Sign in required");
                                await fbService.createFeedback({ orderId: order.id, userId: user.uid, vendorId: order.vendorId, rating: st.rating, comment: st.comment });
                                setFeedbackMap((m) => ({ ...m, [order.id]: { rating: st.rating, comment: st.comment } }));
                                setFormState((s) => ({ ...s, [order.id]: { ...(s[order.id] ?? { rating: 0, comment: "" }), submitting: false } }));
                              } catch (err) {
                                setFormState((s) => ({ ...s, [order.id]: { ...(s[order.id] ?? { rating: 0, comment: "" }), submitting: false, error: (err instanceof Error && err.message) || 'Failed' } }));
                              }
                            }}
                            className="px-3 py-2 rounded bg-amber-500 text-slate-900 font-semibold"
                          >
                            Submit Review
                          </button>

                          {formState[order.id]?.error && (
                            <div className="text-sm text-rose-400">{formState[order.id]?.error}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
