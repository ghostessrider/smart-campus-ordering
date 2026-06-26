import {
  collection,
  getDocs,
  query,
  where,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";
import { MenuItem } from "@/types/menu-item";

const UNCATEGORIZED = "Uncategorized";

// STUDENT: get available menu items for a vendor

export async function getMenuItems(
  vendorId:string
){


  const q =
  query(

    collection(
      db,
      "menuItems"
    ),


    where(
      "vendorId",
      "==",
      vendorId
    ),


    where(
      "available",
      "==",
      true
    )

  );



  const snapshot =
  await getDocs(q);



  return snapshot.docs.map(
    (doc)=>({

      id:doc.id,

      ...doc.data()

    })
  );


}

// VENDOR: get ALL of own menu items (including unavailable ones) —
// the student-facing getMenuItems() above filters to available:true only,
// which is wrong for a vendor managing their own menu.
export async function getVendorMenuItems(
  vendorId: string
): Promise<MenuItem[]> {
  const q = query(
    collection(db, "menuItems"),
    where("vendorId", "==", vendorId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (item) =>
      ({
        id: item.id,
        ...item.data(),
      }) as MenuItem
  );
}

// VENDOR: create a new menu item.
// `category` is a plain string on the item itself — there is no separate
// categories collection (per schema rule: no new collections). Leaving
// category blank/omitted means it falls under "Uncategorized" on display.
export async function createMenuItem(item: {
  vendorId: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  image?: string;
}) {
  const ref = await addDoc(collection(db, "menuItems"), {
    vendorId: item.vendorId,
    name: item.name,
    description: item.description ?? "",
    category: item.category?.trim() || UNCATEGORIZED,
    price: item.price,
    image: item.image ?? "",
    available: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

// VENDOR: edit an existing menu item. Only pass the fields being changed.
export async function updateMenuItem(
  itemId: string,
  updates: Partial<{
    name: string;
    description: string;
    category: string;
    price: number;
    image: string;
  }>
) {
  const ref = doc(db, "menuItems", itemId);

  const payload: Record<string, unknown> = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  if (updates.category !== undefined) {
    payload.category = updates.category.trim() || UNCATEGORIZED;
  }

  await updateDoc(ref, payload);
}

// VENDOR: toggle whether an item shows up for students right now.
export async function setMenuItemAvailability(
  itemId: string,
  available: boolean
) {
  const ref = doc(db, "menuItems", itemId);
  await updateDoc(ref, {
    available,
    updatedAt: serverTimestamp(),
  });
}

// VENDOR: list distinct category names currently in use for this vendor,
// derived from the items themselves (no separate source of truth to drift
// out of sync). "Uncategorized" is always included even if no items use it
// yet, since it's the permanent fallback bucket.
export async function getVendorCategories(
  vendorId: string
): Promise<string[]> {
  const items = await getVendorMenuItems(vendorId);

  const seen = new Set<string>([UNCATEGORIZED]);
  for (const item of items) {
    seen.add(item.category?.trim() || UNCATEGORIZED);
  }

  return Array.from(seen).sort((a, b) =>
    a === UNCATEGORIZED ? -1 : b === UNCATEGORIZED ? 1 : a.localeCompare(b)
  );
}

// VENDOR: rename a category — bulk-updates every item currently tagged
// with the old name. There's no separate category document to rename,
// since categories aren't their own collection.
export async function renameVendorCategory(
  vendorId: string,
  oldName: string,
  newName: string
) {
  if (oldName === UNCATEGORIZED) {
    throw new Error("Uncategorized cannot be renamed.");
  }

  const trimmedNewName = newName.trim() || UNCATEGORIZED;

  const q = query(
    collection(db, "menuItems"),
    where("vendorId", "==", vendorId),
    where("category", "==", oldName)
  );

  const snapshot = await getDocs(q);
  const batch = writeBatch(db);

  snapshot.docs.forEach((itemDoc) => {
    batch.update(itemDoc.ref, {
      category: trimmedNewName,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}

// VENDOR: "delete" a category — since categories are just a string field,
// deleting one means moving every item that used it back to Uncategorized.
export async function deleteVendorCategory(vendorId: string, name: string) {
  if (name === UNCATEGORIZED) {
    throw new Error("Uncategorized cannot be deleted.");
  }

  await renameVendorCategory(vendorId, name, UNCATEGORIZED);
}