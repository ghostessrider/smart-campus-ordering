"use client";

import { useEffect, useState } from "react";

import {
  listenToVendorOrders,
  updateOrderStatus,
} from "@/services/firestore/order-service";

import { getVendorByEmail } from "@/services/firestore/vendor-service";
import { auth } from "@/lib/firebase/auth";

type VendorOrderItem = {
  itemId: string;
  name: string;
  quantity: number;
  price?: number;
};

type VendorOrder = {
  id: string;
  vendorId: string;
  orderNumber?: string;
  status: "pending" | "accepted" | "completed" | "delivered" | "rejected";
  items?: VendorOrderItem[];
  total?: number;
};

export default function VendorDashboard() {
  const [vendorId, setVendorId] = useState("");
  const [incomingOrders, setIncomingOrders] = useState<VendorOrder[]>([]);
  const [preparingOrders, setPreparingOrders] = useState<VendorOrder[]>([]);
  const [readyOrders, setReadyOrders] = useState<VendorOrder[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function init() {
      const email = auth.currentUser?.email;
      if (!email) {
        console.log("No vendor logged in");
        return;
      }

      const vendor = await getVendorByEmail(email);
      if (!vendor) {
        console.log("Vendor not found");
        return;
      }

      setVendorId(vendor.id);

      unsubscribe = listenToVendorOrders(vendor.id, (allOrders: any[]) => {
        const orders = allOrders as VendorOrder[];
        setIncomingOrders(orders.filter((o) => o.status === "pending"));
        setPreparingOrders(orders.filter((o) => o.status === "accepted"));
        setReadyOrders(orders.filter((o) => o.status === "completed"));
      });
    }

    void init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  async function changeStatus(
    id: string,
    status: "accepted" | "completed" | "delivered"
  ) {
    await updateOrderStatus(id, status);
  }

  async function rejectOrder(id: string) {
    await updateOrderStatus(id, "rejected");
  }

  return (
    <main className="p-10 min-h-screen bg-[#0f1117] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Vendor Dashboard</h1>
            <p className="mt-2 text-sm text-gray-400">Vendor ID: <span className="font-mono text-gray-300">{vendorId}</span></p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Incoming Column */}
          <section className="bg-[#1a1d24] p-5 rounded-2xl shadow-xl border border-gray-800/60 flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800/60">
              <h2 className="text-lg font-semibold text-gray-200">Incoming Orders</h2>
              <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20">
                {incomingOrders.length}
              </span>
            </div>
            <div className="space-y-4 flex-1">
              {incomingOrders.length === 0 ? (
                <p className="text-gray-500 text-sm italic text-center mt-10">No incoming orders right now.</p>
              ) : (
                incomingOrders.map((order) => (
                  <div key={order.id} className="bg-[#222631] border border-gray-700/50 rounded-xl p-5 shadow-lg hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-md font-bold text-gray-100">Order #{order.orderNumber || order.id.slice(-6)}</h3>
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      {order.items?.map((item, index) => (
                        <div key={item.itemId || index} className="flex justify-between text-sm text-gray-400 font-medium">
                          <span><span className="text-gray-300 mr-2">{item.quantity}×</span> {item.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-gray-700/50 flex justify-between items-center mb-5">
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total</span>
                      <span className="font-bold text-gray-100 text-lg">₹{order.total ?? 0}</span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => changeStatus(order.id, "accepted")}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold text-sm shadow-lg shadow-blue-900/20 transition-all duration-200 active:scale-95"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectOrder(order.id)}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-95"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Preparing Column */}
          <section className="bg-[#1a1d24] p-5 rounded-2xl shadow-xl border border-gray-800/60 flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800/60">
              <h2 className="text-lg font-semibold text-gray-200">Preparing</h2>
              <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/20">
                {preparingOrders.length}
              </span>
            </div>
            <div className="space-y-4 flex-1">
              {preparingOrders.length === 0 ? (
                <p className="text-gray-500 text-sm italic text-center mt-10">No orders currently in prep.</p>
              ) : (
                preparingOrders.map((order) => (
                  <div key={order.id} className="bg-[#222631] border border-gray-700/50 border-l-4 border-l-yellow-500 rounded-xl p-5 shadow-lg hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-md font-bold text-gray-100">Order #{order.orderNumber || order.id.slice(-6)}</h3>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      {order.items?.map((item, index) => (
                        <div key={item.itemId || index} className="flex justify-between text-sm text-gray-400 font-medium">
                          <span><span className="text-gray-300 mr-2">{item.quantity}×</span> {item.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-gray-700/50 flex justify-between items-center mb-5">
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total</span>
                      <span className="font-bold text-gray-100 text-lg">₹{order.total ?? 0}</span>
                    </div>
                    <div>
                      <button
                        onClick={() => changeStatus(order.id, "completed")}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-yellow-950 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-yellow-900/20 transition-all duration-200 active:scale-95"
                      >
                        Mark Ready for Pickup
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Ready Column */}
          <section className="bg-[#1a1d24] p-5 rounded-2xl shadow-xl border border-gray-800/60 flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800/60">
              <h2 className="text-lg font-semibold text-gray-200">Ready for Pickup</h2>
              <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/20">
                {readyOrders.length}
              </span>
            </div>
            <div className="space-y-4 flex-1">
              {readyOrders.length === 0 ? (
                <p className="text-gray-500 text-sm italic text-center mt-10">No orders waiting for pickup.</p>
              ) : (
                readyOrders.map((order) => (
                  <div key={order.id} className="bg-[#222631] border border-gray-700/50 border-l-4 border-l-green-500 rounded-xl p-5 shadow-lg hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-md font-bold text-gray-100">Order #{order.orderNumber || order.id.slice(-6)}</h3>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      {order.items?.map((item, index) => (
                        <div key={item.itemId || index} className="flex justify-between text-sm text-gray-400 font-medium">
                          <span><span className="text-gray-300 mr-2">{item.quantity}×</span> {item.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-gray-700/50 flex justify-between items-center mb-5">
                      <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total</span>
                      <span className="font-bold text-gray-100 text-lg">₹{order.total ?? 0}</span>
                    </div>
                    <div>
                      <button
                        onClick={() => changeStatus(order.id, "delivered")}
                        className="w-full bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-green-900/20 transition-all duration-200 active:scale-95"
                      >
                        Mark as Delivered
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
