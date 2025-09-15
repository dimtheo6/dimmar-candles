// src/app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing Stripe secret key");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "aud", email, items } = await req.json();

    // Validate amount
    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: "Amount must be at least $0.50 AUD" },
        { status: 400 }
      );
    }

    // Create payment intent with specific payment methods
    // Serialize items (keep small) for later reconstruction in webhook
    let itemsJson: string | undefined = undefined;
    if (Array.isArray(items)) {
      try {
        type InItem = {
          productId?: string;
          id?: string;
          name?: string;
          qty?: number;
          quantity?: number;
          unitAmount?: number;
          price?: number;
        };
        const compact = (items as InItem[]).map((it) => ({
          productId: String(it.productId || it.id || ""),
          name: String(it.name || ""),
          qty: Number(it.qty || it.quantity || 1),
          unitAmount: Number(it.unitAmount || it.price || 0),
        }));
        itemsJson = JSON.stringify(compact).slice(0, 4500); // stay under Stripe 5000 char metadata limit
      } catch {
        // ignore serialization failure
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: currency.toLowerCase(),
      payment_method_types: ["card", "afterpay_clearpay"], // Only allow cards and Afterpay
      metadata: {
        source: "dimmar-candles-checkout",
        email: email || "",
        items: itemsJson || "",
      },
      receipt_email: email || undefined,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);

    return NextResponse.json(
      {
        error: "Failed to create payment intent",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
