import React from "react";
import Link from "next/link";
import OrderNumber from "./orderNumber";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-light text-neutral-900 mb-4">
          Order Confirmed!
        </h1>

        <p className="text-neutral-600 mb-2">
          Thank you for your purchase. Your order has been received and is being
          processed.
        </p>

        <p className="text-sm text-neutral-500 mb-8">
          You will receive an email confirmation shortly with your order details
          and tracking information.
        </p>

        {/* Order Number */}
        <div className="bg-white rounded-lg p-4 mb-8 border border-neutral-200">
          <p className="text-sm text-neutral-600 mb-1">Order Number</p>
          <OrderNumber />
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-neutral-800 transition-colors font-medium"
          >
            Continue Shopping
          </Link>

          <Link
            href="/orders"
            className="block w-full border border-neutral-300 text-neutral-700 py-3 px-6 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            View Order Status
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <h3 className="font-medium text-neutral-900 mb-2">Need Help?</h3>
          <p className="text-sm text-neutral-600">
            Contact our customer service team at{" "}
            <a
              href="mailto:support@dimmar.com"
              className="text-black underline hover:no-underline"
            >
              support@dimmar.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
