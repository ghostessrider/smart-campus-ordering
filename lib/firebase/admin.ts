import { cert, getApps, getApp, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const hasServiceAccount =
  process.env.FIREBASE_ADMIN_PRIVATE_KEY &&
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
  process.env.FIREBASE_ADMIN_PROJECT_ID;

const adminApp = !getApps().length
  ? initializeApp(
      hasServiceAccount
        ? {
            credential: cert({
              projectId: process.env.FIREBASE_ADMIN_PROJECT_ID as string,
              clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL as string,
              privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY as string).replace(/\\n/g, "\n"),
            }),
          }
        : undefined
    )
  : getApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
