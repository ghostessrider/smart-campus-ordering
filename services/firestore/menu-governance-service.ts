import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";
import { Vendor } from "@/types/vendor";
import { MenuChangeRequest } from "@/types/menu-change-request";

const SETUP_WINDOW_DAYS = 3;

// VENDOR: is this vendor still inside their 3-day unrestricted setup
// window? Vendors created before `createdAt` existed on this schema have
// no way to know when their window started, so they're treated as
// "window already closed" — safer default than accidentally granting
// unrestricted access forever to old accounts.
export function isWithinSetupWindow(vendor: Vendor): boolean {
  if (!vendor.createdAt) return false;

  const createdAtMs = vendor.createdAt.getTime();
  const windowEndMs = createdAtMs + SETUP_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  return Date.now() < windowEndMs;
}

// VENDOR: request a price change on an existing menu item, once outside
// the 3-day window. Does NOT touch the live menuItems price — the item
// keeps its current price until an admin approves this request.
export async function requestPriceChange(params: {
  vendorId: string;
  menuItemId: string;
  currentPrice: number;
  requestedPrice: number;
}) {
  const ref = await addDoc(collection(db, "menuChangeRequests"), {
    vendorId: params.vendorId,
    changeType: "PRICE_CHANGE",
    targetId: params.menuItemId,
    payload: {
      currentPrice: params.currentPrice,
      requestedPrice: params.requestedPrice,
    },
    status: "PENDING",
    createdAt: serverTimestamp(),
  });

  return ref.id;
}

// VENDOR: see own pending/reviewed price-change requests.
export async function getVendorMenuChangeRequests(
  vendorId: string
): Promise<MenuChangeRequest[]> {
  const q = query(
    collection(db, "menuChangeRequests"),
    where("vendorId", "==", vendorId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (item) =>
      ({
        id: item.id,
        ...item.data(),
      }) as MenuChangeRequest
  );
}

// ADMIN: see every pending request across all vendors.
export async function getPendingMenuChangeRequests(): Promise
  MenuChangeRequest[]
> {
  const q = query(
    collection(db, "menuChangeRequests"),
    where("status", "==", "PENDING")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (item) =>
      ({
        id: item.id,
        ...item.data(),
      }) as MenuChangeRequest
  );
}

// ADMIN: approve a price-change request — this is the ONLY place that
// actually writes the new price to the live menuItems document. A
// request approved with no corresponding write would silently do
// nothing, so the price update happens here, not in menu-service.
export async function approveMenuChangeRequest(
  requestId: string,
  reviewerUid: string
) {
  const requestRef = doc(db, "menuChangeRequests", requestId);
  const requestSnap = await getDoc(requestRef);

  if (!requestSnap.exists()) {
    throw new Error("Menu change request not found.");
  }

  const request = requestSnap.data() as MenuChangeRequest;

  if (request.changeType === "PRICE_CHANGE" && request.targetId) {
    const itemRef = doc(db, "menuItems", request.targetId);
    await updateDoc(itemRef, {
      price: request.payload.requestedPrice,
      updatedAt: serverTimestamp(),
    });
  }

  await updateDoc(requestRef, {
    status: "APPROVED",
    reviewedBy: reviewerUid,
    reviewedAt: serverTimestamp(),
  });
}

// ADMIN: reject a price-change request — live price is left untouched.
export async function rejectMenuChangeRequest(
  requestId: string,
  reviewerUid: string,
  comment?: string
) {
  const requestRef = doc(db, "menuChangeRequests", requestId);
  await updateDoc(requestRef, {
    status: "REJECTED",
    reviewedBy: reviewerUid,
    reviewComment: comment ?? "",
    reviewedAt: serverTimestamp(),
  });
}