"use client";
import React from "react";

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          System Governance
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400 font-mono">
          SECURE ADMINISTRATIVE GATEWAY
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-slate-700">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-slate-300">Admin Identifier</label>
              <div className="mt-1">
                <input type="email" required className="appearance-none block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm placeholder-slate-500 text-slate-100 bg-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Security Passcode</label>
              <div className="mt-1">
                <input type="password" required className="appearance-none block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm placeholder-slate-500 text-slate-100 bg-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                Authorize Session
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}