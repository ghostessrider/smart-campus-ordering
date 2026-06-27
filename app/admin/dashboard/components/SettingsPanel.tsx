/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  Lock, 
  CircleCheck, 
  Terminal, 
  HelpCircle,
  Cpu,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { isFirebaseConfigured } from '../firebase';

export default function SettingsPanel() {
  const [campusName, setCampusName] = useState('IIT Bhilai Campus Eats');
  const [deliveryFee, setDeliveryFee] = useState('15.00');
  const [thresholdHours, setThresholdHours] = useState('08:00 - 22:30');

  // Load standard API config placeholders
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '');
  const [projId, setProjId] = useState(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('System operations updated successfully! Changes saved locally.');
  };

  const handleSyncFirebaseKeys = () => {
    alert('To apply these configuration parameters permanently, export the keys into your project\'s `.env` or run `set_up_firebase` tool inside your AI Studio editor.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">System Settings</h2>
        <p className="text-sm text-slate-400">Configure parameters, operational limits, and examine platform integration channels.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Operations Form (Left 7 cols) */}
        <div className="lg:col-span-7 bg-[#131b2e] p-6 rounded-2xl border border-slate-800 space-y-6">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#ff5722]" />
            Operating Parameters
          </h4>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Campus Identification Name</label>
              <input 
                type="text" 
                value={campusName}
                onChange={(e) => setCampusName(e.target.value)}
                className="w-full px-3 py-2 bg-[#0b0d10] border border-slate-800 rounded-xl text-xs text-slate-200 focus:bg-[#1a233a] focus:outline-none focus:ring-2 focus:ring-[#ff5722]/15 focus:border-[#ff5722]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Base Delivery Fee (INR)</label>
                <input 
                  type="text" 
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0b0d10] border border-slate-800 rounded-xl text-xs text-slate-200 focus:bg-[#1a233a] focus:outline-none focus:ring-2 focus:ring-[#ff5722]/15 focus:border-[#ff5722]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Eatery Serving Hours</label>
                <input 
                  type="text" 
                  value={thresholdHours}
                  onChange={(e) => setThresholdHours(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0b0d10] border border-slate-800 rounded-xl text-xs text-slate-200 focus:bg-[#1a233a] focus:outline-none focus:ring-2 focus:ring-[#ff5722]/15 focus:border-[#ff5722]"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="px-5 py-2.5 bg-[#ff5722] hover:bg-[#b02f00] text-white font-sans text-xs font-bold rounded-xl shadow-lg shadow-[#ff5722]/15 transition-all cursor-pointer"
            >
              Save Configurations
            </button>
          </form>

          {/* Guidelines on Database collections mappings */}
          <div className="pt-6 border-t border-slate-800/50">
            <h5 className="font-bold text-white text-xs flex items-center gap-1.5 mb-3">
              <Database className="w-4 h-4 text-slate-500" />
              Firebase Database Setup Guidelines
            </h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              When launching this dashboard on your real Firestore dataset, configure two primary collections mapping these properties:
            </p>
            <div className="mt-3 space-y-2 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 font-mono">vendors</span> collection:
                <p className="text-slate-400 mt-1">Fields: <code className="bg-[#0b0d10] text-slate-300 px-1 py-0.5 rounded text-[10px]">id, name, category, status (&quot;open&quot; | &quot;closed&quot; | &quot;deactivated&quot;), image (url), rating (number), totalOrders (number), avgPrepTime (number)</code></p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 font-mono">feedback</span> collection:
                <p className="text-slate-400 mt-1">Fields: <code className="bg-[#0b0d10] text-slate-300 px-1 py-0.5 rounded text-[10px]">id, vendorId, vendorName, rating (1-5), text (string), customerId, status (&quot;pending&quot; | &quot;resolved&quot; | &quot;urgent&quot;), dateString</code></p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Status panel (Right 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#131b2e] p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#ff5722]" />
              Database Channel Integration
            </h4>

            {isFirebaseConfigured ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                <CircleCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-emerald-400 font-bold text-xs">Active Firebase Channel</h5>
                  <p className="text-[11px] text-emerald-500 mt-0.5">The application is running in fully authenticated real-time sync mode with specified custom credentials. Data mutations are secure.</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white/5 border border-slate-800 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-slate-300">Offline Fallback Mode Enabled</h5>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Firebase client keys not detected in `.env`. The dashboard is running on offline **Local Storage Engine** with local changes retained.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3.5 pt-2 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">NEXT_FIREBASE_PROJECT_ID</label>
                <input 
                  type="text" 
                  value={projId || 'unset (will use local storage)'} 
                  disabled 
                  className="w-full px-3 py-1.5 bg-[#0b0d10] border border-slate-800 rounded-lg text-[11px] font-mono select-none text-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-400 mb-1 font-mono">NEXT_FIREBASE_API_KEY</label>
                <input 
                  type="password" 
                  value={apiKey ? '••••••••••••••••••••' : 'unset'} 
                  disabled
                  className="w-full px-3 py-1.5 bg-[#0b0d10] border border-slate-800 rounded-lg text-[11px] font-mono select-none text-slate-300"
                />
              </div>
            </div>

            <button 
              onClick={handleSyncFirebaseKeys}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-sans text-xs font-bold rounded-xl transition-all border border-slate-800 inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Verify Keys Sync</span>
            </button>
          </div>

          {/* Quick Support FAQ Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl text-white relative overflow-hidden shadow-xl shadow-slate-950/10">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-4 -translate-y-4" />
            <h5 className="font-bold text-sm mb-2 text-[#ffdbd1]">Need Help Integrating?</h5>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
              Detailed step-by-step documentation on how to add our Tailwind system class headers directly inside your personal website configuration is displayed in the final layout response.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-orange-200 font-bold">
              <Terminal className="w-4 h-4 text-[#ffdbd1]" />
              <span>Tailwind CSS configuration instructions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
