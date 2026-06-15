"use client";

import { useState } from "react";
// Adjust the import below if your exact function name differs in email-login.ts
import { signInWithEmail } from "@/services/auth/email-login";

export default function AdminLoginPage() {
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
          : "Unauthorized. Admin privileges restricted.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      {/* Subtle radial glow behind the card - Rose red for Admin */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[520px] w-[520px] rounded-full bg-rose-600/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-8 py-10 shadow-2xl backdrop-blur-sm">

          {/* Logo mark */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-600 shadow-lg shadow-rose-600/40">
              {/* Security/Lock icon */}
              <svg 
                className="h-6 w-6 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="1.5" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-center text-xl font-semibold tracking-tight text-white">
            System Administration
          </h1>
          <p className="mt-1.5 text-center text-sm text-slate-400">
            Secure backend control access
          </p>

          {/* Divider */}
          <div className="my-7 border-t border-white/[0.06]" />

          {/* Login Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Admin Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
                placeholder="Admin Email"
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
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
                placeholder="Password"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="
                group relative flex w-full items-center justify-center gap-3
                rounded-xl border border-rose-500/50 bg-rose-600
                px-4 py-3 text-sm font-medium text-white
                transition-all duration-150
                hover:bg-rose-500
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500
                disabled:cursor-not-allowed disabled:opacity-50
              "
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-rose-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Verifying clearance…</span>
                </>
              ) : (
                "Authorize"
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
          This panel is closely monitored and logged.
        </p>
      </div>
    </main>
  );
}