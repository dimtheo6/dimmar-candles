// src/hooks/usePaymentIntent.ts
"use client";

import { useEffect, useMemo, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  quantity: number;
  price?: number;
  priceCents?: number;
};

export function usePaymentIntent(params: {
  totalAud: number;
  email?: string;
  items?: CartItem[];
  currency?: string;
}) {
  const { totalAud, email, items, currency = "aud" } = params;
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsKey = useMemo(() => JSON.stringify(items || []), [items]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!totalAud || totalAud <= 0) {
        setClientSecret("");
        setPaymentIntentId("");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const payload = {
          amount: Math.round(totalAud * 100),
          currency,
          email,
          items: (items || []).map((i) => ({
            productId: i.id,
            name: i.name,
            qty: i.quantity,
            unitAmount:
              typeof i.priceCents === "number"
                ? i.priceCents
                : Math.round((i.price || 0) * 100),
          })),
        };
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        const data = await res.json();
        if (!cancelled) {
          if (data.error) throw new Error(data.error);
          setClientSecret(data.clientSecret || "");
          setPaymentIntentId(data.paymentIntentId || "");
        }
      } catch (e: unknown) {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : "Failed to create payment intent"
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
    // re-run on total/email/items changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalAud, email, itemsKey, currency]);

  return { clientSecret, paymentIntentId, loading, error };
}
