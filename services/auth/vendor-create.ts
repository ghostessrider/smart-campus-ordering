import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

export interface VendorAccountInput {
  name: string;
  email: string;
  password: string;
  shopName: string;
  phone?: string;
  status?: string;
  icon?: string;
  category?: string;
  image?: string;
  totalOrders?: number;
  avgPrepTime?: number;
  monthlyRevenue?: number;
  satisfaction?: number;
}

export async function createVendorAuthUser(email: string, password: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Firebase API key for vendor onboarding.");
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        password,
        returnSecureToken: true,
      }),
    }
  );

  const result = await response.json();
  if (!response.ok) {
    const message = result?.error?.message || "Unable to create vendor auth account.";
    if (message === "EMAIL_EXISTS") {
      throw new Error("A Firebase account already exists with that email.");
    }
    throw new Error(message);
  }

  return result.localId as string;
}

export async function createVendorProfile(vendor: VendorAccountInput & { uid: string }) {
  const existingQuery = query(
    collection(db, "vendors"),
    where("email", "==", vendor.email.toLowerCase())
  );
  const existingSnapshot = await getDocs(existingQuery);
  if (!existingSnapshot.empty) {
    throw new Error("A vendor profile already exists with this email.");
  }

  const vendorRef = doc(collection(db, "vendors"));
  const vendorDoc = {
    id: vendorRef.id,
    uid: vendor.uid,
    name: vendor.name,
    email: vendor.email.toLowerCase(),
    shopName: vendor.shopName,
    phone: vendor.phone || "",
    status: vendor.status || "open",
    icon: vendor.icon || "UtensilsCrossed",
    category: vendor.category || "Campus Dining",
    image: vendor.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    totalOrders: vendor.totalOrders ?? 0,
    avgPrepTime: vendor.avgPrepTime ?? 12,
    monthlyRevenue: vendor.monthlyRevenue ?? 0,
    satisfaction: vendor.satisfaction ?? 4.8,
    rating: 5,
    role: "vendor",
    createdAt: new Date(),
  } as const;

  await setDoc(vendorRef, vendorDoc);
  return vendorDoc;
}
