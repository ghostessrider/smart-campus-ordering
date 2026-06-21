/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState } from 'react';
import { 
  Store, 
  ShoppingBag, 
  MessageSquare, 
  Star, 
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Calendar,
  Download,
  Flame,
  Award
} from 'lucide-react';
import { Vendor, FeedbackItem, FeedbackStatus, TabType } from '../types';

interface DashboardOverviewProps {
  vendors: Vendor[];
  feedback: FeedbackItem[];
  onNavigateToTab: (tab: any) => void;
}

export default function DashboardOverview({ vendors, feedback, onNavigateToTab }: DashboardOverviewProps) {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  // Compute stats dynamically
  const totalVendorsCount = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'open').length;
  const totalReviews = feedback.length;
  const avgRating = totalReviews > 0 
    ? parseFloat((feedback.reduce((sum, f) => sum + f.rating, 0) / totalReviews).toFixed(1)) 
    : 4.8;
    
  const pendingCount = feedback.filter(f => f.status === FeedbackStatus.PENDING).length;

  // Let's identify the top performing vendor by rating or revenue
  const topVendor = vendors.reduce((top, current) => {
    return (current.rating > top.rating) ? current : top;
  }, vendors[0] || { id: "", name: "N/A", category: "N/A", status: "open", icon: "", rating: 0, totalOrders: 0, avgPrepTime: 0, monthlyRevenue: 0, satisfaction: 0, image: "" } as Vendor);

  // Weekly feedback volumes mock tracker scaled dynamically
  const weeklyData = [
    { label: 'Wk 1', count: 180 },
    { label: 'Wk 2', count: 240 },
    { label: 'Wk 3', count: 310 },
    { label: 'Wk 4', count: 428 }
  ];

  return (
    <div className="space-y-6">
      {/* Upper Title and Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Overview Dashboard</h2>
          <p className="text-sm text-slate-500">Live operational vitals and feedback metrics for your campus.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer"
            >
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>All Time</option>
            </select>
          </div>
          <button 
            onClick={() => alert("Report downloaded successfully to admin-bundle-report.csv")}
            className="flex items-center gap-1.5 bg-[#ff5722] hover:bg-[#b02f00] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-[#ff5722]/15 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Vendors */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-[0px_2px_4px_rgba(0,0,0,0.01)] transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-[#ff5722] rounded-xl">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
              +12% <TrendingUp className="w-3 w-3" />
            </span>
          </div>
          <div>
            <p className="text-slate-400 font-sans text-xs font-semibold uppercase tracking-wider">Total Vendors</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalVendorsCount}</h3>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-[0px_2px_4px_rgba(0,0,0,0.01)] transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 text-red-500 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-slate-500 font-bold text-xs flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
              Real-time
            </span>
          </div>
          <div>
            <p className="text-slate-400 font-sans text-xs font-semibold uppercase tracking-wider">Active Orders</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">156</h3>
          </div>
        </div>

        {/* Total Feedback */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-[0px_2px_4px_rgba(0,0,0,0.01)] transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
              +5% <TrendingUp className="w-3 w-3" />
            </span>
          </div>
          <div>
            <p className="text-slate-400 font-sans text-xs font-semibold uppercase tracking-wider">Total Feedbacks</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalReviews}</h3>
          </div>
        </div>

        {/* Avg Rating */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-[0px_2px_4px_rgba(0,0,0,0.01)] transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-[#ff5722] rounded-xl">
              <Star className="w-5 h-5 fill-amber-400 stroke-amber-500" />
            </div>
            <div className="flex -space-x-1.5">
              <img className="w-6 h-6 rounded-full border border-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&h=60&q=80" alt="avatar" />
              <img className="w-6 h-6 rounded-full border border-white" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=60&h=60&q=80" alt="avatar" />
            </div>
          </div>
          <div>
            <p className="text-slate-400 font-sans text-xs font-semibold uppercase tracking-wider">Avg Rating</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{avgRating} <span className="text-slate-400 text-sm font-normal">/ 5.0</span></h3>
          </div>
        </div>
      </div>

      {/* Middle Core Section: Feedback Charts and Spotlight vendor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trend Area Chart (8/12 Columns) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-bold text-slate-950 font-sans text-base">Feedback Volume Trends</h4>
              <p className="text-xs text-slate-500">Weekly customer submission ratios for the platform</p>
            </div>
            <div className="flex gap-4 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#ff5722] rounded-full inline-block" />
                <span>Complaints / Reviews</span>
              </div>
            </div>
          </div>

          {/* SVG Scaled Plot */}
          <div className="w-full flex-1 min-h-[220px] relative mt-2">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 240">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ff5722" stopOpacity="0.18"></stop>
                  <stop offset="100%" stopColor="#ff5722" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line stroke="#f1f5f9" strokeWidth="1" x1="0" x2="800" y1="40" y2="40"></line>
              <line stroke="#f1f5f9" strokeWidth="1" x1="0" x2="800" y1="110" y2="110"></line>
              <line stroke="#f1f5f9" strokeWidth="1" x1="0" x2="800" y1="180" y2="180"></line>

              {/* Area Plot */}
              <path 
                d="M 10 200 Q 200 160, 300 175 T 500 80 T 700 95 T 800 35 L 800 240 L 0 240 Z" 
                fill="url(#chartGradient)"
              ></path>
              
              {/* Path Border Line */}
              <path 
                d="M 10 200 Q 200 160, 300 175 T 500 80 T 700 95 T 800 35" 
                fill="none" 
                stroke="#ff5722" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              ></path>
              
              {/* Highlight Dot */}
              <circle cx="800" cy="35" r="5" fill="#ff5722" stroke="white" strokeWidth="2" className="animate-ping" />
              <circle cx="800" cy="35" r="4.5" fill="#ff5722" stroke="white" strokeWidth="2" />
            </svg>
            
            {/* Axis Labels */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold px-2 mt-2">
              <span>WK 1</span>
              <span>WK 2</span>
              <span>WK 3</span>
              <span>WK 4</span>
            </div>
          </div>
        </div>

        {/* Top Performing Vendor Card Spotlight (4/12 Columns) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.01)] flex flex-col justify-between">
          <div className="relative h-40">
            <img 
              alt="gourmet burger highlight"
              className="w-full h-full object-cover brightness-[0.7]" 
              src={topVendor.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute top-4 left-4 bg-emerald-500 text-white font-sans text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
              <Award className="w-3 h-3 fill-white" />
              Top Spotlight
            </div>
            
            <div className="absolute bottom-4 left-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 border border-slate-100 shadow-md">
                <span className="text-xs font-bold text-[#ff5722]">🏆</span>
              </div>
              <div>
                <h5 className="text-white font-bold text-sm tracking-tight">{topVendor.name}</h5>
                <p className="text-[11px] text-[#ffb5a0] font-sans font-medium">{topVendor.category}</p>
              </div>
            </div>
          </div>
          
          <div className="p-5 flex-1 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Estimated Revenue</span>
                <span className="text-sm font-bold text-slate-900 font-mono">${(topVendor.monthlyRevenue || 12480).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Satisfaction Factor</span>
                <div className="flex items-center gap-1 font-bold text-sm text-[#ff5722]">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                  <span>{topVendor.rating || 4.9}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigateToTab(TabType.VENDORS)}
              className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-[#ff5722] hover:text-[#b02f00] rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-colors inline-flex justify-center items-center gap-2 cursor-pointer"
            >
              <span>View Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Live Feed Ticker of complaints */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-[0px_1px_2px_rgba(0,0,0,0.01)]">
        <div className="px-6 py-4 border-b border-slate-150/60 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Critical Complaints & Activity Feed</h4>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
              <span className="w-2.5 h-2.5 bg-[#ff5722] rounded-full inline-block animate-ping" />
              <span>Real-time tracking of issues across delivery lines</span>
            </div>
          </div>
          <button 
            onClick={() => onNavigateToTab(TabType.FEEDBACK)}
            className="text-xs font-bold text-[#ff5722] hover:text-[#b02f00] underline"
          >
            Manage Feed
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {feedback.slice(0, 3).map((item) => (
            <div 
              key={item.id} 
              onClick={() => onNavigateToTab(TabType.FEEDBACK)}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/65 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3.5 md:w-3/12">
                <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" alt="student avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs">{item.customerName}</h5>
                  <p className="text-[10px] text-slate-400 font-medium">{item.customerHandle}</p>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < item.rating ? 'fill-amber-400' : 'text-slate-200'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                    {item.vendorName}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed">
                  &quot;{item.text}&quot;
                </p>
              </div>

              <div className="flex flex-col items-end shrink-0 md:w-2/12">
                <span className="text-[10px] text-[#ff5722] font-semibold">{item.timeAgo}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase mt-1 ${
                  item.status === FeedbackStatus.URGENT 
                    ? 'bg-rose-100 text-rose-600' 
                    : item.status === FeedbackStatus.PENDING 
                    ? 'bg-amber-100 text-amber-600' 
                    : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
