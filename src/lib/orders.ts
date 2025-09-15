// src/lib/orders.ts
// Utilities for persisting orders and sending confirmation emails

import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export interface OrderItem {
  productId?: string;
  name?: string;
  qty: number;
  unitAmount: number; // in cents
}

export interface OrderRecord {
  id: string;
  provider: "stripe" | "paypal";
  providerIntentId?: string;
  providerOrderId?: string;
  status: "pending" | "paid" | "failed" | "refunded";
  currency: string;
  amountTotal: number; // in cents
  customer: { email: string; name?: string };
  items: OrderItem[];
  shipping?: {
    name?: string;
    address1?: string;
    address2?: string;
    suburb?: string;
    state?: string;
    postcode?: string;
  };
  createdAt: number;
  updatedAt: number;
  raw?: unknown;
}

interface SaveParams extends Partial<OrderRecord> {
  provider: "stripe" | "paypal";
  amountTotal: number;
  currency: string;
  status: OrderRecord["status"];
  customer: { email: string; name?: string };
  items: OrderItem[];
}

// Deterministic key prevents duplicate entries on webhook retries
function resolveOrderKey(p: SaveParams) {
  if (p.provider === "stripe" && p.providerIntentId)
    return `stripe_${p.providerIntentId}`;
  if (p.provider === "paypal" && p.providerOrderId)
    return `paypal_${p.providerOrderId}`;
  // Fallback to random UUID for cases where we did not yet persist a provider id (should be rare)
  return (
    globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)
  );
}

export async function saveOrUpdateOrder(p: SaveParams): Promise<string> {
  const key = resolveOrderKey(p);
  const ref = doc(db, "orders", key);
  const existing = await getDoc(ref);
  const base: Partial<OrderRecord> = existing.exists() ? existing.data() : {};
  const now = Date.now();
  await setDoc(ref, {
    ...base,
    ...p,
    id: key,
    createdAt: base.createdAt || now,
    updatedAt: now,
  });
  return key;
}

// Simple email sender stub. Implement with real provider (Nodemailer / Resend / SendGrid)
export async function sendOrderConfirmationEmail(order: OrderRecord) {
  if (!process.env.ORDER_EMAIL_FROM) return;
  // Placeholder: integrate real mail transport later
  console.info(
    "[email] would send confirmation to",
    order.customer.email,
    "for",
    order.id
  );
}
