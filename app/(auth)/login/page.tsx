"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Loader2 } from "lucide-react";

import { signInUnified } from "@/services/auth/unified-login";

// App name — not finalized yet, picking from the poll options.
// Swap the active line below once a name is locked in.
const APP_NAME = "SMART COW";
// const APP_NAME = "ACE"; // full form: Kunal will share
// const APP_NAME = "WOW"; // World of WOW

// Simple flat cow-face mark — stand-in mascot until a real logo exists.
function CowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* ears */}
      <ellipse cx="10" cy="24" rx="8" ry="10" fill="currentColor" opacity="0.9" />
      <ellipse cx="54" cy="24" rx="8" ry="10" fill="currentColor" opacity="0.9" />
      {/* head */}
      <rect x="12" y="16" width="40" height="32" rx="16" fill="currentColor" />
      {/* muzzle */}
      <rect x="16" y="34" width="32" height="16" rx="8" fill="#0b0d10" opacity="0.85" />
      {/* nostrils */}
      <circle cx="25" cy="42" r="2.4" fill="currentColor" />
      <circle cx="39" cy="42" r="2.4" fill="currentColor" />
      {/* eyes */}
      <circle cx="22" cy="27" r="2.6" fill="#0b0d10" />
      <circle cx="42" cy="27" r="2.6" fill="#0b0d10" />
      {/* spot */}
      <path
        d="M40 16c4 0 8 3 8 8s-4 6-8 4-6-5-4-8 2-4 4-4z"
        fill="#0b0d10"
        opacity="0.85"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      setLoading(true);
      setError("");

      const result = await signInUnified();

      if (result.role === "admin") {
        router.push("/admin/dashboard");
      } else if (result.role === "vendor") {
        router.push("/vendor/dashboard");
      } else if (result.role === "student") {
        router.push("/student/dashboard");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0d10] px-6 py-16">
      {/* ambient grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#9aa3ae 1px, transparent 1px), linear-gradient(90deg, #9aa3ae 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* warm glow behind the ticket */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f2a93b]/[0.07] blur-3xl" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        {/* eyebrow */}
        <div className="mb-7 flex items-center gap-2 text-[#9aa3ae]">
          <CowIcon className="h-4 w-4 text-[#f2a93b]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
            {APP_NAME}
          </span>
        </div>

        {/* ticket card */}
        <div className="w-full">
          {/* top stub */}
          <div className="relative rounded-t-2xl border border-b-0 border-white/10 bg-[#12151a] px-7 pt-8 pb-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f2a93b]/15">
              <CowIcon className="h-7 w-7 text-[#f2a93b]" />
            </div>
            <h1 className="text-xl font-semibold text-white">
              Sign in to {APP_NAME}
            </h1>
          </div>

          {/* perforation seam */}
          <div className="relative flex items-center border-x border-white/10 bg-[#12151a]">
            <div className="absolute -left-[7px] h-[14px] w-[14px] rounded-full bg-[#0b0d10]" />
            <div className="h-px w-full border-t border-dashed border-white/15" />
            <div className="absolute -right-[7px] h-[14px] w-[14px] rounded-full bg-[#0b0d10]" />
          </div>

          {/* bottom stub: action */}
          <div className="rounded-b-2xl border border-t-0 border-white/10 bg-[#12151a] px-7 pt-6 pb-7">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#f2a93b] px-5 py-3.5 text-sm font-semibold text-[#1a1304] transition-colors hover:bg-[#f5b85c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" strokeWidth={2} />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn size={18} strokeWidth={2} />
                  Continue with Google
                </>
              )}
            </button>

            {error && (
              <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
                {error}
              </p>
            )}
          </div>
        </div>

        <p className="mt-7 max-w-xs text-center text-xs leading-relaxed text-[#9aa3ae]/70">
          Students sign in with their university email. Vendor and admin
          access is provisioned by the campus team.
        </p>
      </div>
    </main>
  );
}