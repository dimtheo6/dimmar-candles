"use client";

import { useEffect, useState } from "react";
import type { OrderRecord } from "@/lib/orders";
import Loading from "@/components/loading";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  shipped: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  failed: "bg-red-50 text-red-600 border border-red-200",
  refunded: "bg-stone-100 text-stone-500 border border-stone-200",
};

const FILTERS = ["All Orders", "New", "Processing", "In Production"] as const;

export default function AdminPage() {
  const [activeBtn, setActiveBtn] = useState("All Orders");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string>("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 gap-8 p-10 bg-stone-50 min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight text-neutral-900">
          Order Management
        </h1>
        <p className="text-sm text-stone-500 max-w-xl leading-relaxed">
          Monitor your artisanal production queue, track individual batch
          performance, and manage customer delivery expectations with precision.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: orders.length },
          {
            label: "Paid",
            value: orders.filter((o) => o.status === "paid").length,
          },
          {
            label: "Pending",
            value: orders.filter((o) => o.status === "pending").length,
          },
          {
            label: "Revenue",
            value: `$${(orders.reduce((sum, o) => sum + o.amountTotal, 0) / 100).toFixed(2)}`,
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white border border-neutral-200 rounded-lg p-5 space-y-1"
          >
            <p className="text-xs text-stone-400 uppercase tracking-widest">
              {label}
            </p>
            <p className="text-2xl font-light text-neutral-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-neutral-200">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveBtn(filter)}
            className={`px-4 py-2 text-sm transition-colors cursor-pointer border-b-2 -mb-px ${
              activeBtn === filter
                ? "border-neutral-900 text-neutral-900 font-medium"
                : "border-transparent text-stone-400 hover:text-neutral-700"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        {/* Table Head */}
        <div className="grid grid-cols-[1.5fr_2fr_2fr_1fr_1fr] gap-4 px-6 py-3 bg-stone-50 border-b border-neutral-200 text-xs uppercase tracking-widest text-stone-400">
          <span>Order ID</span>
          <span>Customer</span>
          <span>Items</span>
          <span>Status</span>
          <span className="text-right">Total</span>
        </div>

        {/* Table Body */}
        {orders.length === 0 ? (
          <div className="px-6 py-16 text-center text-stone-400 text-sm">
            No orders found.
          </div>
        ) : (
          orders.map((order, i) => (
            <div
              key={order.id}
              onClick={() => setExpandedOrderId((prev)=> prev === order.id ? "" : order.id)}
              className={`grid grid-cols-[1.5fr_2fr_2fr_1fr_1fr] gap-4 px-6 py-4 items-center text-sm ${
                i !== orders.length - 1 ? "border-b border-neutral-100" : ""
              } hover:bg-stone-50 transition-colors`}
            >
              {/* Order ID */}
              <span className="font-mono text-xs text-stone-500">
                {order.displayId}
              </span>

              {/* Customer */}
              <div className="flex flex-col gap-0.5">
                <span className="text-neutral-800 font-medium">
                  {order.customer.name ?? "—"}
                </span>
                <span className="text-stone-400 text-xs">
                  {order.customer.email}
                </span>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-0.5">
                {order.items.map((item, j) => (
                  <span key={item.productId ?? j} className="text-neutral-700">
                    {item.name}{" "}
                    <span className="text-stone-400">×{item.qty}</span>
                  </span>
                ))}
              </div>

              {/* Status */}
              <span
                className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs capitalize w-fit ${
                  STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
                }`}
              >
                {order.status}
              </span>

              {/* Total */}
              <span className="text-right text-neutral-800 font-medium">
                ${(order.amountTotal / 100).toFixed(2)}
              </span>
              {expandedOrderId === order.id && (
              <div className="flex justify-between items-center">
                <div>
                  <h1>Shipping Details</h1>
                  <p></p>
                </div>
                <div>

                </div>
              </div>
                )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
