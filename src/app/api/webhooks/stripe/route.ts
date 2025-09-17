// src/app/api/webhooks/stripe/route.ts
// Restored / enhanced Stripe webhook handler mirroring PayPal capture flow style.
// Responsibilities:
// 1. Verify signature.
// 2. On payment_intent.succeeded / payment_intent.payment_failed build order payload.
// 3. Extract items from metadata, customer email + name, total amount.
// 4. Persist via saveOrUpdateOrder (which will send email if status === paid).
// 5. Log defensively for easier debugging.

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { saveOrUpdateOrder, OrderItem, OrderRecord } from "@/lib/orders";

export const dynamic = "force-dynamic";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn(
    "[stripe-webhook] STRIPE_WEBHOOK_SECRET not set – events will be rejected"
  );
}

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
  let rawBody: string;
  try {
    rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (
      event.type === "payment_intent.succeeded" ||
      event.type === "payment_intent.payment_failed"
    ) {
      const pi = event.data.object as Stripe.PaymentIntent;
      const succeeded = event.type === "payment_intent.succeeded";
      const status: OrderRecord["status"] = succeeded ? "paid" : "failed";

      // Amount precedence: amount_received (if >0) else amount
      const amountTotal =
        typeof pi.amount_received === "number" && pi.amount_received > 0
          ? pi.amount_received
          : pi.amount || 0;

      const metadata = pi.metadata || {};
      const email = metadata.email || pi.receipt_email || "unknown@example.com";

      // Items from metadata.items (JSON string)
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
        } catch (e) {
          console.warn("[stripe-webhook] failed to parse items metadata", e);
        }
      }

      // Derive customer name: shipping.name -> latest_charge.billing_details.name -> metadata.name
      let customerName: string | undefined = pi.shipping?.name || undefined;
      if (!customerName && typeof pi.latest_charge === "string") {
        try {
          const charge = await stripe.charges.retrieve(pi.latest_charge);
          if (charge.billing_details?.name)
            customerName = String(charge.billing_details.name);
        } catch (e) {
          console.warn("[stripe-webhook] latest_charge retrieve failed", e);
        }
      }
      if (
        !customerName &&
        typeof metadata.name === "string" &&
        metadata.name.trim()
      ) {
        customerName = metadata.name.trim();
      }

      console.log("[stripe-webhook] processing", {
        pi: pi.id,
        status,
        amountTotal,
        email,
        itemCount: items.length,
        customerName,
      });

      await saveOrUpdateOrder({
        provider: "stripe",
        providerIntentId: pi.id,
        amountTotal,
        currency: (pi.currency || "aud").toLowerCase(),
        status,
        customer: { email, name: customerName },
        items,
        raw: pi,
      });
    } else {
      // Ignored event types for now
      console.log("[stripe-webhook] ignoring event", event.type);
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
