/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  PhoneCall,
  UserCheck,
  Eye,
  AlertTriangle,
  Flame,
  MessageCircleOff
} from 'lucide-react';
import { FeedbackItem, FeedbackStatus } from '../types';

interface FeedbackCenterProps {
  feedback: FeedbackItem[];
  setFeedback: React.Dispatch<React.SetStateAction<FeedbackItem[]>>;
  onResolveFeedback: (id: string) => void;
  onContactCustomer: (email: string, text: string) => void;
}

export default function FeedbackCenter({ feedback, setFeedback, onResolveFeedback, onContactCustomer }: FeedbackCenterProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Calculate dynamic stats
  const totalReportsCount = feedback.length;
  const pendingCount = feedback.filter(f => f.status === FeedbackStatus.PENDING).length;
  const resolvedCount = feedback.filter(f => f.status === FeedbackStatus.RESOLVED || f.status === FeedbackStatus.REPLIED).length;
  const urgentCount = feedback.filter(f => f.status === FeedbackStatus.URGENT).length;

  // Filter and search feedback items
  const filteredFeedback = feedback.filter((item) => {
    const matchesSearch = item.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.customerId.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (activeCategory === 'pending') {
      matchesCategory = item.status === FeedbackStatus.PENDING;
    } else if (activeCategory === 'resolved') {
      matchesCategory = item.status === FeedbackStatus.RESOLVED;
    } else if (activeCategory === 'urgent') {
      matchesCategory = item.status === FeedbackStatus.URGENT;
    }

    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalEntries = filteredFeedback.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFeedback = filteredFeedback.slice(startIndex, startIndex + itemsPerPage);

  const handleResolveAction = (id: string, vendorName: string) => {
    onResolveFeedback(id);
    alert(`Issue identified under ${vendorName} has been labeled as RESOLVED. Notifications dispatched to the customer.`);
  };

  const handleContactCustomer = (customerId: string, clientName: string) => {
    onContactCustomer(customerId, `Initiating direct message thread to student ${clientName}`);
    alert(`Direct Message gateway initialized. Connecting admin terminal voice console to ${clientName} (${customerId})...`);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Feedback Center</h2>
          <p className="text-sm text-slate-400">Examine and resolve student complaints, food quality issues, and delivery delays.</p>
        </div>
      </div>

      {/* Stats Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total stats */}
        <div className="bg-[#131b2e] p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center gap-4 hover:border-slate-700 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-[#ff5722] shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Reports</p>
            <p className="text-2xl font-black text-slate-200 leading-tight mt-0.5">{totalReportsCount * 12 + 12}</p>
          </div>
        </div>

        {/* Pending Card Spotlight - styled exactly like the highlighted pending widget! */}
        <div className="bg-[#131b2e] p-5 rounded-2xl border-l-4 border-l-rose-500 border border-slate-800 shadow-sm flex items-center gap-4 hover:border-slate-700 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Review</p>
            <p className="text-2xl font-black text-slate-200 leading-tight mt-0.5">{pendingCount + urgentCount}</p>
          </div>
        </div>

        {/* Resolved stats */}
        <div className="bg-[#131b2e] p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center gap-4 hover:border-slate-700 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0">
            <CheckCircle className="w-6 h-6 stroke-teal-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Issues Resolved</p>
            <p className="text-2xl font-black text-slate-200 leading-tight mt-0.5">{resolvedCount * 12}</p>
          </div>
        </div>

        {/* Response statistics */}
        <div className="bg-[#131b2e] p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center gap-4 hover:border-slate-700 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Response</p>
            <p className="text-2xl font-black text-slate-200 leading-tight mt-0.5">14m</p>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#131b2e] p-4 rounded-2xl border border-slate-800">
        
        {/* Urgency selection category pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'pending', label: 'Pending' },
            { id: 'resolved', label: 'Resolved' },
            { id: 'urgent', label: 'Urgent 🔥' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id 
                  ? 'bg-[#ff5722] text-white shadow-md shadow-[#ff5722]/15' 
                  : 'bg-[#0b0d10] text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Global filter search input */}
        <div className="relative w-full md:w-80 border-slate-200">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search feedback or orders..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-[#0b0d10] border border-slate-800 rounded-xl text-xs text-slate-200 focus:bg-[#1a233a] focus:outline-none focus:ring-2 focus:ring-[#ff5722]/20 focus:border-[#ff5722]"
          />
        </div>
      </div>

      {/* FEEDBACK LISTS CARDS */}
      <div className="space-y-4">
        {paginatedFeedback.length > 0 ? (
          paginatedFeedback.map((item) => (
            <div 
              key={item.id} 
              className={`bg-[#131b2e] border border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:shadow-black/20 transition-all group ${
                item.status === FeedbackStatus.URGENT ? 'border-l-4 border-l-rose-500' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row gap-5">
                
                {/* Overlapping Rounded Circular Logo */}
                <div className="shrink-0 flex items-start">
                  <div className="w-14 h-14 rounded-full border border-slate-800 p-1 bg-[#0b0d10] overflow-hidden shrink-0 shadow-sm group-hover:scale-105 duration-200">
                    {item.vendorImage ? (
                      <img 
                        alt={item.vendorName} 
                        className="w-full h-full object-cover rounded-full" 
                        src={item.vendorImage} 
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900/50 rounded-full flex items-center justify-center text-slate-400">
                        <span className="text-xs font-bold">{item.vendorName?.charAt(0) || '?'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Main Body */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-white group-hover:text-[#ff5722] transition-colors text-base">{item.vendorName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star 
                              key={idx} 
                              className={`w-4 h-4 ${idx < item.rating ? 'fill-amber-400' : 'text-slate-700'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-slate-400 ml-1 font-mono">{item.orderNumber}</span>
                      </div>
                    </div>
                    
                    <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-sm ${
                      item.status === FeedbackStatus.RESOLVED 
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' 
                        : item.status === FeedbackStatus.URGENT 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 font-extrabold animate-pulse' 
                        : item.status === FeedbackStatus.REPLIED
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Comment quoted text */}
                  <p className="text-sm font-sans text-slate-300 leading-relaxed italic pr-4">
                    &quot;{item.text}&quot;
                  </p>

                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pt-4 border-t border-slate-800/50">
                    <span className="text-xs text-slate-400 font-medium">
                      {item.timeAgo} &bull; Customer: <span className="font-semibold text-slate-200">{item.customerId}</span> ({item.customerName})
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleContactCustomer(item.customerId, item.customerName)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-sans text-xs font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Contact Customer</span>
                      </button>

                      {item.status !== FeedbackStatus.RESOLVED && (
                        <button 
                          onClick={() => handleResolveAction(item.id, item.vendorName)}
                          className="px-4 py-2 bg-[#ff5722] hover:bg-[#b02f00] text-white font-sans text-xs font-bold rounded-lg shadow-md shadow-[#ff5722]/10 hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <UserCheck className="w-3.5 h-3.5 mb-0.5" />
                          <span>Resolve Issue</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <MessageCircleOff className="w-12 h-12 text-slate-700 mb-3" />
            <p className="font-bold text-slate-300 text-sm">No feedback matching filters found</p>
            <p className="text-xs text-slate-500 mt-1">Try relaxing active search inputs or categories.</p>
          </div>
        )}
      </div>

      {/* Pagination component Row */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-6">
        <p className="text-xs text-slate-400 font-semibold">
          Showing <span className="text-white">{startIndex + 1}</span> to{' '}
          <span className="text-white">
            {Math.min(startIndex + itemsPerPage, totalEntries)}
          </span>{' '}
          of <span className="text-white">{totalEntries}</span> logs
        </p>
        
        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-2 border border-slate-800 rounded-xl hover:bg-white/5 transition-colors disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-slate-500" />
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-9 h-9 text-xs rounded-xl font-bold transition-all cursor-pointer ${
                currentPage === i + 1 
                  ? 'bg-[#ff5722] text-white' 
                  : 'hover:bg-white/5 text-slate-400'
              }`}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="p-2 border border-slate-800 rounded-xl hover:bg-white/5 transition-colors disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
