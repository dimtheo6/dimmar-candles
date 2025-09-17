import * as React from "react";
import type { OrderRecord } from "@/lib/orders";

interface EmailTemplateProps {
  firstName: string;
  order: OrderRecord;
}

function formatAud(cents: number) {
  return "A$" + (cents / 100).toFixed(2);
}

export function EmailTemplate({ firstName, order }: EmailTemplateProps) {
  const items = order.items || [];
  const subtotal = items.reduce(
    (s, it) => s + (it.unitAmount || 0) * it.qty,
    0
  );
  const gst = Math.round(subtotal * 0.1); // 10%
  const shipping = subtotal > 0 ? 900 : 0; // flat $9 when there is at least one item
  const computedTotal = subtotal + gst + shipping;
  const total =
    order.amountTotal && Math.abs(order.amountTotal - computedTotal) < 5
      ? order.amountTotal
      : computedTotal;
  const year = new Date().getFullYear();

  // Basic palette
  const accent = "#F59E0B";
  const text = "#1F2933";
  const muted = "#556270";
  const border = "#E5E7EB";
  const bg = "#F8FAFC";

  return (
    <div
      style={{
        backgroundColor: bg,
        padding: "32px 12px",
        fontFamily: "Helvetica, Arial, sans-serif",
        color: text,
        fontSize: 14,
        lineHeight: 1.5,
      }}
    >
      <table
        width="100%"
        cellPadding={0}
        cellSpacing={0}
        role="presentation"
        style={{
          maxWidth: 620,
          margin: "0 auto",
          background: "#ffffff",
          border: `1px solid ${border}`,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <tbody>
          <tr>
            <td style={{ background: accent, padding: "20px 28px" }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 20,
                  lineHeight: 1.2,
                  color: "#ffffff",
                  fontWeight: 600,
                }}
              >
                Dimmar Candles
              </h1>
            </td>
          </tr>
          <tr>
            <td style={{ padding: "28px 28px 8px" }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600 }}>
                Hi {firstName || "Custommer"},
              </h2>
              <p style={{ margin: "0 0 18px", fontSize: 14, color: muted }}>
                Your order has been confirmed. Below is your purchase summary.
              </p>

              {/* Order meta */}
              <table
                width="100%"
                style={{ borderCollapse: "collapse", marginBottom: 28 }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{ verticalAlign: "top", padding: 0, width: "50%" }}
                    >
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: ".5px",
                          textTransform: "uppercase",
                          color: muted,
                        }}
                      >
                        Order ID
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontFamily: "monospace",
                          fontSize: 12,
                          wordBreak: "break-all",
                          color: text,
                        }}
                      >
                        {order.id}
                      </p>
                    </td>
                    <td
                      style={{ verticalAlign: "top", padding: 0, width: "50%" }}
                    >
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: ".5px",
                          textTransform: "uppercase",
                          color: muted,
                        }}
                      >
                        Status
                      </p>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 600,
                          backgroundColor:
                            order.status === "paid"
                              ? "#D1FAE5"
                              : order.status === "pending"
                                ? "#FEF3C7"
                                : order.status === "failed"
                                  ? "#FEE2E2"
                                  : "#E5E7EB",
                          color:
                            order.status === "paid"
                              ? "#065F46"
                              : order.status === "pending"
                                ? "#92400E"
                                : order.status === "failed"
                                  ? "#991B1B"
                                  : "#374151",
                          textTransform: "capitalize",
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Items */}
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: ".5px",
                  textTransform: "uppercase",
                  color: muted,
                }}
              >
                Items
              </h3>
              <table
                width="100%"
                cellPadding={0}
                cellSpacing={0}
                role="presentation"
                style={{
                  borderCollapse: "collapse",
                  marginBottom: 28,
                  border: `1px solid ${border}`,
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr style={{ background: "#F1F5F9" }}>
                    <th
                      align="left"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "10px 12px",
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: ".5px",
                      }}
                    >
                      Item
                    </th>
                    <th
                      align="left"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "10px 12px",
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: ".5px",
                      }}
                    >
                      Details
                    </th>
                    <th
                      align="right"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "10px 12px",
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: ".5px",
                      }}
                    >
                      Line Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        style={{
                          padding: "14px 12px",
                          fontSize: 12,
                          color: muted,
                        }}
                      >
                        No items.
                      </td>
                    </tr>
                  )}
                  {items.map((it, idx) => {
                    const unit = it.unitAmount || 0;
                    const line = unit * it.qty;
                    const rowBg = idx % 2 === 1 ? "#FAFAFA" : "#FFFFFF";
                    return (
                      <tr
                        key={it.productId || idx}
                        style={{ background: rowBg }}
                      >
                        <td
                          style={{
                            padding: "12px",
                            fontSize: 14,
                            fontWeight: 500,
                            color: text,
                          }}
                        >
                          {it.name || "Item"}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontSize: 12,
                            color: muted,
                          }}
                        >
                          Qty {it.qty} × {formatAud(unit)}
                        </td>
                        <td
                          align="right"
                          style={{
                            padding: "12px",
                            fontSize: 14,
                            fontWeight: 600,
                            color: text,
                          }}
                        >
                          {formatAud(line)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Summary */}
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: ".5px",
                  textTransform: "uppercase",
                  color: muted,
                }}
              >
                Summary
              </h3>
              <table
                width="100%"
                cellPadding={0}
                cellSpacing={0}
                role="presentation"
                style={{ borderCollapse: "collapse", marginBottom: 32 }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{ padding: "6px 0", fontSize: 14, color: muted }}
                    >
                      Subtotal
                    </td>
                    <td
                      align="right"
                      style={{
                        padding: "6px 0",
                        fontSize: 14,
                        fontWeight: 500,
                        color: text,
                      }}
                    >
                      {formatAud(subtotal)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ padding: "6px 0", fontSize: 14, color: muted }}
                    >
                      Shipping
                    </td>
                    <td
                      align="right"
                      style={{
                        padding: "6px 0",
                        fontSize: 14,
                        fontWeight: 500,
                        color: text,
                      }}
                    >
                      {formatAud(shipping)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ padding: "6px 0", fontSize: 14, color: muted }}
                    >
                      GST (10%)
                    </td>
                    <td
                      align="right"
                      style={{
                        padding: "6px 0",
                        fontSize: 14,
                        fontWeight: 500,
                        color: text,
                      }}
                    >
                      {formatAud(gst)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "10px 0",
                        fontSize: 15,
                        fontWeight: 600,
                        borderTop: `1px solid ${border}`,
                        color: text,
                      }}
                    >
                      Total
                    </td>
                    <td
                      align="right"
                      style={{
                        padding: "10px 0",
                        fontSize: 15,
                        fontWeight: 700,
                        borderTop: `1px solid ${border}`,
                        color: text,
                      }}
                    >
                      {formatAud(total)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p style={{ margin: "0 0 10px", fontSize: 12, color: muted }}>
                If you have any questions, reply to this email and we’ll be
                happy to help.
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF" }}>
                © {year} Dimmar Candles. All rights reserved.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
