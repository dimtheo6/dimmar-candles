import { NextResponse } from "next/server";
import { saveOrUpdateOrder } from "@/lib/orders";
import type { OrderItem } from "@/lib/orders";

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
    interface CaptureAmount {
      value?: string;
      currency_code?: string;
    }
    interface Capture {
      amount?: CaptureAmount;
    }
    interface Payments {
      captures?: Capture[];
    }
    interface PurchaseUnit {
      amount?: { value?: string; currency_code?: string };
      items?: PurchaseUnitItem[];
      payments?: Payments;
    }
    interface OrderDetailsShape {
      payer?: { email_address?: string };
      purchase_units?: PurchaseUnit[];
    }
    const od = orderDetails as OrderDetailsShape | undefined;

    const email = od?.payer?.email_address || "unknown@example.com";

    // Extract customer name from PayPal response
    // Priority: shipping.name.full_name -> payer.name (given + surname) -> fallback
    interface PayPalCapturePayerName {
      given_name?: string;
      surname?: string;
    }
    interface PayPalCapturePayer {
      name?: PayPalCapturePayerName;
    }
    interface PayPalCaptureShippingName {
      full_name?: string;
    }
    interface PayPalCaptureShipping {
      name?: PayPalCaptureShippingName;
    }
    interface PayPalCapturePurchaseUnit {
      shipping?: PayPalCaptureShipping;
    }
    interface PayPalCaptureShape {
      payer?: PayPalCapturePayer;
      purchase_units?: PayPalCapturePurchaseUnit[];
    }
    const cap = data as PayPalCaptureShape;

    let customerName: string | undefined;
    const shippingName = cap.purchase_units?.[0]?.shipping?.name?.full_name;
    if (shippingName) customerName = shippingName.trim();

    if (!customerName) {
      const given = cap.payer?.name?.given_name;
      const surname = cap.payer?.name?.surname;
      const combo = [given, surname].filter(Boolean).join(" ").trim();
      if (combo) customerName = combo;
    }

    // Prefer captured amount from the capture payload
    const d = data as { purchase_units?: PurchaseUnit[]; status?: string };
    const capAmt = d.purchase_units?.[0]?.payments?.captures?.[0]?.amount;
    const capturedValue = capAmt?.value;
    const capturedCurrency = capAmt?.currency_code;

    // Fallback to order amount if capture amount missing
    const puAmountValue = od?.purchase_units?.[0]?.amount?.value;
    const puCurrency = od?.purchase_units?.[0]?.amount?.currency_code;

    let currencyCode = (capturedCurrency || puCurrency || "AUD").toUpperCase();
    let amountTotal = 0;
    const pickValue = capturedValue ?? puAmountValue;
    if (pickValue && !Number.isNaN(Number(pickValue))) {
      amountTotal = Math.round(Number(pickValue) * 100);
    }

    let items: OrderItem[] = Array.isArray(od?.purchase_units?.[0]?.items)
      ? od!.purchase_units![0].items!.map((it: PurchaseUnitItem) => ({
          name: String(it.name || ""),
          qty: Number(it.quantity || 1),
          unitAmount: it.unit_amount?.value
            ? Math.round(Number(it.unit_amount.value) * 100)
            : 0,
        }))
      : [];

    // If amount or items still missing, try to reuse the pending order saved at create time
    if (amountTotal <= 0 || items.length === 0) {
      try {
        const { db } = await import("@/lib/firebase");
        const { doc, getDoc } = await import("firebase/firestore");
        const ref = doc(db, "orders", `paypal_${orderId}`);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const existing = snap.data() as {
            amountTotal?: number;
            currency?: string;
            items?: OrderItem[];
          };
          if (
            amountTotal <= 0 &&
            typeof existing.amountTotal === "number" &&
            existing.amountTotal > 0
          ) {
            amountTotal = existing.amountTotal;
          }
          if (!currencyCode && typeof existing.currency === "string") {
            currencyCode = existing.currency.toUpperCase();
          }
          if (items.length === 0 && Array.isArray(existing.items)) {
            items = existing.items as OrderItem[];
          }
        }
      } catch (e) {
        console.warn("[paypal] fallback read of pending order failed", e);
      }
    }

    await saveOrUpdateOrder({
      provider: "paypal",
      providerOrderId: orderId,
      amountTotal,
      currency: currencyCode.toLowerCase(),
      status: data.status === "COMPLETED" ? "paid" : "pending",
      customer: { email, name: customerName },
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
