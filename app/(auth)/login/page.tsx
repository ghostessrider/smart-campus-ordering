import Link from "next/link";

export default function LoginRoleSelectionPage() {
  return (
    <main className="min-h-screen bg-[#07080d] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Multilayered Deep Space Ambient Glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[140px] -translate-x-1/3 -translate-y-1/4" />
        <div className="absolute h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[120px] translate-x-1/3 translate-y-1/4" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Glassmorphic Container with Subtle Top Highlight Border */}
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] px-8 py-10 shadow-2xl backdrop-blur-xl">
          
          {/* Header Section */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Smart Campus Ordering
            </h1>
            <p className="mt-2.5 text-sm text-slate-400">
              Select your node portal to establish session
            </p>
          </div>

          {/* Role Cards Stack */}
          <div className="flex flex-col gap-4">
            
            {/* Student Card */}
            <Link 
              href="/login/student"
              className="group flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] p-4.5 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/[0.05] hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white group-hover:text-indigo-400 transition-colors">Student Entry</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Authenticate via @iitbhilai.ac.in</p>
                </div>
              </div>
              <span className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300 font-bold">→</span>
            </Link>

            {/* Vendor Card */}
            <Link 
              href="/login/vendor"
              className="group flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] p-4.5 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/[0.05] hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white group-hover:text-orange-400 transition-colors">Campus Vendor</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage live counters & store metrics</p>
                </div>
              </div>
              <span className="text-slate-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-300 font-bold">→</span>
            </Link>

            {/* Administrator Card */}
            <Link 
              href="/login/admin"
              className="group flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] p-4.5 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/[0.05] hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-500/5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:bg-rose-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-rose-500/30 transition-all duration-300">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white group-hover:text-rose-400 transition-colors">Core Infrastructure</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Global configuration & administrative access</p>
                </div>
              </div>
              <span className="text-slate-600 group-hover:text-rose-400 group-hover:translate-x-1 transition-all duration-300 font-bold">→</span>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}