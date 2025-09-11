// src/app/checkout/layout.tsx
"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("Missing Stripe publishable key");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}