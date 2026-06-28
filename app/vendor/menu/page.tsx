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
  Settings2,
  Trash2,
} from "lucide-react";

import {
  getVendorMenuItems,
  createMenuItemWithImage,
  updateMenuItem,
  uploadMenuItemImage,
  setMenuItemAvailability,
  getVendorCategories,
  renameVendorCategory,
  deleteVendorCategory,
} from "@/services/firestore/menu-service";
import { getVendorByEmail } from "@/services/firestore/vendor-service";
// GOVERNANCE FEATURE — disabled for now per Divyansh (27 June), admin side
// has no UI yet to review requests. Code kept for when it's re-enabled.
// import {
//   isWithinSetupWindow,
//   requestPriceChange,
// } from "@/services/firestore/menu-governance-service";
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
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  // GOVERNANCE FEATURE — disabled for now, see imports above.
  // const [pendingNotice, setPendingNotice] = useState<string | null>(null);

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

  async function handleSave(
    values: {
      name: string;
      description: string;
      category: string;
      price: number;
    },
    imageFile?: File | null
  ) {
    if (!vendor) return;

    if (editingItem === "new") {
      await createMenuItemWithImage(
        { vendorId: vendor.id, ...values },
        imageFile ?? undefined
      );
    } else if (editingItem) {
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadMenuItemImage(imageFile, vendor.id);
      }

      await updateMenuItem(
        editingItem.id,
        imageUrl ? { ...values, image: imageUrl } : values
      );
      // GOVERNANCE FEATURE — disabled for now (see import above). When
      // re-enabled, restore this branch instead of the plain
      // updateMenuItem call below.
      //
      // const priceChanged = values.price !== editingItem.price;
      // const withinWindow = isWithinSetupWindow(vendor);
      //
      // if (priceChanged && !withinWindow) {
      //   await requestPriceChange({
      //     vendorId: vendor.id,
      //     menuItemId: editingItem.id,
      //     currentPrice: editingItem.price,
      //     requestedPrice: values.price,
      //   });
      //   await updateMenuItem(editingItem.id, {
      //     name: values.name,
      //     description: values.description,
      //     category: values.category,
      //   });
      //   setPendingNotice(
      //     `Price change for "${values.name}" sent for admin approval. Other changes saved.`
      //   );
      // } else {
      //   await updateMenuItem(editingItem.id, values);
      // }

      await updateMenuItem(editingItem.id, values);
    }

    setEditingItem(null);
    await loadMenu(vendor.id);
  }

  async function handleRenameCategory(oldName: string, newName: string) {
    if (!vendor) return;
    await renameVendorCategory(vendor.id, oldName, newName);
    await loadMenu(vendor.id);
  }

  async function handleDeleteCategory(name: string) {
    if (!vendor) return;
    await deleteVendorCategory(vendor.id, name);
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
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowCategoryManager(true)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-[#9aa3ae] transition-colors hover:bg-white/5 hover:text-white"
            >
              <Settings2 size={16} strokeWidth={1.75} />
              Categories
            </button>
            <button
              onClick={() => setEditingItem("new")}
              className="flex items-center gap-1.5 rounded-lg bg-[#f2a93b] px-4 py-2.5 text-sm font-semibold text-[#1a1304] transition-colors hover:bg-[#f5b85c]"
            >
              <Plus size={16} strokeWidth={2.25} />
              Add item
            </button>
          </div>
        </div>

        {/* GOVERNANCE FEATURE — disabled for now, see imports above.
        {pendingNotice && (
          <div className="mt-4 flex items-start justify-between gap-3 rounded-lg border border-[#f2a93b]/25 bg-[#f2a93b]/10 px-4 py-3 text-sm text-[#f2a93b]">
            <span>{pendingNotice}</span>
            <button
              onClick={() => setPendingNotice(null)}
              className="text-[#f2a93b]/70 hover:text-[#f2a93b]"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {vendor && !isWithinSetupWindow(vendor) && (
          <p className="mt-4 text-xs text-[#9aa3ae]">
            Your 3-day setup window has ended — price changes on existing
            items now need admin approval before they go live.
          </p>
        )}
        */}

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

      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          itemCounts={Object.fromEntries(
            Array.from(groupedByCategory.entries()).map(([c, i]) => [
              c,
              i.length,
            ])
          )}
          onClose={() => setShowCategoryManager(false)}
          onRename={handleRenameCategory}
          onDelete={handleDeleteCategory}
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
        {item.imageURL || item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageURL || item.image}
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
  }, imageFile?: File | null) => Promise<void>;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [category, setCategory] = useState(item?.category ?? UNCATEGORIZED);
  const [customCategory, setCustomCategory] = useState("");
  const [price, setPrice] = useState(item ? String(item.price) : "");
  const [imageFile, setImageFile] = useState<File | null>(null);
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
      await onSave(
        {
          name: name.trim(),
          description: description.trim(),
          category: finalCategory.trim(),
          price: parsedPrice,
        },
        imageFile
      );
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

          <Field label="Photo (optional)">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-white/10 bg-[#0b0d10] px-3 py-2 text-sm text-[#9aa3ae]"
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

function CategoryManager({
  categories,
  itemCounts,
  onClose,
  onRename,
  onDelete,
}: {
  categories: string[];
  itemCounts: Record<string, number>;
  onClose: () => void;
  onRename: (oldName: string, newName: string) => Promise<void>;
  onDelete: (name: string) => Promise<void>;
}) {
  const [editingName, setEditingName] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [busyAction, setBusyAction] = useState<string | null>(null);

  async function handleRenameSubmit(oldName: string) {
    if (!draftName.trim() || draftName.trim() === oldName) {
      setEditingName(null);
      return;
    }
    setBusyAction(oldName);
    try {
      await onRename(oldName, draftName.trim());
    } finally {
      setBusyAction(null);
      setEditingName(null);
    }
  }

  async function handleDeleteClick(name: string) {
    setBusyAction(name);
    try {
      await onDelete(name);
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#12151a] p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">
            Manage categories
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[#9aa3ae] hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
        <p className="mt-1 text-sm text-[#9aa3ae]">
          Renaming moves every item to the new name. Deleting moves items
          back to Uncategorized — nothing is removed from the menu.
        </p>

        <div className="mt-4 max-h-[50vh] space-y-2 overflow-y-auto">
          {categories.map((category) => {
            const isUncategorized = category === "Uncategorized";
            const isEditing = editingName === category;
            const isBusy = busyAction === category;

            return (
              <div
                key={category}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0b0d10] px-3 py-2.5"
              >
                {isEditing ? (
                  <input
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameSubmit(category);
                      if (e.key === "Escape") setEditingName(null);
                    }}
                    autoFocus
                    className="flex-1 rounded-md border border-[#f2a93b]/50 bg-[#12151a] px-2 py-1 text-sm text-white focus:outline-none"
                  />
                ) : (
                  <span className="flex-1 text-sm text-white">
                    {category}{" "}
                    <span className="text-xs text-[#9aa3ae]">
                      ({itemCounts[category] ?? 0})
                    </span>
                  </span>
                )}

                {!isUncategorized && (
                  <div className="flex items-center gap-1">
                    {isEditing ? (
                      <button
                        onClick={() => handleRenameSubmit(category)}
                        disabled={isBusy}
                        className="rounded-md p-1.5 text-[#3ddc84] hover:bg-white/10 disabled:opacity-50"
                      >
                        {isBusy ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Tag size={14} />
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingName(category);
                          setDraftName(category);
                        }}
                        className="rounded-md p-1.5 text-[#9aa3ae] hover:bg-white/10 hover:text-white"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(category)}
                      disabled={isBusy}
                      className="rounded-md p-1.5 text-red-400/80 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      {isBusy && !isEditing ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg border border-white/10 py-2.5 text-sm font-semibold text-[#9aa3ae] transition-colors hover:bg-white/5"
        >
          Done
        </button>
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