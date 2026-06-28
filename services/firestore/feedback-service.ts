import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";
import { checkRateLimit, recordRequest } from "@/services/security/rate-limit-service";

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
  await checkRateLimit(payload.userId, "submitFeedback");

  const orderRef = doc(db, "orders", payload.orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) {
    throw new Error("Order not found.");
  }

  const status = orderSnap.get("status");
  if (status !== "completed" && status !== "delivered") {
    throw new Error("Only completed or delivered orders can be reviewed.");
  }

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

  await recordRequest(payload.userId, "submitFeedback");

  return ref.id;
}
