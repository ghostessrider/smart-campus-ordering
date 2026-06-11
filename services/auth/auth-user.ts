import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";

export async function getUserRole(
  uid: string
) {
  const ref = doc(
    db,
    "users",
    uid
  );

  const snapshot =
    await getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
}
