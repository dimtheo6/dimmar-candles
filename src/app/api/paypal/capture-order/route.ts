import { NextResponse } from "next/server";
import { saveOrUpdateOrder } from "@/lib/orders";

// Endpoint: POST /api/paypal/capture-order
// Responsibility:
// 1. Receive a PayPal orderId (already created + approved by the buyer).
// 2. Perform the capture against PayPal's Orders API using server credentials.
// 3. Return a minimal success payload (id + status) so the client can finalize local UI/state.
// Notes:
// - We again use Basic auth with client credentials (PayPal supports it for capture).
// - Any non-OK response from PayPal is surfaced as 400 so the client can decide to retry / show message.
// - Credentials missing is treated as 500 (server misconfiguration).
// - Additional enrichment (e.g., saving transaction details) can be added here later.

const PAYPAL_API =
  process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
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

    const res = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.error("PayPal capture API error", data);
      return NextResponse.json(
        { error: "PayPal capture failed" },
        { status: 400 }
      );
    }

    // Fetch full order details (optional but useful for items & payer email)
    let orderDetails: unknown = data; // capture response often includes purchase_units; if not, fetch order
    try {
      if (!data?.purchase_units) {
        const orderRes = await fetch(
          `${PAYPAL_API}/v2/checkout/orders/${orderId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${auth}`,
            },
          }
        );
        if (orderRes.ok) orderDetails = await orderRes.json();
      }
    } catch {
      // non-fatal
    }

    interface PurchaseUnitItem {
      name?: string;
      quantity?: string | number;
      unit_amount?: { value?: string };
    }
    interface PurchaseUnit {
      amount?: { value?: string; currency_code?: string };
      items?: PurchaseUnitItem[];
    }
    interface OrderDetailsShape {
      payer?: { email_address?: string };
      purchase_units?: PurchaseUnit[];
    }
    const od = orderDetails as OrderDetailsShape | undefined;
    const email = od?.payer?.email_address || "unknown@example.com";
    const amountValue = od?.purchase_units?.[0]?.amount?.value;
    const currencyCode =
      od?.purchase_units?.[0]?.amount?.currency_code || "AUD";
    const amountTotal = amountValue ? Math.round(Number(amountValue) * 100) : 0;
    const items = Array.isArray(od?.purchase_units?.[0]?.items)
      ? od!.purchase_units![0].items!.map((it: PurchaseUnitItem) => ({
          name: String(it.name || ""),
          qty: Number(it.quantity || 1),
          unitAmount: it.unit_amount?.value
            ? Math.round(Number(it.unit_amount.value) * 100)
            : 0,
        }))
      : [];

    await saveOrUpdateOrder({
      provider: "paypal",
      providerOrderId: orderId,
      amountTotal,
      currency: currencyCode.toLowerCase(),
      status: data.status === "COMPLETED" ? "paid" : "pending",
      customer: { email },
      items,
      raw: data,
    });

    return NextResponse.json({ id: data.id, status: data.status });
  } catch (err) {
    console.error("PayPal capture error:", err);
    return NextResponse.json(
      { error: "Failed to capture PayPal order" },
      { status: 500 }
    );
  }
}
