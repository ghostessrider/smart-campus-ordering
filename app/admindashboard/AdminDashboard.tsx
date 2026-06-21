/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Menu, 
  Search, 
  Sparkles,
  Info,
  Database,
  CloudLightning,
  AlertCircle
} from 'lucide-react';
import { TabType, Vendor, FeedbackItem, FeedbackStatus, VendorStatus } from './types';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import VendorDirectory from './components/VendorDirectory';
import FeedbackCenter from './components/FeedbackCenter';
import SettingsPanel from './components/SettingsPanel';
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.OVERVIEW);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Initialize and Hydrate from standard Firestore database or fallback to localStorage
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setSyncError(null);

      if (isFirebaseConfigured && db) {
        try {
          console.log('[Firestore] Initiating live database fetch...');
          
          // 1. Load Vendors
          const vendorsCol = collection(db, 'vendors');
          const vendorsSnapshot = await getDocs(vendorsCol);
          let loadedVendors: Vendor[] = [];
          
          vendorsSnapshot.forEach((docSnap) => {
            loadedVendors.push({ id: docSnap.id, ...docSnap.data() } as Vendor);
          });

          // Check if we need to warn or log
          if (loadedVendors.length === 0) {
            console.log('[Firestore] Vendors collection is empty. Admin can now onboard vendors manually.');
          }

          // 2. Load Feedback
          const feedbackCol = collection(db, 'feedback');
          const feedbackSnapshot = await getDocs(feedbackCol);
          let loadedFeedback: FeedbackItem[] = [];

          feedbackSnapshot.forEach((docSnap) => {
            loadedFeedback.push({ id: docSnap.id, ...docSnap.data() } as FeedbackItem);
          });

          if (loadedFeedback.length === 0) {
            console.log('[Firestore] Feedback collection is empty.');
          }

          // Sort vendors and feedback logically
          setVendors(loadedVendors.sort((a, b) => b.totalOrders - a.totalOrders));
          setFeedback(loadedFeedback);
          console.log('[Firestore] Data loaded successfully from Firestore.');
        } catch (error: any) {
          console.error('[Firestore] Error syncing with database backend:', error);
          setSyncError(`Firestore connectivity warning: ${error.message || error}`);
          loadFallbackData();
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('[Offline Fallback] Firebase properties not found. Accessing Client Storage Engine...');
        loadFallbackData();
        setIsLoading(false);
      }
    }

    function loadFallbackData() {
      const storedVendors = localStorage.getItem('campuseats_vendors');
      const storedFeedback = localStorage.getItem('campuseats_feedback');

      if (storedVendors) {
        try {
          setVendors(JSON.parse(storedVendors));
        } catch (e) {
          setVendors([]);
        }
      } else {
        setVendors([]);
        localStorage.setItem('campuseats_vendors', JSON.stringify([]));
      }

      if (storedFeedback) {
        try {
          setFeedback(JSON.parse(storedFeedback));
        } catch (e) {
          setFeedback([]);
        }
      } else {
        setFeedback([]);
        localStorage.setItem('campuseats_feedback', JSON.stringify([]));
      }
    }

    loadData();
  }, []);

  // Onboard / Add a direct new Vendor
  const handleSaveVendor = async (newVendor: Vendor) => {
    const updated = [newVendor, ...vendors];
    setVendors(updated);
    localStorage.setItem('campuseats_vendors', JSON.stringify(updated));

    if (isFirebaseConfigured && db) {
      try {
        console.log('[Firestore] Accessing database to onboard vendor:', newVendor.name);
        await setDoc(doc(db, 'vendors', newVendor.id), newVendor);
        console.log('[Firestore] Vendor onboarded successfully.');
      } catch (error) {
        console.error('[Firestore] Error onboarding vendor to Firestore:', error);
        alert('Local onboard saved. Server database write timed out / blocked by rules.');
      }
    }
  };

  // Delete an existing vendor
  const handleDeleteVendor = async (vendorId: string) => {
    const updated = vendors.filter((v) => v.id !== vendorId);
    setVendors(updated);
    localStorage.setItem('campuseats_vendors', JSON.stringify(updated));

    if (isFirebaseConfigured && db) {
      try {
        console.log('[Firestore] Deleting vendor from database:', vendorId);
        await deleteDoc(doc(db, 'vendors', vendorId));
        console.log('[Firestore] Vendor collection record removed.');
      } catch (error) {
        console.error('[Firestore] Error deleting vendor from Firestore:', error);
      }
    }
  };

  // Toggles the vendor status (Open / Closed / Deactivated) inside vendors state & database
  const handleToggleVendorStatus = async (vendorId: string, nextStatus: VendorStatus) => {
    const updated = vendors.map(v => {
      if (v.id === vendorId) {
        return { ...v, status: nextStatus };
      }
      return v;
    });
    setVendors(updated);
    localStorage.setItem('campuseats_vendors', JSON.stringify(updated));

    if (isFirebaseConfigured && db) {
      try {
        console.log('[Firestore] Updating status on doc:', vendorId, 'to:', nextStatus);
        await updateDoc(doc(db, 'vendors', vendorId), { status: nextStatus });
        console.log('[Firestore] Status synched successfully on server.');
      } catch (error) {
        console.error('[Firestore] Error toggling status on Firestore:', error);
      }
    }
  };

  // Mark Feedback as Resolved
  const handleResolveFeedback = async (id: string) => {
    const updated = feedback.map((f) => {
      if (f.id === id) {
        return { ...f, status: FeedbackStatus.RESOLVED };
      }
      return f;
    });
    setFeedback(updated);
    localStorage.setItem('campuseats_feedback', JSON.stringify(updated));

    if (isFirebaseConfigured && db) {
      try {
        console.log('[Firestore] Resolving ticket on database:', id);
        await updateDoc(doc(db, 'feedback', id), { status: FeedbackStatus.RESOLVED });
        console.log('[Firestore] Ticket flagged as resolved on server.');
      } catch (error) {
        console.error('[Firestore] Error resolving ticket on Firestore:', error);
      }
    }
  };

  const handleContactCustomer = (customerId: string, text: string) => {
    console.log(`Contacting student customer ${customerId}: ${text}`);
  };

  // Dynamic values for sidebar badges
  const vendorCount = vendors.length;
  const pendingCount = feedback.filter(f => f.status === FeedbackStatus.PENDING || f.status === FeedbackStatus.URGENT).length;

  // Render Subpanels based on active tab state
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case TabType.OVERVIEW:
        return (
          <DashboardOverview 
            vendors={vendors} 
            feedback={feedback} 
            onNavigateToTab={(tab) => setActiveTab(tab)} 
          />
        );
      case TabType.VENDORS:
        return (
          <VendorDirectory 
            vendors={vendors} 
            setVendors={(update) => {
              if (typeof update === 'function') {
                setVendors((prev) => {
                  const res = update(prev);
                  localStorage.setItem('campuseats_vendors', JSON.stringify(res));
                  return res;
                });
              } else {
                setVendors(update);
                localStorage.setItem('campuseats_vendors', JSON.stringify(update));
              }
            }}
            onSaveVendor={handleSaveVendor}
            onDeleteVendor={handleDeleteVendor}
            onToggleStatus={handleToggleVendorStatus}
          />
        );
      case TabType.FEEDBACK:
        return (
          <FeedbackCenter 
            feedback={feedback} 
            setFeedback={(update) => {
              if (typeof update === 'function') {
                setFeedback((prev) => {
                  const res = update(prev);
                  localStorage.setItem('campuseats_feedback', JSON.stringify(res));
                  return res;
                });
              } else {
                setFeedback(update);
                localStorage.setItem('campuseats_feedback', JSON.stringify(update));
              }
            }}
            onResolveFeedback={handleResolveFeedback}
            onContactCustomer={handleContactCustomer}
          />
        );
      case TabType.SETTINGS:
        return <SettingsPanel />;
      default:
        return <DashboardOverview vendors={vendors} feedback={feedback} onNavigateToTab={setActiveTab} />;
    }
  };

  // Convert Tab id to Human Title
  const getTabHeaderTitle = () => {
    switch (activeTab) {
      case TabType.OVERVIEW: return 'Overview Feed';
      case TabType.VENDORS: return 'Vendor Directory';
      case TabType.FEEDBACK: return 'Feedback Analytics';
      case TabType.SETTINGS: return 'Platform Settings';
      default: return 'Campus Eats';
    }
  };

  return (
    <div className="bg-[#f8f9fb] font-sans text-slate-800 min-h-screen flex overflow-x-hidden antialiased">
      {/* Sidebar Core Component for Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        vendorCount={vendorCount}
        pendingCount={pendingCount}
      />

      {/* Main Fluid Canvas Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen pb-20 lg:pb-0">
        
        {/* Top App Bar Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex justify-between items-center shadow-[0px_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert("Shortcut Sidebar drawer is fully accessible on the left!")}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-150 transition-colors shrink-0 text-slate-600 cursor-pointer"
              title="Menu Drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-extrabold text-[#b02f00] tracking-tight">{getTabHeaderTitle()}</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Sync / Database Channel Status Indicator */}
            {isLoading ? (
              <div className="hidden sm:flex items-center bg-amber-50 text-amber-700 border border-amber-200/60 px-3 py-1.5 rounded-full text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-2" />
                <span>Syncing Database...</span>
              </div>
            ) : isFirebaseConfigured ? (
              <div className="hidden sm:flex items-center bg-teal-50 text-teal-800 border border-teal-200/60 px-3 py-1.5 rounded-full text-xs font-semibold">
                <Database className="w-3.5 h-3.5 text-teal-600 mr-1.5 animate-pulse" />
                <span>Live Firestore Online</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-medium">
                <CloudLightning className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <span>Local Storage Mode</span>
              </div>
            )}

            {/* Notification alert bells */}
            <button 
              onClick={() => {
                setUnreadNotifications(0);
                alert("All notification channels acknowledged.");
              }}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white font-black text-[9px] rounded-full flex items-center justify-center border border-white">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Super Admin profile avatar display */}
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 select-none shadow-sm shrink-0">
              <img 
                alt="Headshot of representative admin" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80"
              />
            </div>
          </div>
        </header>

        {/* Warning Bar if Syncing with Firestore failed */}
        {syncError && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 flex items-center gap-2 text-xs font-semibold text-rose-800 select-none">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{syncError}</span>
          </div>
        )}

        {/* Core Subpages Router Layout View */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto flex-1 pb-24 lg:pb-8">
          {renderActiveTabContent()}
        </main>
      </div>
    </div>
  );
}
