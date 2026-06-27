import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";

type FeedbackPayload = {
  orderId: string;
  userId: string; // student uid
  vendorId: string;
  rating: number; // 1-5
  comment: string;
};

export async function getFeedbackByOrderId(orderId: string) {
  const q = query(collection(db, "feedbacks"), where("orderId", "==", orderId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export async function createFeedback(payload: FeedbackPayload) {
  // simple existence check to avoid duplicate reviews for same order
  const existing = await getFeedbackByOrderId(payload.orderId);
  if (existing) {
    throw new Error("Feedback for this order already exists.");
  }

  const ref = await addDoc(collection(db, "feedbacks"), {
    orderId: payload.orderId,
    userId: payload.userId,
    vendorId: payload.vendorId,
    rating: payload.rating,
    comment: payload.comment,
    createdAt: serverTimestamp(),
  });

  return ref.id;
}
