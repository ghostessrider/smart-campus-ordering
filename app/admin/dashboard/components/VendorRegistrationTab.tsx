import React, { useState } from 'react';
import { Store, AlertTriangle, Loader2, UploadCloud, Clock, Tag } from 'lucide-react';
import { Vendor, VendorStatus } from '../types';

interface VendorRegistrationTabProps {
  onSaveVendor: (vendor: Vendor) => void;
  onCancel?: () => void;
}

export default function VendorRegistrationTab({ onSaveVendor, onCancel }: VendorRegistrationTabProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    icon: 'store',
    image: '',
    avgPrepTime: '15'
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

    if (!formData.name || !formData.email || !formData.category) {
      setError('Please fill in all required fields (Name, Email, Category).');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for creation (you would replace this with actual logic)
      // Since it's currently a client-side prototype, we'll just trigger the save prop
      const newVendor: Vendor = {
        id: `vendor-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        status: VendorStatus.OPEN,
        image: formData.image,
        icon: formData.icon,
        rating: 0,
        totalOrders: 0,
        avgPrepTime: parseInt(formData.avgPrepTime) || 15,
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
        email: '',
        category: '',
        icon: 'store',
        image: '',
        avgPrepTime: '15'
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

      <div className="bg-[#12151a] border border-slate-800 p-8 rounded-2xl shadow-xl shadow-black/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <Store className="w-4 h-4 text-[#f2a93b]" /> Basic Information
              </h3>
              
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Shop Name *</span>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Campus Cafe"
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-[#0b0d10] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-[#f2a93b] focus:ring-1 focus:ring-[#f2a93b]"
                  required
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Contact Email *</span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="vendor@example.com"
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-[#0b0d10] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-[#f2a93b] focus:ring-1 focus:ring-[#f2a93b]"
                  required
                />
              </label>
            </div>

            {/* Classification */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#f2a93b]" /> Classification
              </h3>
              
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Category *</span>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Beverages, Fast Food, Healthy"
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-[#0b0d10] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-[#f2a93b] focus:ring-1 focus:ring-[#f2a93b]"
                  required
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">UI Icon</span>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-[#0b0d10] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-[#f2a93b] focus:ring-1 focus:ring-[#f2a93b] cursor-pointer"
                >
                  <option value="store">Default Store</option>
                  <option value="coffee">Coffee / Beverages</option>
                  <option value="pizza">Pizza</option>
                  <option value="burger">Burgers / Fast Food</option>
                  <option value="ramen">Asian / Noodles</option>
                </select>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Media & Operations */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-[#f2a93b]" /> Media
              </h3>
              
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Cover Image URL</span>
                <input
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-[#0b0d10] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-[#f2a93b] focus:ring-1 focus:ring-[#f2a93b]"
                />
              </label>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#f2a93b]" /> Operations
              </h3>
              
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Avg Prep Time (mins)</span>
                <input
                  name="avgPrepTime"
                  type="number"
                  min="1"
                  value={formData.avgPrepTime}
                  onChange={handleChange}
                  placeholder="15"
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-[#0b0d10] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-[#f2a93b] focus:ring-1 focus:ring-[#f2a93b]"
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
