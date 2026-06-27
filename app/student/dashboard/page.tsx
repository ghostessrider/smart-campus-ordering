"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, MapPin } from "lucide-react";
import StudentNavbar from "@/components/StudentNavbar";
import { getVendors } from "@/services/firestore/vendor-service";

type Vendor = {
  id: string;
  name: string;
  description?: string;
  photoURL?: string;
};

export default function StudentDashboard() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function loadVendors() {
      try {
        setLoading(true);
        const data = await getVendors(!showAll);
        setVendors(data as Vendor[]);
      } catch {
        setError("Unable to load vendors. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadVendors();
  }, [showAll]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <StudentNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Explore campus vendors and open their menu to place an order.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
            >
              {showAll ? <EyeOff size={16} /> : <Eye size={16} />}
              {showAll ? "Showing all vendors" : "Show all vendors"}
            </button>
            <Link
              href="/student/orders"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              <ArrowRight size={18} />
              View My Orders
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading vendors…</p>
        ) : error ? (
          <p className="text-rose-400">{error}</p>
        ) : vendors.length === 0 ? (
          <p className="text-slate-400">No vendors are available right now.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <Link
                key={vendor.id}
                href={`/student/store/${vendor.id}`}
                className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-lg transition hover:-translate-y-1 hover:border-blue-500"
              >
                <div className="relative h-44 bg-slate-800">
                  {vendor.photoURL ? (
                    <img
                      src={vendor.photoURL}
                      alt={`${vendor.name} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-800 text-slate-500">
                      <MapPin className="h-10 w-10 text-slate-500" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-4" />
                </div>

                <div className="space-y-3 p-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Vendor</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">{vendor.name}</h2>
                  </div>
                  <p className="min-h-[3rem] text-sm leading-6 text-slate-400">
                    {vendor.description ?? "No description available."}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1">
                      <MapPin size={14} />
                      {showAll ? "Full vendor list" : "Active vendor"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3">
                    <span className="text-sm font-semibold text-blue-300">Open menu</span>
                    <ArrowRight className="h-5 w-5 text-blue-300 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
