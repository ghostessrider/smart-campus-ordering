"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginWithEmail } from "@/services/auth/email-login"; 

export default function VendorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await loginWithEmail(email, password);
      router.push("/vendor/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid credentials setup.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07080d] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Amber/Orange Focal Glow Array */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[550px] w-[550px] rounded-full bg-orange-600/[0.07] blur-[130px]" />
      </div>

      <div className="relative w-full max-w-sm z-10">
        {/* Animated Back Navigation Line */}
        <Link 
          href="/login" 
          className="group mb-5 inline-flex items-center text-xs font-medium text-slate-400 hover:text-orange-400 transition-colors gap-1.5"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span> Back to selection
        </Link>
        
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] px-8 py-10 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">Vendor Portal</h1>
            <p className="mt-1.5 text-xs text-slate-400">Initialize terminal to synchronize store logs</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] pl-4 pr-10 py-2.5 text-sm text-white placeholder-slate-600 focus:border-orange-500/80 focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-orange-500/80 transition-all duration-200"
                  placeholder="vendor@store.com"
                />
              </div>
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] pl-4 pr-11 py-2.5 text-sm text-white placeholder-slate-600 focus:border-orange-500/80 focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-orange-500/80 transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    /* Eye Slash Icon */
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    /* Eye Icon */
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 hover:from-orange-500 hover:to-amber-500 hover:shadow-orange-500/30 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#07080d] disabled:opacity-40 disabled:pointer-events-none transition-all duration-150"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span>Synchronizing...</span>
                </div>
              ) : (
                "Authorize Access"
              )}
            </button>
          </form>

          {/* Error Message Layout */}
          {error && (
            <div role="alert" className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-500/15 bg-red-500/5 px-3.5 py-3 text-xs font-medium text-red-400/90 backdrop-blur-sm">
              <svg className="mt-px h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}