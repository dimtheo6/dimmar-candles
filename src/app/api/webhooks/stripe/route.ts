// src/app/api/webhooks/stripe/route.ts
// Handles incoming Stripe webhook events to persist order records and trigger confirmation emails.
// Required env:
//  - STRIPE_SECRET_KEY
//  - STRIPE_WEBHOOK_SECRET (the signing secret for this endpoint)
// The create-payment-intent route should include metadata: orderId (optional), items (JSON), email.
// We treat the Stripe PaymentIntent id as the canonical providerIntentId.

import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  saveOrUpdateOrder,
  sendOrderConfirmationEmail,
  OrderRecord,
  OrderItem,
} from "@/lib/orders";

export const dynamic = "force-dynamic";

// Read raw body for signature verification. Next.js App Router provides request.text().
// We'll parse JSON only after verifying the signature.

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn(
    "[stripe-webhook] STRIPE_WEBHOOK_SECRET not set – events will be rejected"
  );
}

// Use same Stripe API version as other server routes to keep consistent behavior
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil" as Stripe.LatestApiVersion,
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing signature or secret" },
      { status: 400 }
    );
  }
  let event: Stripe.Event;
  let body: string;
  try {
    body = await req.text();
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const status: OrderRecord["status"] =
          event.type === "payment_intent.succeeded" ? "paid" : "failed";
        const amountTotal =
          typeof pi.amount_received === "number" && pi.amount_received > 0
            ? pi.amount_received
            : pi.amount || 0;
        // Extract metadata
        const metadata = pi.metadata || {};
        const email =
          metadata.email || pi.receipt_email || "unknown@example.com";
        let items: OrderItem[] = [];
        if (metadata.items) {
          try {
            const parsed = JSON.parse(metadata.items);
            if (Array.isArray(parsed)) {
              items = parsed
                .filter((it) => it && typeof it === "object")
                .map((it) => ({
                  productId: String(it.productId || it.id || ""),
                  name: String(it.name || ""),
                  qty: Number(it.qty || it.quantity || 1),
                  unitAmount: Number(it.unitAmount || it.price || 0),
                }));
            }
          } catch {
            console.warn("[stripe-webhook] failed to parse items metadata");
          }
        }
        const orderIdMeta = metadata.orderId;
        await saveOrUpdateOrder({
          provider: "stripe",
          providerIntentId: pi.id,
          amountTotal,
          currency: (pi.currency || "aud").toLowerCase(),
          status,
          customer: { email },
          items,
          raw: pi,
          id: orderIdMeta, // optional, ignored in save when key derived from providerIntentId
        });
        if (status === "paid") {
          // Fire and forget email (non-blocking)
          try {
            await sendOrderConfirmationEmail({
              id: "", // not needed by stub; full record fetch could be added if necessary
              provider: "stripe",
              providerIntentId: pi.id,
              status: "paid",
              currency: (pi.currency || "aud").toLowerCase(),
              amountTotal,
              customer: { email },
              items,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            } as OrderRecord);
          } catch (e) {
            console.warn("[stripe-webhook] email send failed (non-fatal)", e);
          }
        }
        break;
      }
      default:
        // Ignore other events
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe-webhook] handler error", err);
    return NextResponse.json(
      { error: "Webhook handling failed" },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({ ok: true });
}
