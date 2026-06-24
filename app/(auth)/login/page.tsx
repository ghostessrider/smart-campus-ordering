"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Loader2, TicketCheck, GraduationCap, Store, ShieldCheck } from "lucide-react";

import { signInUnified } from "@/services/auth/unified-login";

// App name — not finalized yet, picking from the poll options.
// Swap the active line below once a name is locked in.
const APP_NAME = "SMART COW";
// const APP_NAME = "ACE"; // full form: Kunal will share
// const APP_NAME = "WOW"; // World of WOW

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
          <TicketCheck size={16} strokeWidth={1.75} className="text-[#f2a93b]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
            {APP_NAME}
          </span>
        </div>

        {/* ticket card */}
        <div className="w-full">
          {/* top stub: order-token motif */}
          <div className="relative rounded-t-2xl border border-b-0 border-white/10 bg-[#12151a] px-7 pt-7 pb-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9aa3ae]/70">
              Token No.
            </p>
            <p className="mt-1 font-mono text-4xl font-medium tabular-nums text-white">
              001
            </p>
            <h1 className="mt-5 text-xl font-semibold text-white">
              Sign in to {APP_NAME}
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-[#9aa3ae]">
              One account, every counter on campus. We&apos;ll route you to
              the right dashboard automatically.
            </p>
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

            {/* role legend */}
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-[#9aa3ae]">
              <div className="flex items-center gap-1.5">
                <GraduationCap size={15} strokeWidth={1.75} />
                <span className="text-[11px]">Student</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Store size={15} strokeWidth={1.75} />
                <span className="text-[11px]">Vendor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={15} strokeWidth={1.75} />
                <span className="text-[11px]">Admin</span>
              </div>
            </div>
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
