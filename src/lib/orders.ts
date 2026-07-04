// src/lib/orders.ts
// Utilities for persisting orders and sending confirmation emails

import { getAdminDb } from "./firebaseAdmin";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/emailTemplate";

// Get all orders
export async function getOrders(): Promise<OrderRecord[]> {
  const db = getAdminDb();
  const snapshot = await db.collection("orders").get();
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as OrderRecord));
}

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
  status: "pending" | "paid" | "failed" | "refunded" | "processing" | "shipped";
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

export async function updateOrderStatus(
  id: string,
  status: OrderRecord["status"]
): Promise<void> {
  const db = getAdminDb();
  await db.collection("orders").doc(id).update({ status, updatedAt: Date.now() });
}

export async function saveOrUpdateOrder(p: SaveParams): Promise<string> {
  const db = getAdminDb();
  const key = resolveOrderKey(p);
  const ref = db.collection("orders").doc(key);
  const existing = await ref.get();
  const base = existing.exists ? (existing.data() as Partial<OrderRecord>) : {};
  const now = Date.now();

  // Omit raw — Stripe/PayPal objects may contain non-serializable values
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { raw: _raw, ...rest } = p;
  const order: OrderRecord = {
    ...base,
    ...rest,
    id: key,
    displayId: base.displayId || `DIM-${now.toString().slice(-8)}`,
    createdAt: base.createdAt || now,
    updatedAt: now,
  };
  console.log("[orders] upserting", { key, status: order.status });

  await ref.set(order);

  // Fire off confirmation email if order is "paid"
  if (order.status === "paid") {
    await sendOrderConfirmationEmail(order);
  }

  return key;
}

// Simple email sender with Resend
export async function sendOrderConfirmationEmail(order: OrderRecord) {
  if (!process.env.ORDER_EMAIL_FROM) return;

  const resend = new Resend(process.env.RESEND_API_KEY);

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
