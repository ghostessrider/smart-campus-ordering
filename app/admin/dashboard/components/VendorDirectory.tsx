/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState } from 'react';
import {
  Store,
  Search,
  Plus,
  Star,
  Coffee,
  Flame,
  UtensilsCrossed,
  Pizza,
  SlidersHorizontal,
  ChevronDown,
  Trash2,
  Sliders,
  Settings2,
  X,
  XCircle,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { Vendor, VendorStatus } from '../types';

interface VendorDirectoryProps {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  onSaveVendor: (vendor: Vendor) => void;
  onDeleteVendor: (vendorId: string) => void;
  onToggleStatus: (vendorId: string, nextStatus: VendorStatus) => void;
  onVendorClick: (vendorId: string) => void;
}

export default function VendorDirectory({ vendors, setVendors, onSaveVendor, onDeleteVendor, onToggleStatus, onVendorClick }: VendorDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('popularity');

  // Icon mapping
  const renderVendorIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'coffee':
        return <Coffee className="w-8 h-8 text-[#f2a93b]" />;
      case 'ramen':
        return <Flame className="w-8 h-8 text-[#f2a93b]" />;
      case 'burger':
        return <UtensilsCrossed className="w-8 h-8 text-[#f2a93b]" />;
      case 'pizza':
        return <Pizza className="w-8 h-8 text-[#f2a93b]" />;
      default:
        return <Store className="w-8 h-8 text-[#f2a93b]" />;
    }
  };

  // Filter and sort vendors
  const filteredVendors = vendors
    .filter((v) => {
      const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || v.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOption === 'popularity') return b.totalOrders - a.totalOrders;
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'preptime') return a.avgPrepTime - b.avgPrepTime;
      return a.name.localeCompare(b.name);
    });

  const toggleVendorStatus = (id: string, currentStatus: VendorStatus) => {
    let nextStatus = VendorStatus.OPEN;
    if (currentStatus === VendorStatus.OPEN) nextStatus = VendorStatus.CLOSED;
    else if (currentStatus === VendorStatus.CLOSED) nextStatus = VendorStatus.DEACTIVATED;
    onToggleStatus(id, nextStatus);
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Vendor Directory</h2>
          <p className="text-sm text-slate-400">Add, configure, and monitor cafeteria eateries and delivery stations.</p>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#12151a] p-4 rounded-2xl border border-slate-800">

        {/* Sorting and Status Filters */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Status Selection Buttons */}
          <div className="inline-flex rounded-xl bg-[#0b0d10] p-1 border border-slate-800">
            {['all', 'open', 'closed', 'deactivated'].map((opt) => (
              <button
                key={opt}
                onClick={() => setStatusFilter(opt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${statusFilter === opt
                    ? 'bg-white/10 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Sort Menu Select */}
          <div className="flex items-center gap-1.5 bg-[#0b0d10] p-1 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 ml-1.5 text-slate-500" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent border-none p-1 focus:outline-none focus:ring-0 cursor-pointer text-slate-300"
            >
              <option value="popularity">Popularity (Orders)</option>
              <option value="rating">Rating</option>
              <option value="preptime">Avg Prep Time</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Global Search box and adding CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0b0d10] border border-slate-800 rounded-xl text-sm font-sans text-slate-200 focus:bg-[#1a233a] focus:outline-none focus:ring-2 focus:ring-[#f2a93b]/20 focus:border-[#f2a93b] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Render actual dynamically filtered cards */}
        {filteredVendors.map((vendor) => {
          const isDeactivated = vendor.status === VendorStatus.DEACTIVATED;
          return (
            <div
              key={vendor.id}
              className={`bg-[#12151a] border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 relative ${isDeactivated ? 'opacity-85 grayscale' : ''
                }`}
            >
              <div className="relative h-36 bg-slate-900/50 overflow-hidden">
                {vendor.image ? (
                  <img
                    alt={vendor.name}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80`}
                    src={vendor.image}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-sm ${vendor.status === VendorStatus.OPEN
                      ? 'bg-[#81f5f2] text-[#00201f]'
                      : vendor.status === VendorStatus.CLOSED
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-200 text-slate-700 border border-slate-300'
                    }`}>
                    {vendor.status}
                  </span>
                </div>
              </div>

              <div className="px-5 pb-5 -mt-8 flex-1 flex flex-col relative z-10">
                <div className="w-16 h-16 rounded-full border-4 border-[#12151a] bg-[#0b0d10] flex items-center justify-center shadow-md mb-3">
                  {renderVendorIcon(vendor.icon)}
                </div>

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <button onClick={() => onVendorClick(vendor.id)} className="text-left cursor-pointer group/name">
                      <h3 className="font-bold text-white text-base leading-tight group-hover/name:text-[#f2a93b] transition-colors">{vendor.name}</h3>
                    </button>
                    <p className="text-slate-400 text-xs mt-0.5">{vendor.category}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-orange-400 font-bold text-sm bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-orange-400 stroke-orange-500" />
                    <span>{Number(vendor.rating ?? 0).toFixed(1)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-4 border-y border-slate-800/50 py-3 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Total Orders</span>
                    <span className="font-bold text-sm text-slate-200 font-mono block mt-0.5">
                      {Number(vendor.totalOrders ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Avg Prep</span>
                    <span className="font-bold text-sm text-slate-200 font-mono block mt-0.5">
                      {vendor.avgPrepTime}m
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-3 flex items-center justify-between">
                  <button
                    onClick={() => toggleVendorStatus(vendor.id, vendor.status)}
                    className="text-[#f2a93b] hover:text-[#f5b85c] font-sans text-xs font-bold hover:underline cursor-pointer"
                  >
                    {vendor.status === VendorStatus.DEACTIVATED ? 'Reactivate' : 'Toggle Status'}
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onDeleteVendor(vendor.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900/50 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 border border-slate-800 transition-colors cursor-pointer"
                      title="Onboard delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
