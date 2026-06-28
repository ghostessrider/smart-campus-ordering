import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";
import { Vendor } from "@/types/vendor";



// STUDENT: get vendors, optionally filtering to only open entries.
export async function getVendors(openOnly = true) {
  const vendorCollection = collection(db, "vendors");
  const q = openOnly
    ? query(vendorCollection, where("status", "==", "open"))
    : query(vendorCollection);

  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (vendor) => ({
      id: vendor.id,
      ...vendor.data(),
    } as Vendor)
  );
}

// STUDENT: get all active vendors
export async function getActiveVendors() {
  return getVendors(true);
}


// Get a single vendor by id
export async function getVendorById(vendorId: string): Promise<Vendor | null> {
  const ref = doc(db, "vendors", vendorId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Vendor;
}



// AUTH / VENDOR: get vendor by uid
export async function getVendorByUid(uid: string): Promise<Vendor | null> {
  const q = query(collection(db, "vendors"), where("uid", "==", uid));

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  } as Vendor;
}

// AUTH / VENDOR: get vendor by email
export async function getVendorByEmail(
  email: string
): Promise<Vendor | null> {
  const q = query(
    collection(db, "vendors"),
    where("email", "==", email)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  } as Vendor;
}

// VENDOR: toggle own store open/closed.
// Writes to the existing `status` field on the vendor's own doc only —
// does not introduce a separate isOpen flag, to keep one source of truth.
export async function setVendorStoreStatus(
  vendorId: string,
  status: "open" | "closed"
) {
  const ref = doc(db, "vendors", vendorId);
  await updateDoc(ref, { status });
}

export async function updateVendorProfile(
  vendorId: string,
  updates: {
    description?: string;
    phone?: number;
    upiID?: string;
    image?: string;
    photoURL?: string;
  }
) {
  const ref = doc(db, "vendors", vendorId);
  await updateDoc(ref, updates);
}
