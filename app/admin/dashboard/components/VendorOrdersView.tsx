import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Order, OrderStatus, PaymentStatus, Vendor } from '../types';
import { listenToVendorOrders } from '@/services/firestore/order-service';

interface VendorOrdersViewProps {
  vendorId: string;
  vendorName: string;
  onBack: () => void;
}

export default function VendorOrdersView({ vendorId, vendorName, onBack }: VendorOrdersViewProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = listenToVendorOrders(vendorId, (vendorOrders) => {
      const formattedOrders: Order[] = vendorOrders.map((o) => ({
        id: o.id,
        vendorId: o.vendorId,
        customerName: `Student (${o.userId.substring(0, 4)})`, // Using ID snippet as name for now
        customerId: o.userId,
        items: o.items as any,
        totalAmount: o.total,
        status: o.status as OrderStatus,
        paymentStatus: (o.paymentStatus as PaymentStatus) || PaymentStatus.PENDING,
        createdAt: (o.createdAt as any)?.toDate?.()?.toISOString() || new Date().toISOString(),
      }));
      
      // Sort by newest first
      formattedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setOrders(formattedOrders);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [vendorId]);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <span className="px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">Pending</span>;
      case OrderStatus.PREPARING:
        return <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">Preparing</span>;
      case OrderStatus.READY:
        return <span className="px-2 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">Ready</span>;
      case OrderStatus.DELIVERED:
        return <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">Delivered</span>;
      case OrderStatus.CANCELLED:
        return <span className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">Cancelled</span>;
      default:
        return null;
    }
  };

  const renderPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold"><CheckCircle className="w-3.5 h-3.5" /> Paid</span>;
      case PaymentStatus.PENDING:
        return <span className="flex items-center gap-1 text-amber-400 text-xs font-bold"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      case PaymentStatus.FAILED:
        return <span className="flex items-center gap-1 text-rose-400 text-xs font-bold"><AlertCircle className="w-3.5 h-3.5" /> Failed</span>;
      case PaymentStatus.REFUNDED:
        return <span className="flex items-center gap-1 text-slate-400 text-xs font-bold"><RefreshCw className="w-3.5 h-3.5" /> Refunded</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-[#12151a] hover:bg-[#1a233a] border border-slate-800 rounded-xl text-slate-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{vendorName} Orders</h2>
          <p className="text-sm text-slate-400">View and manage all transactions for this vendor.</p>
        </div>
      </div>

      <div className="bg-[#12151a] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0b0d10] border border-slate-800 rounded-xl text-sm font-sans text-slate-200 focus:bg-[#1a233a] focus:outline-none focus:ring-2 focus:ring-[#f2a93b]/20 focus:border-[#f2a93b] transition-all"
          />
        </div>
        <div className="text-sm font-semibold text-slate-400">
          Total Orders: <span className="text-white">{orders.length}</span>
        </div>
      </div>

      <div className="bg-[#12151a] border border-slate-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b0d10] border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 pr-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 pl-6 font-mono text-sm text-slate-300">{order.id}</td>
                    <td className="p-4 text-sm font-medium text-white">{order.customerName}</td>
                    <td className="p-4 text-sm text-slate-400">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="p-4 text-sm font-bold text-slate-200">${order.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      {renderPaymentStatusBadge(order.paymentStatus)}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {renderStatusBadge(order.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <p>No orders found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
