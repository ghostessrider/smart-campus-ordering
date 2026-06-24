"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StudentNavbar from "@/components/StudentNavbar";
import { getActiveVendors } from "@/services/firestore/vendor-service";

type Vendor = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  queueNumber?: number;
};

export default function StudentDashboard() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVendors() {
      try {
        const data = await getActiveVendors();
        setVendors(data as Vendor[]);
      } catch {
        setError("Unable to load vendors. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadVendors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <StudentNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Select an active vendor to browse their menu and place an order.
            </p>
          </div>
          <Link
            href="/student/orders"
            className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            View My Orders
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading active vendors…</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : vendors.length === 0 ? (
          <p className="text-gray-600">No active vendors are available right now.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <Link
                key={vendor.id}
                href={`/student/store/${vendor.id}`}
                className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-blue-400 hover:shadow-md"
              >
                <h2 className="text-xl font-semibold text-slate-900">{vendor.name}</h2>
                <p className="mt-3 text-sm text-slate-500">Email: {vendor.email}</p>
                <p className="mt-2 text-sm text-slate-500">Phone: {vendor.phone || "Not provided"}</p>
                <p className="mt-2 text-sm text-slate-500">Queue: {vendor.queueNumber ?? "N/A"}</p>
                <div className="mt-5 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  Browse menu
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
