import { NextResponse } from "next/server";

// Endpoint: POST /api/paypal/create-order
// Responsibility:
// 1. Validate amount & optional email from client.
// 2. Obtain server-side OAuth credentials (client id + secret) from environment.
// 3. Call PayPal Orders API (intent CAPTURE) to create a new order in AUD.
// 4. Return minimal payload (id + links) so the client can either proceed with JS Buttons
//    or fallback to an approval link if button rendering fails.
// Notes:
// - We use Basic auth inline instead of exchanging for an access token separately because
//   PayPal supports client credentials in the v2 Orders create call.
// - 'user_action: PAY_NOW' shortens the approval experience.
// - Email is optional; if provided it's included as payer.email_address (helps prefill PayPal account if matching).
// - Any non-2xx response from PayPal is mapped to a 400 (client recoverable) unless credentials missing (500).

const PAYPAL_API =
  process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

export async function POST(req: Request) {
  try {
    const { amount, email } = await req.json();

    // Basic validation of amount (expecting decimal number already computed client-side)
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const clientId =
      process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const secret =
      process.env.PAYPAL_SECRET || process.env.PAYPAL_CLIENT_SECRET;
    if (!clientId || !secret) {
      return NextResponse.json(
        { error: "PayPal credentials missing" },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

    const body = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "AUD",
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        user_action: "PAY_NOW",
        locale: "en-AU",
      },
      payer: email ? { email_address: email } : undefined,
    };

    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("PayPal create order API error", data);
      return NextResponse.json(
        { error: "PayPal create order failed" },
        { status: 400 }
      );
    }

    // Return id + links for client consumption (links includes the approval URL)
    return NextResponse.json({ id: data.id, links: data.links });
  } catch (err) {
    console.error("PayPal create order error:", err);
    return NextResponse.json(
      { error: "Failed to create PayPal order" },
      { status: 500 }
    );
  }
}
