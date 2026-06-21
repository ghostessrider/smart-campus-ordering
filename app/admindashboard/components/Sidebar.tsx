/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  MessageSquare, 
  Settings, 
  LogOut,
  Sparkle
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  vendorCount: number;
  pendingCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, vendorCount, pendingCount }: SidebarProps) {
  const menuItems = [
    { id: TabType.OVERVIEW, label: 'Overview', icon: LayoutDashboard },
    { id: TabType.VENDORS, label: 'Vendors', icon: Store, badge: vendorCount.toString() },
    { id: TabType.FEEDBACK, label: 'Feedback', icon: MessageSquare, badge: pendingCount > 0 ? pendingCount.toString() : undefined, badgeColor: 'bg-red-500' },
    { id: TabType.SETTINGS, label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside 
        id="desktop-sidebar"
        className="hidden lg:flex flex-col h-full py-6 bg-[#131b2e] border-r border-slate-800 fixed left-0 top-0 w-64 z-50 transition-all duration-300"
      >
        {/* Brand Header */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff5722] flex items-center justify-center rounded-lg shadow-lg shadow-[#ff5722]/20">
            <Sparkle className="text-white w-5 h-5 fill-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-lg text-white leading-tight">Campus Eats</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>

        {/* Profile Card Summary */}
        <div className="mx-4 mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-orange-100 overflow-hidden border border-orange-200">
                <img 
                  alt="Campus admin" 
                  className="w-full h-full object-cover" 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#131b2e]" />
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
                    ? 'bg-[#ff5722] text-white font-semibold shadow-lg shadow-[#ff5722]/15' 
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
        className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-[#131b2e] border-t border-slate-800 flex justify-around items-center px-4 py-2 shadow-2xl rounded-t-2xl pb-safe"
      >
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 relative cursor-pointer ${
                isActive ? 'text-[#ff5722]' : 'text-slate-400'
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
