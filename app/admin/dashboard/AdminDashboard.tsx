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
  AlertCircle,
  User
} from 'lucide-react';
import { TabType, Vendor, FeedbackItem, FeedbackStatus, VendorStatus } from './types';
import Sidebar from './components/Sidebar';
import VendorDirectory from './components/VendorDirectory';
import FeedbackCenter from './components/FeedbackCenter';
import SettingsPanel from './components/SettingsPanel';
import VendorOrdersView from './components/VendorOrdersView';
import VendorRegistrationTab from './components/VendorRegistrationTab';
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
  const [activeTab, setActiveTab] = useState<TabType>(TabType.VENDORS);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab !== TabType.VENDORS) {
      setSelectedVendorId(null);
    }
  };

  // Initialize and Hydrate from standard Firestore database or fallback to localStorage
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setSyncError(null);

      if (isFirebaseConfigured && db) {
        try {
          console.log('[Firestore] Initiating live database fetch...');
          
          // 1. Load Vendors (stored in `vendors` collection)
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
  const handleSaveVendor = async (newVendor: Vendor & { uid?: string; email?: string }) => {
    const updated = [newVendor, ...vendors];
    setVendors(updated);
    localStorage.setItem('campuseats_vendors', JSON.stringify(updated));

    if (isFirebaseConfigured && db && !newVendor.uid) {
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

  // Delete an existing vendor and remove its auth account too
  const handleDeleteVendor = async (vendorId: string) => {
    const updated = vendors.filter((v) => v.id !== vendorId);
    setVendors(updated);
    localStorage.setItem('campuseats_vendors', JSON.stringify(updated));

    if (isFirebaseConfigured && db) {
      try {
        console.log('[Vendor Delete] Sending vendor delete request for:', vendorId);
        const response = await fetch('/api/admin/delete-vendor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ vendorId }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data?.message || 'Failed to delete vendor.');
        }

        console.log('[Vendor Delete] Vendor auth and Firestore profile removed.');
      } catch (error: any) {
        console.error('[Vendor Delete] Error deleting vendor:', error);
        alert(error.message || 'Unable to delete vendor account.');
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
      case TabType.VENDORS:
        if (selectedVendorId) {
          const vendor = vendors.find(v => v.id === selectedVendorId);
          return (
            <VendorOrdersView 
              vendorId={selectedVendorId} 
              vendorName={vendor?.name || 'Unknown Vendor'}
              onBack={() => setSelectedVendorId(null)}
            />
          );
        }
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
            onToggleStatus={handleToggleVendorStatus}
            onVendorClick={(id) => setSelectedVendorId(id)}
          />
        );
      case TabType.VENDOR_REGISTRATION:
        return (
          <VendorRegistrationTab 
            onSaveVendor={(newVendor) => {
              handleSaveVendor(newVendor);
              handleTabChange(TabType.VENDORS);
            }}
            onCancel={() => handleTabChange(TabType.VENDORS)}
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
        return null;
    }
  };

  // Convert Tab id to Human Title
  const getTabHeaderTitle = () => {
    switch (activeTab) {
      case TabType.VENDORS: return selectedVendorId ? 'Vendor Details' : 'Vendor Directory';
      case TabType.VENDOR_REGISTRATION: return 'Onboard Vendor';
      case TabType.FEEDBACK: return 'Feedback Analytics';
      case TabType.SETTINGS: return 'Platform Settings';
      default: return 'SMART COW';
    }
  };

  return (
    <div className="relative bg-[#0b0d10] font-sans text-slate-300 min-h-screen flex overflow-x-hidden antialiased">
      {/* ambient grid texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.05] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#9aa3ae 1px, transparent 1px), linear-gradient(90deg, #9aa3ae 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* warm glow behind */}
      <div className="pointer-events-none fixed left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f2a93b]/[0.07] blur-3xl z-0" />

      {/* Sidebar Core Component for Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        vendorCount={vendorCount}
        pendingCount={pendingCount}
      />

      {/* Main Fluid Canvas Container */}
      <div className="relative z-10 flex-1 lg:pl-64 flex flex-col min-h-screen pb-20 lg:pb-0">
        
        {/* Top App Bar Header */}
        <header className="sticky top-0 z-40 bg-[#12151a]/95 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert("Shortcut Sidebar drawer is fully accessible on the left!")}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-150 transition-colors shrink-0 text-slate-600 cursor-pointer"
              title="Menu Drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-extrabold text-[#f2a93b] tracking-tight">{getTabHeaderTitle()}</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Sync / Database Channel Status Indicator */}
            {isLoading ? (
              <div className="hidden sm:flex items-center bg-amber-900/30 text-amber-400 border border-amber-700/50 px-3 py-1.5 rounded-full text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-2" />
                <span>Syncing Database...</span>
              </div>
            ) : isFirebaseConfigured ? (
              <div className="hidden sm:flex items-center bg-teal-900/30 text-teal-400 border border-teal-700/50 px-3 py-1.5 rounded-full text-xs font-semibold">
                <Database className="w-3.5 h-3.5 text-teal-400 mr-1.5 animate-pulse" />
              </div>
            ) : (
              <div className="hidden sm:flex items-center bg-white/5 text-slate-400 border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium">
                <CloudLightning className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                <span>Local Storage Mode</span>
              </div>
            )}

            {/* Notification alert bells */}
            <button 
              onClick={() => {
                setUnreadNotifications(0);
                alert("All notification channels acknowledged.");
              }}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors relative cursor-pointer"
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
            <div className="w-9 h-9 rounded-full bg-[#f2a93b]/10 flex items-center justify-center border border-[#f2a93b]/20 select-none shadow-sm shrink-0">
              <User className="w-4 h-4 text-[#f2a93b]" />
            </div>
          </div>
        </header>

        {/* Warning Bar if Syncing with Firestore failed */}
        {syncError && (
          <div className="bg-rose-950/40 border-b border-rose-900/50 px-6 py-2.5 flex items-center gap-2 text-xs font-semibold text-rose-400 select-none">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
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
