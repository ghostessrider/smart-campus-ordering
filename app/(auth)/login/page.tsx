"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signInUnified } from "@/services/auth/unified-login";

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
      } else if (result.role === "student") {
        router.push("/student/dashboard");
      } else {
        router.push("/vendor/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f1117]">
      <div className="border rounded-xl p-8">
        <h1 className="text-xl text-white mb-5">
          Smart Campus Ordering
        </h1>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="border px-5 py-3 rounded text-white"
        >
          {loading ? "Signing in..." : "Login with Google"}
        </button>

        {error && (
          <p className="mt-4 text-red-400">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}