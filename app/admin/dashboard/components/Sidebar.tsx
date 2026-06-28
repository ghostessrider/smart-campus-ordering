/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Store, 
  MessageSquare, 
  Settings, 
  LogOut,
  UserPlus,
  User
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  vendorCount: number;
  pendingCount: number;
}

function CowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* ears */}
      <ellipse cx="10" cy="24" rx="8" ry="10" fill="currentColor" opacity="0.9" />
      <ellipse cx="54" cy="24" rx="8" ry="10" fill="currentColor" opacity="0.9" />
      {/* head */}
      <rect x="12" y="16" width="40" height="32" rx="16" fill="currentColor" />
      {/* muzzle */}
      <rect x="16" y="34" width="32" height="16" rx="8" fill="#0b0d10" opacity="0.85" />
      {/* nostrils */}
      <circle cx="25" cy="42" r="2.4" fill="currentColor" />
      <circle cx="39" cy="42" r="2.4" fill="currentColor" />
      {/* eyes */}
      <circle cx="22" cy="27" r="2.6" fill="#0b0d10" />
      <circle cx="42" cy="27" r="2.6" fill="#0b0d10" />
      {/* spot */}
      <path
        d="M40 16c4 0 8 3 8 8s-4 6-8 4-6-5-4-8 2-4 4-4z"
        fill="#0b0d10"
        opacity="0.85"
      />
    </svg>
  );
}

export default function Sidebar({ activeTab, setActiveTab, vendorCount, pendingCount }: SidebarProps) {
  const menuItems = [
    { id: TabType.VENDORS, label: 'All Vendors', icon: Store, badge: vendorCount.toString() },
    { id: TabType.VENDOR_REGISTRATION, label: 'Vendor Registration', icon: UserPlus },
    { id: TabType.FEEDBACK, label: 'Feedback', icon: MessageSquare, badge: pendingCount > 0 ? pendingCount.toString() : undefined, badgeColor: 'bg-red-500' },
    { id: TabType.SETTINGS, label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside 
        id="desktop-sidebar"
        className="hidden lg:flex flex-col h-full py-6 bg-[#12151a] border-r border-slate-800 fixed left-0 top-0 w-64 z-50 transition-all duration-300"
      >
        {/* Brand Header */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f2a93b]/15 flex items-center justify-center rounded-full shadow-lg shadow-[#f2a93b]/10">
            <CowIcon className="text-[#f2a93b] w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-lg text-white leading-tight tracking-wider">SMART COW</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>

        {/* Profile Card Summary */}
        <div className="mx-4 mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f2a93b]/10 border border-[#f2a93b]/20">
                <User className="w-5 h-5 text-[#f2a93b]" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#12151a]" />
            </div>
            <div className="overflow-hidden">
              <p className="font-sans font-semibold text-xs text-white truncate">Campus Admin</p>
              <p className="text-[9px] text-[#81f5f2] font-semibold tracking-wider uppercase">Super Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-[#f2a93b] text-white font-semibold shadow-lg shadow-[#f2a93b]/15' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Settings & Logout */}
        <div className="px-4 mt-auto">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-850/40 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">Vitals Sync Normal</span>
            </div>
            <button 
              onClick={() => alert("Admin safely logged out.")}
              title="Logout" 
              className="hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sticky Bottom Browser Navigation Bar */}
      <nav 
        id="mobile-bottom-nav"
        className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-[#12151a] border-t border-slate-800 flex justify-around items-center px-4 py-2 shadow-2xl rounded-t-2xl pb-safe"
      >
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 relative cursor-pointer ${
                isActive ? 'text-[#f2a93b]' : 'text-slate-400'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
              {item.badge && (
                <span className="absolute top-1 right-2 w-4 h-4 flex items-center justify-center bg-red-500 text-white font-bold rounded-full text-[8px]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
