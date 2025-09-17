// src/hooks/useStripeConfirm.ts
"use client";

import { useState } from "react";
import type { AddressParam } from "@stripe/stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";

export function useStripeConfirm() {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm(opts: {
    email: string;
    shipping?: { name: string; address: AddressParam };
    returnUrl: string;
  }) {
    if (!stripe || !elements) return { ok: false, error: "Stripe not ready" };
    setSubmitting(true);
    setError(null);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: opts.returnUrl,
          receipt_email: opts.email,
          shipping: opts.shipping,
        },
      });
      if (error) {
        setError(error.message || "Payment failed");
        return { ok: false, error: error.message };
      }
      return { ok: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unexpected error";
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setSubmitting(false);
    }
  }

  return { confirm, submitting, error };
}
