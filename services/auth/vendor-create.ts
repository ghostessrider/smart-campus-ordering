import { doc, setDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
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

export interface VendorRegistrationResponse {
  id: string;
  uid: string;
  description: string;
  email: string;
  image: string;
  name: string;
  phone: number;
  photoURL: string;
  queueNumber: number;
  status: string;
  totalOrders: number;
  upiID: string;
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
  const normalizedEmail = vendor.email.toLowerCase();

  const existingQuery = query(
    collection(db, "vendors"),
    where("email", "==", normalizedEmail)
  );
  const existingSnapshot = await getDocs(existingQuery);
  if (!existingSnapshot.empty) {
    throw new Error("A vendor profile already exists with this email.");
  }

  const userRef = doc(db, "users", vendor.uid);
  await setDoc(userRef, {
    uid: vendor.uid,
    name: vendor.name,
    email: normalizedEmail,
    role: "vendor",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const vendorRef = doc(db, "vendors", vendor.uid);
  const vendorDoc: VendorRegistrationResponse = {
    id: vendor.uid,
    uid: vendor.uid,
    description: "",
    email: normalizedEmail,
    image: "",
    name: vendor.name,
    phone: 0,
    photoURL: "",
    queueNumber: 0,
    status: vendor.status || "open",
    totalOrders: vendor.totalOrders ?? 0,
    upiID: "",
  };

  await setDoc(vendorRef, vendorDoc);

  return vendorDoc;
}

export async function registerVendorAccount(input: { name: string; email: string }) {
  const response = await fetch("/api/admin/create-vendor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shopName: input.name,
      email: input.email,
    }),
  });

  const data = (await response.json()) as { vendor?: VendorRegistrationResponse; message?: string };

  if (!response.ok) {
    throw new Error(data.message || "Unable to register vendor.");
  }

  if (!data.vendor) {
    throw new Error("Vendor registration did not return a profile.");
  }

  return data.vendor;
}
