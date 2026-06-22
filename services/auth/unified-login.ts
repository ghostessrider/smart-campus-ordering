import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { auth, initAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";

const ADMIN_EMAILS: string[] = [
  "admin@example.com"
];

export async function signInUnified() {
  await initAuth();

  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);

  const user = result.user;

  const email = user.email?.toLowerCase();

  if (!email) {
    throw new Error("No email found");
  }

  // Admin
  if (ADMIN_EMAILS.includes(email)) {
    return {
      role: "admin",
      user,
    };
  }

  // Student
  if (email.endsWith("@iitbhilai.ac.in")) {
    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        role: "student",
        email: user.email,
        name: user.displayName,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return {
      role: "student",
      user,
    };
  }

  // Vendor
  const q = query(
    collection(db, "vendors"),
    where("email", "==", email)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Not an approved vendor");
  }

  const vendor = snapshot.docs[0].data();

  if (vendor.active !== true) {
    throw new Error("Vendor account disabled");
  }

  return {
    role: "vendor",
    user,
  };
}