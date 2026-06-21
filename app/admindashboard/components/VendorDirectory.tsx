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
}

export default function VendorDirectory({ vendors, setVendors, onSaveVendor, onDeleteVendor, onToggleStatus }: VendorDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('popularity');
  const [isAddingVendor, setIsAddingVendor] = useState(false);

  // New Vendor Form States
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorCategory, setNewVendorCategory] = useState('');
  const [newVendorStatus, setNewVendorStatus] = useState<VendorStatus>(VendorStatus.OPEN);
  const [newVendorIcon, setNewVendorIcon] = useState('UtensilsCrossed');
  const [newVendorPrep, setNewVendorPrep] = useState('10');
  const [formError, setFormError] = useState('');

  // Icon mapping
  const renderVendorIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'coffee':
        return <Coffee className="w-8 h-8 text-[#ff5722]" />;
      case 'ramen':
        return <Flame className="w-8 h-8 text-[#ff5722]" />;
      case 'burger':
        return <UtensilsCrossed className="w-8 h-8 text-[#ff5722]" />;
      case 'pizza':
        return <Pizza className="w-8 h-8 text-[#ff5722]" />;
      default:
        return <Store className="w-8 h-8 text-[#ff5722]" />;
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

  const handleAddNewVendor = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newVendorName.trim() || !newVendorCategory.trim()) {
      setFormError('Please fill out all required fields.');
      return;
    }

    const mockImages = [
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
    ];

    const randomImg = mockImages[Math.floor(Math.random() * mockImages.length)];

    const newVendor: Vendor = {
      id: 'v_' + Date.now(),
      name: newVendorName,
      category: newVendorCategory,
      status: newVendorStatus,
      image: randomImg,
      icon: newVendorIcon.toLowerCase(),
      rating: 5.0,
      totalOrders: 0,
      avgPrepTime: parseInt(newVendorPrep) || 12,
      monthlyRevenue: 0,
      satisfaction: 5.0
    };

    onSaveVendor(newVendor);
    setIsAddingVendor(false);
    
    // Reset Form
    setNewVendorName('');
    setNewVendorCategory('');
    setNewVendorStatus(VendorStatus.OPEN);
    setNewVendorIcon('UtensilsCrossed');
    setNewVendorPrep('10');
  };

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
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Vendor Directory</h2>
          <p className="text-sm text-slate-500">Add, configure, and monitor cafeteria eateries and delivery stations.</p>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        
        {/* Sorting and Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Status Selection Buttons */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            {['all', 'open', 'closed', 'deactivated'].map((opt) => (
              <button
                key={opt}
                onClick={() => setStatusFilter(opt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  statusFilter === opt 
                    ? 'bg-white text-slate-900 shadow-sm font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Sort Menu Select */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600">
            <SlidersHorizontal className="w-3.5 h-3.5 ml-1.5 text-slate-400" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent border-none p-1 focus:outline-none focus:ring-0 cursor-pointer"
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
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20 focus:border-[#ff5722] transition-all"
            />
          </div>

          <button 
            onClick={() => setIsAddingVendor(true)}
            className="flex items-center justify-center gap-2 bg-[#ff5722] hover:bg-[#b02f00] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-[#ff5722]/15 transition-all text-center cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Vendor</span>
          </button>
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
              className={`bg-white border border-slate-200/95 rounded-2xl overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-[#131b2e]/5 hover:-translate-y-0.5 transition-all duration-300 relative ${
                isDeactivated ? 'opacity-85 grayscale' : ''
              }`}
            >
              <div className="relative h-36 bg-slate-100 overflow-hidden">
                <img 
                  alt={vendor.name} 
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80`}
                  src={vendor.image} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-sm ${
                    vendor.status === VendorStatus.OPEN 
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
                <div className="w-16 h-16 rounded-full border-4 border-white bg-white flex items-center justify-center shadow-md mb-3">
                  {renderVendorIcon(vendor.icon)}
                </div>

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-950 text-base leading-tight group-hover:text-[#ff5722] transition-colors">{vendor.name}</h3>
                    <p className="text-slate-500 text-xs mt-0.5">{vendor.category}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-orange-500 font-bold text-sm bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-orange-400 stroke-orange-500" />
                    <span>{Number(vendor.rating ?? 0).toFixed(1)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-4 border-y border-slate-100 py-3 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Total Orders</span>
                    <span className="font-bold text-sm text-slate-900 font-mono block mt-0.5">
                      {Number(vendor.totalOrders ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Avg Prep</span>
                    <span className="font-bold text-sm text-slate-900 font-mono block mt-0.5">
                      {vendor.avgPrepTime}m
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-3 flex items-center justify-between">
                  <button 
                    onClick={() => toggleVendorStatus(vendor.id, vendor.status)}
                    className="text-[#ff5722] hover:text-[#b02f00] font-sans text-xs font-bold hover:underline cursor-pointer"
                  >
                    {vendor.status === VendorStatus.DEACTIVATED ? 'Reactivate' : 'Toggle Status'}
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => onDeleteVendor(vendor.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-red-500 border border-slate-200 transition-colors cursor-pointer"
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

        {/* Empty Add New Vendor Box UI */}
        <div 
          onClick={() => setIsAddingVendor(true)}
          className="border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-8 bg-slate-50/50 hover:bg-slate-100/50 hover:border-[#ff5722]/50 transition-all cursor-pointer group hover:-translate-y-0.5 duration-300 h-full min-h-[300px]"
        >
          <div className="w-12 h-12 rounded-full bg-slate-200/70 border border-slate-300 group-hover:scale-110 group-hover:bg-orange-100 group-hover:border-orange-200 flex items-center justify-center mb-3 transition-all">
            <Plus className="w-6 h-6 text-slate-500 group-hover:text-[#ff5722]" />
          </div>
          <p className="font-bold text-slate-800 text-sm">Onboard New Eatery</p>
          <p className="text-xs text-slate-400 text-center mt-1.5 max-w-[200px] leading-relaxed">
            Register and license a new cafeteria station or private vendor food truck.
          </p>
        </div>
      </div>

      {/* Onboard Vendor Dialog Backdrop and Popover Modal overlay */}
      {isAddingVendor && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm" onClick={() => setIsAddingVendor(false)} />
          
          <div className="bg-white rounded-2xl border border-slate-200 relative max-w-md w-full shadow-2xl p-6 z-10 transition-all transform scale-100">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h4 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Store className="w-5 h-5 text-[#ff5722]" />
                Onboard Campus Vendor
              </h4>
              <button 
                onClick={() => setIsAddingVendor(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewVendor} className="mt-4 space-y-4">
              {formError && (
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-600">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Eatery Name *</label>
                <input 
                  type="text" 
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  placeholder="e.g., Main Street Falafel"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20 focus:border-[#ff5722]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Category description *</label>
                <input 
                  type="text" 
                  value={newVendorCategory}
                  onChange={(e) => setNewVendorCategory(e.target.value)}
                  placeholder="e.g., Quick Mediterranean & Bowls"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20 focus:border-[#ff5722]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Prep Estimate (mins)</label>
                  <input 
                    type="number" 
                    value={newVendorPrep}
                    onChange={(e) => setNewVendorPrep(e.target.value)}
                    placeholder="10"
                    min="1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20 focus:border-[#ff5722]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Default Status</label>
                  <select 
                    value={newVendorStatus}
                    onChange={(e) => setNewVendorStatus(e.target.value as VendorStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20 focus:border-[#ff5722]"
                  >
                    <option value={VendorStatus.OPEN}>Open</option>
                    <option value={VendorStatus.CLOSED}>Closed</option>
                    <option value={VendorStatus.DEACTIVATED}>Deactivated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Representation Icon</label>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { id: 'UtensilsCrossed', label: 'General', icon: UtensilsCrossed },
                    { id: 'Coffee', label: 'Drinks', icon: Coffee },
                    { id: 'Ramen', label: 'Hot Food', icon: Flame },
                    { id: 'Pizza', label: 'Baking', icon: Pizza }
                  ].map((item) => {
                    const ThemeIcon = item.icon;
                    const IsSelected = newVendorIcon === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setNewVendorIcon(item.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center ${
                          IsSelected 
                            ? 'bg-orange-50 border-[#ff5722] text-[#ff5722]' 
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <ThemeIcon className="w-5 h-5 mb-1" />
                        <span className="text-[9px] font-bold">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddingVendor(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#ff5722] hover:bg-[#b02f00] text-white font-sans text-xs font-bold rounded-xl shadow-lg shadow-[#ff5722]/10 transition-colors cursor-pointer"
                >
                  Save Eatery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
