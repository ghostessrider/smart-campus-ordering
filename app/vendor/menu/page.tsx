"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  Plus,
  Pencil,
  Loader2,
  IndianRupee,
  ImageOff,
  Tag,
  X,
} from "lucide-react";

import {
  getVendorMenuItems,
  createMenuItem,
  updateMenuItem,
  setMenuItemAvailability,
  getVendorCategories,
} from "@/services/firestore/menu-service";
import { getVendorByEmail } from "@/services/firestore/vendor-service";
import { auth } from "@/lib/firebase/auth";
import { Vendor } from "@/types/vendor";
import { MenuItem } from "@/types/menu-item";

const UNCATEGORIZED = "Uncategorized";

export default function VendorMenuPage() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([UNCATEGORIZED]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | "new" | null>(null);

  async function loadMenu(vendorId: string) {
    const [menuItems, vendorCategories] = await Promise.all([
      getVendorMenuItems(vendorId),
      getVendorCategories(vendorId),
    ]);
    setItems(menuItems);
    setCategories(vendorCategories);
  }

  useEffect(() => {
    async function init() {
      const email = auth.currentUser?.email;
      if (!email) {
        setLoading(false);
        return;
      }

      const vendorDoc = await getVendorByEmail(email);
      if (!vendorDoc) {
        setLoading(false);
        return;
      }

      setVendor(vendorDoc);
      await loadMenu(vendorDoc.id);
      setLoading(false);
    }

    void init();
  }, []);

  const groupedByCategory = useMemo(() => {
    const groups = new Map<string, MenuItem[]>();
    for (const category of categories) {
      groups.set(category, []);
    }
    for (const item of items) {
      const key = item.category || UNCATEGORIZED;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(item);
    }
    return groups;
  }, [items, categories]);

  async function handleToggleAvailability(item: MenuItem) {
    await setMenuItemAvailability(item.id, !item.available);
    if (vendor) await loadMenu(vendor.id);
  }

  async function handleSave(values: {
    name: string;
    description: string;
    category: string;
    price: number;
  }) {
    if (!vendor) return;

    if (editingItem === "new") {
      await createMenuItem({ vendorId: vendor.id, ...values });
    } else if (editingItem) {
      await updateMenuItem(editingItem.id, values);
    }

    setEditingItem(null);
    await loadMenu(vendor.id);
  }

  if (loading) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#9aa3ae]" />
      </main>
    );
  }

  if (!vendor) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center px-6">
        <p className="text-sm text-[#9aa3ae]">
          No vendor account found for this login.
        </p>
      </main>
    );
  }

  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">Menu</h1>
            <p className="mt-1 text-sm text-[#9aa3ae]">
              {items.length} item{items.length === 1 ? "" : "s"} across{" "}
              {categories.length} categor{categories.length === 1 ? "y" : "ies"}
            </p>
          </div>
          <button
            onClick={() => setEditingItem("new")}
            className="flex items-center gap-1.5 rounded-lg bg-[#f2a93b] px-4 py-2.5 text-sm font-semibold text-[#1a1304] transition-colors hover:bg-[#f5b85c]"
          >
            <Plus size={16} strokeWidth={2.25} />
            Add item
          </button>
        </div>

        <div className="mt-8 space-y-8">
          {Array.from(groupedByCategory.entries()).map(
            ([category, categoryItems]) => (
              <section key={category}>
                <div className="mb-3 flex items-center gap-2 text-[#9aa3ae]">
                  <Tag size={14} strokeWidth={1.75} />
                  <h2 className="text-sm font-semibold uppercase tracking-wide">
                    {category}
                  </h2>
                  <span className="text-xs">({categoryItems.length})</span>
                </div>

                {categoryItems.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-[#9aa3ae]/60">
                    No items here yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {categoryItems.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onToggleAvailability={() =>
                          handleToggleAvailability(item)
                        }
                        onEdit={() => setEditingItem(item)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )
          )}
        </div>
      </div>

      {editingItem && (
        <MenuItemEditor
          item={editingItem === "new" ? null : editingItem}
          categories={categories}
          onCancel={() => setEditingItem(null)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}

function MenuItemCard({
  item,
  onToggleAvailability,
  onEdit,
}: {
  item: MenuItem;
  onToggleAvailability: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-white/10 bg-[#12151a] p-3.5">
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageOff size={18} className="text-[#9aa3ae]/50" />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-white">{item.name}</p>
          <button
            onClick={onEdit}
            className="flex-shrink-0 rounded-md p-1 text-[#9aa3ae] transition-colors hover:bg-white/10 hover:text-white"
          >
            <Pencil size={13} strokeWidth={1.75} />
          </button>
        </div>

        {item.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-[#9aa3ae]">
            {item.description}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <span className="flex items-center gap-0.5 text-sm font-semibold text-white">
            <IndianRupee size={12} />
            {item.price}
          </span>

          <button
            onClick={onToggleAvailability}
            className={clsx(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
              item.available
                ? "bg-[#3ddc84]/15 text-[#3ddc84] hover:bg-[#3ddc84]/25"
                : "bg-white/10 text-[#9aa3ae] hover:bg-white/15"
            )}
          >
            {item.available ? "Available" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuItemEditor({
  item,
  categories,
  onCancel,
  onSave,
}: {
  item: MenuItem | null;
  categories: string[];
  onCancel: () => void;
  onSave: (values: {
    name: string;
    description: string;
    category: string;
    price: number;
  }) => Promise<void>;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [category, setCategory] = useState(item?.category ?? UNCATEGORIZED);
  const [customCategory, setCustomCategory] = useState("");
  const [price, setPrice] = useState(item ? String(item.price) : "");
  const [submitting, setSubmitting] = useState(false);

  const isNewCategory = category === "__new__";

  async function handleSubmit() {
    const finalCategory = isNewCategory ? customCategory : category;
    const parsedPrice = Number(price);

    if (!name.trim() || !finalCategory.trim() || !parsedPrice || parsedPrice <= 0) {
      return;
    }

    setSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        category: finalCategory.trim(),
        price: parsedPrice,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#12151a] p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">
            {item ? "Edit item" : "Add menu item"}
          </h3>
          <button
            onClick={onCancel}
            className="rounded-md p-1 text-[#9aa3ae] hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-3.5">
          <Field label="Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Veg Burger"
              autoFocus
              className="w-full rounded-lg border border-white/10 bg-[#0b0d10] px-3.5 py-2.5 text-sm text-white placeholder:text-[#9aa3ae]/50 focus:border-[#f2a93b]/50 focus:outline-none"
            />
          </Field>

          <Field label="Description">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-lg border border-white/10 bg-[#0b0d10] px-3.5 py-2.5 text-sm text-white placeholder:text-[#9aa3ae]/50 focus:border-[#f2a93b]/50 focus:outline-none"
            />
          </Field>

          <Field label="Price (₹)">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="50"
              min={1}
              className="w-full rounded-lg border border-white/10 bg-[#0b0d10] px-3.5 py-2.5 text-sm text-white placeholder:text-[#9aa3ae]/50 focus:border-[#f2a93b]/50 focus:outline-none"
            />
          </Field>

          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0b0d10] px-3.5 py-2.5 text-sm text-white focus:border-[#f2a93b]/50 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__new__">+ New category</option>
            </select>
          </Field>

          {isNewCategory && (
            <Field label="New category name">
              <input
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. Beverages"
                className="w-full rounded-lg border border-white/10 bg-[#0b0d10] px-3.5 py-2.5 text-sm text-white placeholder:text-[#9aa3ae]/50 focus:border-[#f2a93b]/50 focus:outline-none"
              />
            </Field>
          )}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-semibold text-[#9aa3ae] transition-colors hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#f2a93b] py-2.5 text-sm font-semibold text-[#1a1304] transition-colors hover:bg-[#f5b85c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <Loader2 size={15} className="animate-spin" />}
            {item ? "Save changes" : "Add item"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[#9aa3ae]">
        {label}
      </span>
      {children}
    </label>
  );
}