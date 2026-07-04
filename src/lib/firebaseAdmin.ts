// src/lib/firebaseAdmin.ts
// Firebase Admin SDK – used for server-side Firestore operations (API routes, webhooks).
// Admin bypasses Firestore security rules, so orders can always be written from the server.

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  // Support both FIREBASE_ADMIN_* and FIREBASE_* naming conventions
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const clientEmail =
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;

  // FIREBASE_ADMIN_PRIVATE_KEY may be incorrectly set; prefer FIREBASE_PRIVATE_KEY
  // which contains the proper PEM-formatted key.
  const rawKey =
    process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  const privateKey = rawKey?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Ensure FIREBASE_PROJECT_ID, " +
        "FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in your environment."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}
