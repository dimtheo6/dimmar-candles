// src/app/checkout/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalButtons } from "@/components/PayPalButtons"; // Lazy PayPal wallet (no cards) component

// Stripe instance (loaded once on the client) – shared by Elements provider
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

// Form value shape (renamed to avoid collision with component name)
interface CheckoutFormValues {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCartStore();
  const stripe = useStripe();
  const elements = useElements();
  // Local payment method toggle – drives conditional rendering of Stripe PaymentElement vs PayPal
  const [selectedPayment, setSelectedPayment] = useState<"card" | "paypal">(
    "card"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormValues>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Australia",
  });
  const [errors, setErrors] = useState<Partial<CheckoutFormValues>>({});
  // Derive pricing only after cart store populated.
  const subtotal = totalPrice;
  // Avoid charging shipping when cart is still empty/hydrating.
  const shipping = subtotal === 0 ? 0 : subtotal > 100 ? 0 : 9;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return <div className="text-center py-20">Cart empty</div>;
  }
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p: CheckoutFormValues) => ({ ...p, [name]: value }));
    if (errors[name as keyof CheckoutFormValues])
      setErrors((p: Partial<CheckoutFormValues>) => ({ ...p, [name]: "" }));
  };
  const validateForm = () => {
    const n: Partial<CheckoutFormValues> = {};
    if (!formData.email) n.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) n.email = "Invalid email";
    if (!formData.firstName) n.firstName = "First name is required";
    if (!formData.lastName) n.lastName = "Last name is required";
    if (!formData.address) n.address = "Address is required";
    if (!formData.city) n.city = "City is required";
    if (!formData.state) n.state = "State is required";
    if (!formData.zipCode) n.zipCode = "Postcode is required";
    setErrors(n);
    return Object.keys(n).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Only runs for Stripe path. When PayPal is used the Smart Buttons perform their own create + capture.
    if (!validateForm() || !stripe || !elements) return;
    setIsSubmitting(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Stripe will redirect back here (3DS etc.) after confirmation
          return_url: `${window.location.origin}/checkout/success`,
          receipt_email: formData.email,
          shipping: {
            name: `${formData.firstName} ${formData.lastName}`,
            address: {
              line1: formData.address,
              line2: formData.apartment || undefined,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zipCode,
              country: "AU",
            },
          },
        },
      });
      if (error) alert(error.message);
      else clearCart();
    } catch {
      alert("Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <h1 className="text-2xl font-light text-neutral-900 mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <h2 className="text-lg font-medium text-neutral-900 mb-4">
            Contact Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.email ? "border-red-300" : "border-neutral-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First Name *
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.firstName ? "border-red-300" : "border-neutral-300"
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Last Name *
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.lastName ? "border-red-300" : "border-neutral-300"
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg"
              />
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-medium text-neutral-900 mb-4">
            Shipping Address
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Address *
              </label>
              <input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.address ? "border-red-300" : "border-neutral-300"
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Apartment
              </label>
              <input
                name="apartment"
                value={formData.apartment}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.city ? "border-red-300" : "border-neutral-300"
                  }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.state ? "border-red-300" : "border-neutral-300"
                  }`}
                >
                  <option value="">Select State</option>
                  <option value="NSW">NSW</option>
                  <option value="VIC">VIC</option>
                  <option value="QLD">QLD</option>
                  <option value="WA">WA</option>
                  <option value="SA">SA</option>
                  <option value="TAS">TAS</option>
                  <option value="ACT">ACT</option>
                  <option value="NT">NT</option>
                </select>
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Postcode *
              </label>
              <input
                name="zipCode"
                value={formData.zipCode}
                maxLength={4}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.zipCode ? "border-red-300" : "border-neutral-300"
                }`}
              />
              {errors.zipCode && (
                <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
              )}
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-medium text-neutral-900 mb-4">
            Payment Information
          </h2>
          <div className="flex gap-2 mb-4" role="tablist">
            <button
              type="button"
              onClick={() => setSelectedPayment("card")}
              className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer ${
                selectedPayment === "card"
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 bg-white"
              }`}
            >
              Card / Afterpay
            </button>
            <button
              type="button"
              onClick={() => setSelectedPayment("paypal")}
              className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer ${
                selectedPayment === "paypal"
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 bg-white"
              }`}
            >
              PayPal
            </button>
          </div>
          {selectedPayment === "card" && (
            <div className="p-4 border rounded-lg border-neutral-200 bg-neutral-50">
              <PaymentElement
                options={{
                  layout: "tabs",
                  paymentMethodOrder: [
                    "card",
                    "apple_pay",
                    "google_pay",
                    "afterpay_clearpay",
                  ],
                }}
              />
              <p className="mt-3 text-xs text-neutral-500">
                Card, wallets & Afterpay handled securely by Stripe.
              </p>
            </div>
          )}
          {selectedPayment === "paypal" && (
            <div className="p-4 border rounded-lg border-neutral-200 bg-neutral-50">
              {/* PayPal component creates + captures orders itself; on success we clear the cart and redirect */}
              <PayPalButtons
                amount={total}
                email={formData.email}
                onSuccess={(orderId) => {
                  clearCart();
                  window.location.href = `/checkout/success?order=paypal-${orderId}`;
                }}
                onError={(m) => alert(m || "PayPal error")}
              />
              <p className="mt-3 text-xs text-neutral-500">
                You will finish securely on PayPal.
              </p>
            </div>
          )}
        </section>
        <button
          type="submit"
          disabled={isSubmitting || !stripe}
          className={`w-full py-4 px-6 rounded-lg font-medium text-white ${
            isSubmitting || !stripe
              ? "bg-neutral-400 cursor-not-allowed"
              : "bg-black hover:bg-neutral-800"
          }`}
        >
          {isSubmitting ? "Processing..." : `Pay A$${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
// ----------------------------
// Checkout Page (wrapper + summary)
// ----------------------------

export default function CheckoutPage() {
  const { items, totalPrice } = useCartStore();
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Calculate totals
  const subtotal = totalPrice;
  const shipping = subtotal > 100 ? 0 : 9;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  // Create payment intent when component mounts
  useEffect(() => {
    // Only attempt to create a PaymentIntent when subtotal fully known and > 0.
    if (subtotal <= 0) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(total * 100),
        currency: "aud",
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorData}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
        setError("Failed to initialize payment. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [subtotal, total]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-neutral-600">Initializing checkout...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-light text-neutral-900 mb-4">
            Checkout Error
          </h1>
          <p className="text-neutral-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-light text-neutral-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-neutral-600 mb-6">
            Add some items to your cart before checking out
          </p>
          <Link
            href="/"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Render checkout with Stripe Elements
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {clientSecret && (
            <Elements
              key={clientSecret} // force re-mount when total changes producing a new secret
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#000000",
                    colorBackground: "#fafafa",
                    colorText: "#262626",
                    colorDanger: "#df1b41",
                    fontFamily: "system-ui, sans-serif",
                    spacingUnit: "4px",
                    borderRadius: "8px",
                  },
                },
              }}
            >
              <CheckoutForm />
            </Elements>
          )}
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-sm h-fit">
            <h2 className="text-lg font-medium text-neutral-900 mb-6">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.imageUrl && item.imageUrl[0] ? (
                      <Image
                        src={item.imageUrl[0]}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-neutral-900">
                      {item.name}
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-neutral-900">
                    A${((item.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal:</span>
                <span className="font-medium">A${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Shipping:</span>
                <span className="font-medium">
                  {shipping === 0 ? "Free" : `A$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">GST:</span>
                <span className="font-medium">A${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">
                    A${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-sm font-medium text-green-800">
                  Secure Checkout
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
