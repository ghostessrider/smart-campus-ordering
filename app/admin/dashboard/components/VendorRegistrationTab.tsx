import React, { useState } from 'react';
import { Store, AlertTriangle, Loader2 } from 'lucide-react';
import { Vendor, VendorStatus } from '../types';

interface VendorRegistrationTabProps {
  onSaveVendor: (vendor: Vendor) => void;
  onCancel?: () => void;
}

export default function VendorRegistrationTab({ onSaveVendor, onCancel }: VendorRegistrationTabProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields (Name, Email).');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for creation (you would replace this with actual logic)
      // Since it's currently a client-side prototype, we'll just trigger the save prop
      const newVendor: Vendor = {
        id: `vendor-${Date.now()}`,
        name: formData.name,
        category: 'Uncategorized',
        status: VendorStatus.OPEN,
        image: '',
        icon: 'store',
        rating: 0,
        totalOrders: 0,
        avgPrepTime: 15,
        monthlyRevenue: 0,
        satisfaction: 0
      };

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 800));

      onSaveVendor(newVendor);
      setSuccess(`${formData.name} has been successfully registered!`);
      
      // Reset form
      setFormData({
        name: '',
        email: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to register vendor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Vendor Registration</h2>
        <p className="text-sm text-slate-400">Onboard a new cafeteria station or private vendor to the Campus Eats platform.</p>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-[#12151a] p-8 shadow-[0_25px_60px_-25px_rgba(15,23,42,0.95)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#0b0d10]/70 p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Store className="h-4 w-4 text-[#f2a93b]" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Basic Information</h3>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Shop Name *</span>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Campus Cafe"
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-[#12151a] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-[#f2a93b] focus:ring-1 focus:ring-[#f2a93b]"
                  required
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Contact Email *</span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="vendor@example.com"
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-[#12151a] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-[#f2a93b] focus:ring-1 focus:ring-[#f2a93b]"
                  required
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-500/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-400 flex items-center gap-2 mt-6">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 flex items-center gap-2 mt-6">
              {success}
            </div>
          )}

          <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f2a93b] px-8 py-2.5 text-sm font-bold text-white transition hover:bg-[#f5b85c] disabled:cursor-not-allowed disabled:opacity-70 shadow-lg shadow-[#f2a93b]/20 cursor-pointer"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Complete Registration"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
