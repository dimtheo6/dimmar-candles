// src/lib/orders.ts
// Utilities for persisting orders and sending confirmation emails

import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/emailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface OrderItem {
  productId?: string;
  name?: string;
  qty: number;
  unitAmount: number; // in cents
}

export interface OrderRecord {
  id: string;
  displayId: string; // User-friendly order number like DIM-12345678
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

  const order: OrderRecord = {
    ...base,
    ...p,
    id: key,
    displayId: base.displayId || `DIM-${now.toString().slice(-8)}`,
    createdAt: base.createdAt || now,
    updatedAt: now,
  };
  console.log("[orders] upserting", order);

  await setDoc(ref, order);

  // Fire off confirmation email if order is "paid"
  if (order.status === "paid") {
    await sendOrderConfirmationEmail(order);
  }

  return key;
}

// Simple email sender with Resend
export async function sendOrderConfirmationEmail(order: OrderRecord) {
  if (!process.env.ORDER_EMAIL_FROM) return;

  try {
    // Send email
    const { data, error } = await resend.emails.send({
      from: process.env.ORDER_EMAIL_FROM, // e.g. "Store <orders@yourdomain.com>"
      to: [order.customer.email],
      subject: `Order Confirmation - ${order.displayId}`,
      react: EmailTemplate({
        firstName: order.customer.name || "Customer",
        order: order,
      }),
    });

    if (error) {
      console.error("Failed to send confirmation email:", error);
      return;
    }

    console.info("Confirmation email sent:", data);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}
