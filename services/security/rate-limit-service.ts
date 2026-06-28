import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";
import { getAdminByUid } from "@/services/firestore/admin-service";
import { getUser } from "@/services/firestore/user-service";
import { getVendorByUid } from "@/services/firestore/vendor-service";

export type RateLimitAction = "createOrder" | "submitFeedback";

type RateLimitActionState = {
  count: number;
  windowStart: Timestamp | null;
};

type RateLimitDoc = {
  blockedUntil: Timestamp | null;
  actions: Record<RateLimitAction, RateLimitActionState>;
};

const ACTION_WINDOWS: Record<RateLimitAction, number> = {
  createOrder: 60_000,
  submitFeedback: 3_600_000,
};

const ACTION_LIMITS: Record<RateLimitAction, number> = {
  createOrder: 5,
  submitFeedback: 3,
};

const BLOCK_DURATION_MS = 10 * 60_000;

function toMillis(value: Timestamp | null | undefined): number | null {
  if (!value) {
    return null;
  }

  return value.toMillis();
}

async function getUserRole(userId: string): Promise<string | null> {
  const adminDoc = await getAdminByUid(userId);
  if (adminDoc) {
    return "admin";
  }

  const vendorDoc = await getVendorByUid(userId);
  if (vendorDoc) {
    return "vendor";
  }

  const studentDoc = await getUser(userId);
  if (studentDoc?.role === "student") {
    return "student";
  }

  return null;
}

export async function checkRateLimit(userId: string, action: RateLimitAction) {
  const role = await getUserRole(userId);
  if (role !== "student") {
    return;
  }

  const rateLimitRef = doc(db, "rateLimits", userId);
  const snapshot = await getDoc(rateLimitRef);

  if (!snapshot.exists()) {
    return;
  }

  const data = snapshot.data() as Partial<RateLimitDoc>;
  const blockedUntil = data.blockedUntil as Timestamp | null | undefined;
  const now = Date.now();

  if (blockedUntil && toMillis(blockedUntil) !== null && toMillis(blockedUntil)! > now) {
    throw new Error("Too many requests. Account temporarily blocked for 10 minutes.");
  }

  const actionState = data.actions?.[action] as RateLimitActionState | undefined;
  if (!actionState) {
    return;
  }

  const windowStart = actionState.windowStart;
  const windowMs = ACTION_WINDOWS[action];
  const windowStartMs = toMillis(windowStart);

  if (windowStartMs !== null && now - windowStartMs > windowMs) {
    return;
  }

  if (actionState.count >= ACTION_LIMITS[action]) {
    await updateDoc(rateLimitRef, {
      blockedUntil: Timestamp.fromDate(new Date(now + BLOCK_DURATION_MS)),
    });

    throw new Error("Too many requests. Account temporarily blocked for 10 minutes.");
  }
}

export async function recordRequest(userId: string, action: RateLimitAction) {
  const role = await getUserRole(userId);
  if (role !== "student") {
    return;
  }

  const rateLimitRef = doc(db, "rateLimits", userId);
  const snapshot = await getDoc(rateLimitRef);
  const now = Date.now();

  if (!snapshot.exists()) {
    await setDoc(rateLimitRef, {
      blockedUntil: null,
      actions: {
        createOrder: {
          count: 0,
          windowStart: serverTimestamp(),
        },
        submitFeedback: {
          count: 0,
          windowStart: serverTimestamp(),
        },
      },
    });
  }

  const data = (snapshot.exists() ? snapshot.data() : {}) as Partial<RateLimitDoc>;
  const actionState = data.actions?.[action] as RateLimitActionState | undefined;
  const windowMs = ACTION_WINDOWS[action];
  const windowStart = actionState?.windowStart;
  const windowStartMs = toMillis(windowStart as Timestamp | null | undefined);

  let nextCount = 1;
  let nextWindowStart = serverTimestamp();

  if (actionState && windowStartMs !== null && now - windowStartMs <= windowMs) {
    nextCount = actionState.count + 1;
  } else {
    nextCount = 1;
  }

  const updates: Record<string, unknown> = {
    [`actions.${action}.count`]: nextCount,
    [`actions.${action}.windowStart`]: nextWindowStart,
  };

  await updateDoc(rateLimitRef, updates);
}
