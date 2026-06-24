"use client";

import { useEffect, useState } from "react";
import StudentNavbar from "@/components/StudentNavbar";
import OrderCard from "@/components/OrderCard";
import { auth } from "@/lib/firebase/auth";
import { getStudentOrders } from "@/services/firestore/order-service";

type OrderItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

type StudentOrder = {
  id: string;
  orderNumber?: string;
  items: OrderItem[];
  status: "pending" | "accepted" | "completed" | "delivered" | "rejected";
  total: number;
};

const allowedStatuses = ["pending", "accepted", "completed", "delivered", "rejected"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<StudentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const data = await getStudentOrders(auth.currentUser.uid);
        const filtered = (data as StudentOrder[]).filter((order) =>
          allowedStatuses.includes(order.status)
        );
        setOrders(filtered);
      } catch {
        setError("Unable to load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <StudentNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Orders</h1>
          <p className="mt-2 text-gray-600">Track the status of your orders here.</p>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading orders…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                orderId={order.orderNumber || order.id}
                orderNumber={order.orderNumber}
                items={order.items ?? []}
                status={order.status}
                price={order.total}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
