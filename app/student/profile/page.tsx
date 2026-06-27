"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, User } from "lucide-react";
import { auth } from "@/lib/firebase/auth";
import { getUser } from "@/services/firestore/user-service";
import StudentNavbar from "@/components/StudentNavbar";

type ProfileData = {
  name?: string;
  email?: string;
  phone?: string;
};

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!auth.currentUser) {
        setError("Please sign in to view your profile.");
        setLoading(false);
        return;
      }

      try {
        const data = await getUser(auth.currentUser.uid);
        if (!data) {
          setError("Unable to load profile information.");
        } else {
          setProfile({
            name: data.name ?? "",
            email: data.email ?? auth.currentUser.email ?? "",
            phone: data.phone ?? "",
          });
        }
      } catch {
        setError("Unable to load profile information.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <StudentNavbar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/30">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Student Profile</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Your account details</h1>
            <p className="mt-2 text-sm text-slate-400">
              Review the information stored in your student profile.
            </p>
          </div>

          {loading ? (
            <p className="text-slate-400">Loading profile…</p>
          ) : error ? (
            <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>
          ) : (
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-inner shadow-slate-950/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-200">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Name</p>
                    <p className="mt-2 text-lg font-semibold text-white">{profile.name || "Not available"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-inner shadow-slate-950/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-200">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Email</p>
                    <p className="mt-2 text-lg font-semibold text-white">{profile.email || "Not available"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 shadow-inner shadow-slate-950/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-200">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Phone</p>
                    <p className="mt-2 text-lg font-semibold text-white">{profile.phone || "Not available"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
