// Matches the actual `vendors` collection schema (see Divyansh's schema notes).
// Do not rename these fields — they mirror Firestore documents directly.
//
// `createdAt` added for the 3-day unrestricted setup window (governance
// feature) — this field did not exist anywhere in the original schema
// dump, so it must be set when a vendor is created. Existing vendor docs
// without it will be treated as "window already expired" (see
// menu-governance-service.ts) until backfilled.
export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: number;
  image: string;
  photoURL?: string;
  description?: string;
  active?: boolean;
  upiID: string;
  status: "open" | "closed";
  avgPrepTime: number;
  rating: number;
  queueNumber: number;
  totalOrders: number;
  monthlyRevenue: number;
  createdAt?: Date;
}
