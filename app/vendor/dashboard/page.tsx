"use client";

import { useEffect, useState } from "react";

import {
  getPendingOrders,
  getAcceptedOrders,
  getCompletedOrders,
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
  const [pendingOrders, setPendingOrders] = useState<VendorOrder[]>([]);
  const [acceptedOrders, setAcceptedOrders] = useState<VendorOrder[]>([]);
  const [completedOrders, setCompletedOrders] = useState<VendorOrder[]>([]);

  async function loadOrders() {
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

    const pending = await getPendingOrders(vendor.id);
    const accepted = await getAcceptedOrders(vendor.id);
    const completed = await getCompletedOrders(vendor.id);

    setPendingOrders(pending as VendorOrder[]);
    setAcceptedOrders(accepted as VendorOrder[]);
    setCompletedOrders(completed as VendorOrder[]);
  }

  useEffect(() => {
    async function init() {
      await loadOrders();
    }

    void init();
  }, []);

  async function changeStatus(id: string, status: "accepted" | "completed" | "delivered") {
    await updateOrderStatus(id, status);
    await loadOrders();
  }

  async function rejectOrder(id: string) {
    await updateOrderStatus(id, "rejected");
    await loadOrders();
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
      <p className="mt-2">Vendor ID: {vendorId}</p>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Pending Orders</h2>
        <div className="mt-4 space-y-5">
          {pendingOrders.length === 0 ? (
            <p className="text-gray-600">No pending orders.</p>
          ) : (
            pendingOrders.map((order) => (
              <div key={order.id} className="border rounded p-5">
                <h3 className="text-lg font-semibold">Order #{order.orderNumber || order.id}</h3>
                <p className="text-sm text-gray-600">Status: {order.status}</p>
                <div className="mt-3">
                  <h4 className="font-semibold">Items</h4>
                  {order.items?.map((item, index) => (
                    <p key={item.itemId || index}>
                      {item.name} × {item.quantity}
                    </p>
                  ))}
                </div>
                <p className="mt-3 font-semibold">Total: ₹{order.total ?? 0}</p>
                <div className="mt-4 flex gap-3 flex-wrap">
                  <button
                    onClick={() => changeStatus(order.id, "accepted")}
                    className="border px-4 py-2 rounded bg-green-50 text-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectOrder(order.id)}
                    className="border px-4 py-2 rounded bg-red-50 text-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Accepted Orders</h2>
        <div className="mt-4 space-y-5">
          {acceptedOrders.length === 0 ? (
            <p className="text-gray-600">No accepted orders.</p>
          ) : (
            acceptedOrders.map((order) => (
              <div key={order.id} className="border rounded p-5">
                <h3 className="text-lg font-semibold">Order #{order.orderNumber || order.id}</h3>
                <p className="text-sm text-gray-600">Status: {order.status}</p>
                <div className="mt-3">
                  <h4 className="font-semibold">Items</h4>
                  {order.items?.map((item, index) => (
                    <p key={item.itemId || index}>
                      {item.name} × {item.quantity}
                    </p>
                  ))}
                </div>
                <p className="mt-3 font-semibold">Total: ₹{order.total ?? 0}</p>
                <div className="mt-4">
                  <button
                    onClick={() => changeStatus(order.id, "completed")}
                    className="border px-4 py-2 rounded bg-blue-50 text-blue-700"
                  >
                    Mark completed
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Completed Orders</h2>
        <div className="mt-4 space-y-5">
          {completedOrders.length === 0 ? (
            <p className="text-gray-600">No completed orders.</p>
          ) : (
            completedOrders.map((order) => (
              <div key={order.id} className="border rounded p-5">
                <h3 className="text-lg font-semibold">Order #{order.orderNumber || order.id}</h3>
                <p className="text-sm text-gray-600">Status: {order.status}</p>
                <div className="mt-3">
                  <h4 className="font-semibold">Items</h4>
                  {order.items?.map((item, index) => (
                    <p key={item.itemId || index}>
                      {item.name} × {item.quantity}
                    </p>
                  ))}
                </div>
                <p className="mt-3 font-semibold">Total: ₹{order.total ?? 0}</p>
                <div className="mt-4">
                  <button
                    onClick={() => changeStatus(order.id, "delivered")}
                    className="border px-4 py-2 rounded bg-indigo-50 text-indigo-700"
                  >
                    Mark delivered
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
