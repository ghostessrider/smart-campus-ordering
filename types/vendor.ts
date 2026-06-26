// Matches the actual `vendors` collection schema (see Divyansh's schema notes).
// Do not rename these fields — they mirror Firestore documents directly.
export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: number;
  image: string;
  upiID: string;
  status: "open" | "closed";
  avgPrepTime: number;
  rating: number;
  queueNumber: number;
  totalOrders: number;
  monthlyRevenue: number;
}