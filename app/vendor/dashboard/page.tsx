"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  Wallet,
  Store as StoreIcon,
  Loader2,
  Check,
  X,
  Clock,
  PackageCheck,
  Star,
  IndianRupee,
} from "lucide-react";

import {
  listenToVendorOrders,
  updateOrderStatus,
  rejectOrder,
} from "@/services/firestore/order-service";
import {
  getVendorByEmail,
  setVendorStoreStatus,
} from "@/services/firestore/vendor-service";
import { auth } from "@/lib/firebase/auth";
import { Vendor } from "@/types/vendor";
import { VendorOrder } from "@/types/order";

type Column = "incoming" | "preparing" | "ready";

const COLUMN_META: Record
  Column,
  { label: string; description: string; accent: string }
> = {
  incoming: {
    label: "Incoming",
    description: "New tokens waiting on you",
    accent: "#f2a93b",
  },
  preparing: {
    label: "Preparing",
    description: "Accepted, on the stove",
    accent: "#5b9dff",
  },
  ready: {
    label: "Ready for pickup",
    description: "Call the token number out",
    accent: "#3ddc84",
  },
};

export default function VendorDashboard() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loadingVendor, setLoadingVendor] = useState(true);
  const [togglingStore, setTogglingStore] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<VendorOrder | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function init() {
      const email = auth.currentUser?.email;
      if (!email) {
        setLoadingVendor(false);
        return;
      }

      const vendorDoc = await getVendorByEmail(email);
      if (!vendorDoc) {
        setLoadingVendor(false);
        return;
      }

      setVendor(vendorDoc);
      setLoadingVendor(false);

      unsubscribe = listenToVendorOrders(vendorDoc.id, setOrders);
    }

    void init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const incoming = orders.filter((o) => o.status === "pending");
  const preparing = orders.filter((o) => o.status === "accepted");
  const ready = orders.filter((o) => o.status === "completed");

  async function handleAccept(order: VendorOrder) {
    await updateOrderStatus(order.id, "accepted");
  }

  async function handleMarkReady(order: VendorOrder) {
    await updateOrderStatus(order.id, "completed");
  }

  async function handleMarkDelivered(order: VendorOrder) {
    await updateOrderStatus(order.id, "delivered");
  }

  async function handleConfirmReject(reason: string) {
    if (!rejectTarget) return;
    await rejectOrder(rejectTarget.id, reason);
    setRejectTarget(null);
  }

  async function handleToggleStore() {
    if (!vendor) return;
    const next = vendor.status === "open" ? "closed" : "open";
    setTogglingStore(true);
    try {
      await setVendorStoreStatus(vendor.id, next);
      setVendor({ ...vendor, status: next });
    } finally {
      setTogglingStore(false);
    }
  }

  if (loadingVendor) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0d10]">
        <Loader2 className="h-6 w-6 animate-spin text-[#9aa3ae]" />
      </main>
    );
  }

  if (!vendor) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0d10] px-6">
        <p className="text-sm text-[#9aa3ae]">
          No vendor account found for this login.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0d10] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <VendorHeader
          vendor={vendor}
          toggling={togglingStore}
          onToggleStore={handleToggleStore}
        />

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <OrderColumn
            column="incoming"
            orders={incoming}
            renderActions={(order) => (
              <div className="flex gap-2.5">
                <button
                  onClick={() => handleAccept(order)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#f2a93b] py-2.5 text-sm font-semibold text-[#1a1304] transition-colors hover:bg-[#f5b85c]"
                >
                  <Check size={15} strokeWidth={2.25} />
                  Accept
                </button>
                <button
                  onClick={() => setRejectTarget(order)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/20"
                >
                  <X size={15} strokeWidth={2.25} />
                </button>
              </div>
            )}
          />

          <OrderColumn
            column="preparing"
            orders={preparing}
            renderActions={(order) => (
              <button
                onClick={() => handleMarkReady(order)}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#5b9dff] py-2.5 text-sm font-semibold text-[#0c1a33] transition-colors hover:bg-[#7badff]"
              >
                <PackageCheck size={15} strokeWidth={2.25} />
                Ready for pickup
              </button>
            )}
          />

          <OrderColumn
            column="ready"
            orders={ready}
            renderActions={(order) => (
              <button
                onClick={() => handleMarkDelivered(order)}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#3ddc84] py-2.5 text-sm font-semibold text-[#06281a] transition-colors hover:bg-[#5ee69c]"
              >
                <Check size={15} strokeWidth={2.25} />
                Mark delivered
              </button>
            )}
          />
        </div>
      </div>

      {rejectTarget && (
        <RejectReasonModal
          order={rejectTarget}
          onCancel={() => setRejectTarget(null)}
          onConfirm={handleConfirmReject}
        />
      )}
    </main>
  );
}

function VendorHeader({
  vendor,
  toggling,
  onToggleStore,
}: {
  vendor: Vendor;
  toggling: boolean;
  onToggleStore: () => void;
}) {
  const isOpen = vendor.status === "open";

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-[#12151a] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
          <StoreIcon size={22} strokeWidth={1.75} className="text-[#9aa3ae]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">{vendor.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#9aa3ae]">
            <span className="flex items-center gap-1">
              <Star size={13} className="fill-[#f2a93b] text-[#f2a93b]" />
              {vendor.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              ~{vendor.avgPrepTime} min prep
            </span>
            {vendor.upiID ? (
              <span className="flex items-center gap-1 font-mono">
                <Wallet size={13} />
                {vendor.upiID}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400/80">
                <Wallet size={13} />
                UPI ID not set — payments will be hard to reconcile
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-[#9aa3ae]">This month</p>
          <p className="flex items-center justify-end gap-0.5 text-sm font-semibold text-white">
            <IndianRupee size={13} />
            {vendor.monthlyRevenue.toLocaleString("en-IN")}
          </p>
        </div>

        <button
          onClick={onToggleStore}
          disabled={toggling}
          className={clsx(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60",
            isOpen
              ? "bg-[#3ddc84]/15 text-[#3ddc84] hover:bg-[#3ddc84]/25"
              : "bg-white/10 text-[#9aa3ae] hover:bg-white/15"
          )}
        >
          <span
            className={clsx(
              "h-2 w-2 rounded-full",
              isOpen ? "bg-[#3ddc84]" : "bg-[#9aa3ae]"
            )}
          />
          {toggling ? "Updating…" : isOpen ? "Open" : "Closed"}
        </button>
      </div>
    </div>
  );
}

function OrderColumn({
  column,
  orders,
  renderActions,
}: {
  column: Column;
  orders: VendorOrder[];
  renderActions: (order: VendorOrder) => React.ReactNode;
}) {
  const meta = COLUMN_META[column];

  return (
    <section className="flex h-full min-h-[520px] flex-col rounded-2xl border border-white/10 bg-[#12151a]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-white">{meta.label}</h2>
          <p className="text-xs text-[#9aa3ae]">{meta.description}</p>
        </div>
        <span
          className="flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold"
          style={{
            backgroundColor: `${meta.accent}26`,
            color: meta.accent,
          }}
        >
          {orders.length}
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {orders.length === 0 ? (
          <p className="mt-10 text-center text-sm text-[#9aa3ae]/60">
            Nothing here right now.
          </p>
        ) : (
          orders.map((order) => (
            <OrderTicket key={order.id} order={order} accent={meta.accent}>
              {renderActions(order)}
            </OrderTicket>
          ))
        )}
      </div>
    </section>
  );
}

function OrderTicket({
  order,
  accent,
  children,
}: {
  order: VendorOrder;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#171b21] p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-lg font-semibold tabular-nums text-white">
          #{order.orderNumber ?? order.id.slice(-4)}
        </span>
        <PaymentBadge status={order.paymentStatus} />
      </div>

      <div className="mt-3 space-y-1">
        {order.items.map((item) => (
          <div
            key={item.itemId}
            className="flex justify-between text-sm text-[#9aa3ae]"
          >
            <span>
              <span className="mr-1.5 text-white">{item.quantity}×</span>
              {item.name}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-xs uppercase tracking-wide text-[#9aa3ae]/70">
          Total
        </span>
        <span className="flex items-center gap-0.5 text-sm font-semibold text-white">
          <IndianRupee size={12} />
          {order.total}
        </span>
      </div>

      <div className="mt-3" style={{ accentColor: accent }}>
        {children}
      </div>
    </div>
  );
}

function PaymentBadge({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    paid: "bg-[#3ddc84]/15 text-[#3ddc84]",
    claimed_paid: "bg-[#f2a93b]/15 text-[#f2a93b]",
    disputed: "bg-red-500/15 text-red-300",
    pending: "bg-white/10 text-[#9aa3ae]",
  };

  const labels: Record<string, string> = {
    paid: "Paid",
    claimed_paid: "Claims paid",
    disputed: "Disputed",
    pending: "Unpaid",
  };

  const key = status ?? "pending";

  return (
    <span
      className={clsx(
        "rounded-full px-2 py-0.5 text-[11px] font-semibold",
        styles[key] ?? styles.pending
      )}
    >
      {labels[key] ?? "Unpaid"}
    </span>
  );
}

function RejectReasonModal({
  order,
  onCancel,
  onConfirm,
}: {
  order: VendorOrder;
  onCancel: () => void;
  onConfirm: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      await onConfirm(reason);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#12151a] p-6">
        <h3 className="text-base font-semibold text-white">
          Reject token #{order.orderNumber ?? order.id.slice(-4)}
        </h3>
        <p className="mt-1 text-sm text-[#9aa3ae]">
          The student will see this reason. Be specific so they know what
          happened.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Out of stock for this item"
          rows={3}
          autoFocus
          className="mt-4 w-full resize-none rounded-lg border border-white/10 bg-[#0b0d10] px-3.5 py-2.5 text-sm text-white placeholder:text-[#9aa3ae]/50 focus:border-[#f2a93b]/50 focus:outline-none"
        />

        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-semibold text-[#9aa3ae] transition-colors hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim() || submitting}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-500/90 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <X size={15} strokeWidth={2.25} />
            )}
            Reject order
          </button>
        </div>
      </div>
    </div>
  );
}