"use client";


import Cart from "@/components/Cart/Cart";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, MapPin } from "lucide-react";
import StudentNavbar from "@/components/StudentNavbar";
import { getVendors } from "@/services/firestore/vendor-service";

type Vendor = {
  id: string;
  name: string;
  description?: string;
  imageURL?: string;
  photoURL?: string;
};

const APP_NAME = "SMART COW";

function CowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <ellipse cx="10" cy="24" rx="8" ry="10" fill="currentColor" opacity="0.9" />
      <ellipse cx="54" cy="24" rx="8" ry="10" fill="currentColor" opacity="0.9" />
      <rect x="12" y="16" width="40" height="32" rx="16" fill="currentColor" />
      <rect x="16" y="34" width="32" height="16" rx="8" fill="#0b0d10" opacity="0.85" />
      <circle cx="25" cy="42" r="2.4" fill="currentColor" />
      <circle cx="39" cy="42" r="2.4" fill="currentColor" />
      <circle cx="22" cy="27" r="2.6" fill="#0b0d10" />
      <circle cx="42" cy="27" r="2.6" fill="#0b0d10" />
      <path d="M40 16c4 0 8 3 8 8s-4 6-8 4-6-5-4-8 2-4 4-4z" fill="#0b0d10" opacity="0.85" />
    </svg>
  );
}

export default function StudentDashboard() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

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
    <div className="relative min-h-screen overflow-hidden bg-[#0b0d10] text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#9aa3ae 1px, transparent 1px), linear-gradient(90deg, #929faf 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f2a93b]/[0.07] blur-3xl" />

      <StudentNavbar />

      <main className="relative mx-auto max-w-7xl px-6 py-10">
        <section className="mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[#12151a]/90 px-6 py-8 shadow-[0_25px_60px_-25px_rgba(15,23,42,0.95)] sm:px-10 sm:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f2a93b]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#f2a93b]">
                <CowIcon className="h-4 w-4" />
                {APP_NAME}
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-[#f2a93b] sm:text-5xl">
                Find campus vendors and place your next meal order.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Browse verified campus vendors, add items from one store at a time, and track your orders from checkout to pickup.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <button
                type="button"
                onClick={() => setShowAll((current) => !current)}
                className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-700 bg-slate-900/90 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
              >
                {showAll ? <EyeOff size={16} /> : <Eye size={16} />}
                {showAll ? "Show active vendors" : "Show all vendors"}
              </button>

               <button
                 type="button"
                 onClick={() => setCartOpen(true)}
                 className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[#f2a93b] px-5 py-3 text-sm font-semibold text-[#1a1304] transition hover:bg-[#f5b85c]"
               >
                 <ArrowRight size={18} />
                 View my orders
               </button>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-10 text-center text-slate-400">Loading vendors…</div>
        ) : error ? (
          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-8 text-sm text-rose-200">{error}</div>
        ) : vendors.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-10 text-center text-slate-400">No vendors are available right now.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <Link
                key={vendor.id}
                href={`/student/store/${vendor.id}`}
                className="group overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/90 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)] transition hover:-translate-y-1 hover:border-[#f2a93b]/40"
              >
                <div className="relative h-44 bg-slate-800">
                  {vendor.imageURL || vendor.photoURL ? (
                    <img
                      src={vendor.imageURL || vendor.photoURL}
                      alt={`${vendor.name} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-800 text-slate-500">
                      <MapPin className="h-10 w-10" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-4" />
                </div>

                <div className="space-y-4 p-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Vendor</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{vendor.name}</h2>
                  </div>
                  <p className="min-h-[3rem] text-sm leading-6 text-slate-400">
                    {vendor.description ?? "No description available."}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-3 py-1">
                      <MapPin size={14} />
                      {showAll ? "Full vendor list" : "Active vendor"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3">
                    <span className="text-sm font-semibold text-[#f2a93b]">Open menu</span>
                    <ArrowRight className="h-5 w-5 text-[#f2a93b] transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      {cartOpen && <Cart onClose={() => setCartOpen(false)} />}
    </div>
  );
}
