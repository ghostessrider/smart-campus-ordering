"use client";

import { useEffect, useState } from "react";
import { Clock, FileText, Star } from "lucide-react";
import { auth } from "@/lib/firebase/auth";
import { getStudentOrders } from "@/services/firestore/order-service";
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

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      const user = auth.currentUser;
      if (!user) {
        setError("Please sign in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const fetched = (await getStudentOrders(user.uid)) as VendorOrder[];
        if (!mounted) return;
        setOrders(fetched);

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

          // preload feedback existence for delivered orders
          await Promise.all(
            fetched.map(async (o) => {
              if (o.status === "delivered") {
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
      } catch (err) {
        setError((err instanceof Error && err.message) || "Unable to load orders.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();

    return () => {
      mounted = false;
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
                  <div className="text-sm text-slate-400">Status: <span className="font-semibold text-white">{order.status}</span></div>
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

                {order.status === "delivered" && (
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
