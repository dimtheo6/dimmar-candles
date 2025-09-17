"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function OrderNumber() {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  // Get order reference from URL params
  const paypalOrder = searchParams.get("order"); // e.g. "paypal-123456"
  const stripeIntent = searchParams.get("payment_intent"); // Stripe redirect param

  useEffect(() => {
    const fetchOrderNumber = async () => {
      let orderKey = "";

      // Determine Firestore document key
      if (paypalOrder && paypalOrder.startsWith("paypal-")) {
        orderKey = paypalOrder.replace("paypal-", "paypal_");
      } else if (stripeIntent) {
        orderKey = `stripe_${stripeIntent}`;
      }

      if (orderKey) {
        try {
          // Try to fetch the order from Firestore
          const orderRef = doc(db, "orders", orderKey);
          const orderSnap = await getDoc(orderRef);

          if (orderSnap.exists()) {
            const orderData = orderSnap.data();
            if (orderData.displayId) {
              setOrderNumber(`#${orderData.displayId}`);
              setLoading(false);
              return;
            }
          }

          // If not found, wait a bit and try again (webhook might be delayed)
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const retrySnap = await getDoc(orderRef);
          if (retrySnap.exists()) {
            const retryData = retrySnap.data();
            if (retryData.displayId) {
              setOrderNumber(`#${retryData.displayId}`);
              setLoading(false);
              return;
            }
          }
        } catch {
          console.log("Could not fetch order, using fallback");
        }
      }

      // Fallback to timestamp-based number
      setOrderNumber(`#DIM-${Date.now().toString().slice(-8)}`);
      setLoading(false);
    };

    fetchOrderNumber();
  }, [paypalOrder, stripeIntent]);

  if (loading) {
    return (
      <p className="font-medium text-neutral-500">Loading order number...</p>
    );
  }

  return <p className="font-medium text-neutral-900">{orderNumber}</p>;
}
