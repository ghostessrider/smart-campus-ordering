"use client";

import { useState } from "react";
// Adjust the import below if your exact function name differs in email-login.ts
import { signInWithEmail } from "@/services/auth/email-login";

export default function VendorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Invalid vendor credentials. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      {/* Subtle radial glow behind the card - Emerald green for Vendor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[520px] w-[520px] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-8 py-10 shadow-2xl backdrop-blur-sm">

          {/* Logo mark */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-600/40">
              {/* Storefront icon */}
              <svg 
                className="h-6 w-6 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="1.5" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.809c0-.819-.317-1.603-.883-2.19l-3.32-3.415a2.25 2.25 0 0 0-1.58-.66h-12c-.598 0-1.171.24-1.593.66L1.139 7.62c-.566.587-.883 1.371-.883 2.19V21h18.23z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-center text-xl font-semibold tracking-tight text-white">
            Vendor Portal
          </h1>
          <p className="mt-1.5 text-center text-sm text-slate-400">
            Sign in to manage your canteen orders
          </p>

          {/* Divider */}
          <div className="my-7 border-t border-white/[0.06]" />

          {/* Login Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                placeholder="Vendor Email"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                placeholder="Password"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="
                group relative flex w-full items-center justify-center gap-3
                rounded-xl border border-emerald-500/50 bg-emerald-600
                px-4 py-3 text-sm font-medium text-white
                transition-all duration-150
                hover:bg-emerald-500
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500
                disabled:cursor-not-allowed disabled:opacity-50
              "
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-emerald-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Authenticating…</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Error message */}
          {error && (
            <div role="alert" className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-3 text-sm text-red-400">
              <svg className="mt-px h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="mt-5 text-center text-xs text-slate-600">
          Vendor accounts are managed entirely by administration.
        </p>
      </div>
    </main>
  );
} 