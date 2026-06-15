"use client";
import { useState } from "react";
import { signInStudent } from "@/services/auth/google-signin";
export default function StudentLoginPage() {
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const handleGoogleSignIn = async () => {
setIsLoading(true);
setError(null);
try {
await signInStudent();
} catch (err: unknown) {
const message =
err instanceof Error
? err.message
: "Something went wrong. Please try again.";
setError(message);
} finally {
setIsLoading(false);
}
};
return (
<main className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
{/* Subtle radial glow behind the card */}
<div
aria-hidden="true"
className="pointer-events-none absolute inset-0 flex items-center justify-center"
>
<div className="h-[520px] w-[520px] rounded-full bg-indigo-600/10 blur-[120px]" />
</div>
<div className="relative w-full max-w-sm">
    {/* Card */}
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-8 py-10 shadow-2xl backdrop-blur-sm">

      {/* Logo mark */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/40">
          {/* Graduation cap icon */}
          <svg
            className="h-6 w-6 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
            <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
          </svg>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-center text-xl font-semibold tracking-tight text-white">
        Smart Campus Ordering
      </h1>
      <p className="mt-1.5 text-center text-sm text-slate-400">
        Sign in with your IIT Bhilai account
      </p>

      {/* Divider */}
      <div className="my-7 border-t border-white/[0.06]" />

      {/* Google button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="
          group relative flex w-full items-center justify-center gap-3
          rounded-xl border border-white/[0.1] bg-white/[0.05]
          px-4 py-3 text-sm font-medium text-white
          transition-all duration-150
          hover:border-white/[0.2] hover:bg-white/[0.08]
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
          disabled:cursor-not-allowed disabled:opacity-50
        "
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            {/* Spinner */}
            <svg
              className="h-4 w-4 animate-spin text-slate-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-slate-300">Signing you in…</span>
          </>
        ) : (
          <>
            {/* Google "G" logo */}
            <svg
              className="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-3 text-sm text-red-400"
        >
          <svg
            className="mt-px h-4 w-4 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>

    {/* Footer note */}
    <p className="mt-5 text-center text-xs text-slate-600">
      Access is restricted to{" "}
      <span className="text-slate-500">@iitbhilai.ac.in</span> accounts.
    </p>
  </div>
</main>
);
}
