// src/app/checkout/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("Missing Stripe publishable key");
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

interface CheckoutForm {
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

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const stripe = useStripe();
  const elements = useElements();
  const [showCard, setShowCard] = useState(true);
  const [showPaypal, setShowPaypal] = useState(false);

  const [formData, setFormData] = useState<CheckoutForm>({
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

  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate totals
  const subtotal = totalPrice;
  const shipping = subtotal > 100 ? 0 : 9;
  const tax = subtotal * 0.1; // 10% tax (GST)
  const total = subtotal + shipping + tax;

  // Redirect if cart is empty
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof CheckoutForm]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {};

    // Required fields
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zipCode) newErrors.zipCode = "Postcode is required";

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !stripe || !elements) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Confirm payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
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

      if (error) {
        console.error("Payment failed:", error);
        alert(`Payment failed: ${error.message}`);
      } else {
        // Payment succeeded, clear cart
        clearCart();
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h1 className="text-2xl font-light text-neutral-900 mb-8">
              Checkout
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information */}
              <section>
                <h2 className="text-lg font-medium text-neutral-900 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 transition-colors ${
                        errors.email ? "border-red-300" : "border-neutral-300"
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        autoComplete="given-name"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 transition-colors ${
                          errors.firstName
                            ? "border-red-300"
                            : "border-neutral-300"
                        }`}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        autoComplete="family-name"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 transition-colors ${
                          errors.lastName
                            ? "border-red-300"
                            : "border-neutral-300"
                        }`}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      autoComplete="tel"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 transition-colors"
                      placeholder="+61 4XX XXX XXX"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="text-lg font-medium text-neutral-900 mb-4">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      autoComplete="street-address"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 transition-colors ${
                        errors.address ? "border-red-300" : "border-neutral-300"
                      }`}
                      placeholder="123 Main Street"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Apartment, suite, etc.
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      autoComplete="address-line2"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 transition-colors"
                      placeholder="Unit 2B"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        autoComplete="address-level2"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 transition-colors ${
                          errors.city ? "border-red-300" : "border-neutral-300"
                        }`}
                        placeholder="Sydney"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        State *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        autoComplete="address-level1"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 transition-colors ${
                          errors.state ? "border-red-300" : "border-neutral-300"
                        }`}
                      >
                        <option value="">Select State</option>
                        <option value="NSW">New South Wales</option>
                        <option value="VIC">Victoria</option>
                        <option value="QLD">Queensland</option>
                        <option value="WA">Western Australia</option>
                        <option value="SA">South Australia</option>
                        <option value="TAS">Tasmania</option>
                        <option value="ACT">
                          Australian Capital Territory
                        </option>
                        <option value="NT">Northern Territory</option>
                      </select>
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Postcode *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      autoComplete="postal-code"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 transition-colors ${
                        errors.zipCode ? "border-red-300" : "border-neutral-300"
                      }`}
                      placeholder="2000"
                      maxLength={4}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Payment Information */}
              <section>
                <h2 className="text-lg font-medium text-neutral-900 mb-4">
                  Payment Information
                </h2>
                <div className="border-1 border-neutral-300 rounded-lg cursor-pointer">
                  <div>
                    <label
                      htmlFor="card"
                      className={`flex justify-between items-center p-4 ${
                        showCard && "border-1 rounded-t-lg border-neutral-900"
                      } cursor-pointer w-full`}
                    >
                      <span>Pay with Card</span>
                      <input
                        type="radio"
                        id="card"
                        checked={showCard}
                        className="cursor-pointer"
                        onChange={() => {
                          setShowCard(!showCard);
                          setShowPaypal(false);
                        }}
                      />
                    </label>
                    {showCard && (
                      <div className={`p-4 border border-neutral-200  bg-neutral-50 ${showCard ? "h-auto" : "h-0"} transition-all duration-300 ease-in-out`}>
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
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="paypal"
                      className={`flex justify-between items-center p-4 ${
                        showPaypal && "border-1 border-neutral-900"
                      } cursor-pointer w-full`}
                    >
                      <span>Pay with PayPal</span>
                      <input
                        type="radio"
                        id="paypal"
                        className="cursor-pointer"
                        checked={showPaypal}
                        onChange={() => {
                          setShowPaypal(!showPaypal);
                          setShowCard(false);
                        }}
                      />
                    </label>

                    {showPaypal && (
                      <div className="p-4 border border-neutral-200 rounded-b-lg bg-neutral-50">
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
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !stripe}
                className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-colors ${
                  isSubmitting || !stripe
                    ? "bg-neutral-400 cursor-not-allowed"
                    : "bg-black hover:bg-neutral-800"
                }`}
              >
                {isSubmitting ? "Processing..." : `Pay A$${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-sm h-fit">
            <h2 className="text-lg font-medium text-neutral-900 mb-6">
              Order Summary
            </h2>

            {/* Items */}
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

            {/* Totals */}
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

            {/* Security Notice */}
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
    if (total > 0) {
      setIsLoading(true);
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Convert to cents
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
          if (data.error) {
            throw new Error(data.error);
          }
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Error creating payment intent:", error);
          setError("Failed to initialize payment. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [total]);

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
    <Elements
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
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
}
