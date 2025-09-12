// src/components/PayPalButtons.tsx
// High-level responsibility:
// 1. Lazily load the PayPal JS SDK exactly once (singleton promise) when the user reveals the PayPal tab.
// 2. Render the PayPal Smart Buttons into a container only after it is visible to avoid "zoid destroyed" issues
//    that occur when rendering into hidden / display:none parents.
// 3. Provide retries if the SDK loads but Buttons isn't available yet (rare race / network edge cases).
// 4. Fallback: if Buttons cannot render, request a server-created order and expose its approval URL so the user
//    can still complete checkout off-site.
// 5. Capture the approved order via our API and bubble the resulting order id to the parent on success.
// 6. Clean up button instance on unmount to avoid duplicate if the user toggles methods or navigates away.
"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadScript } from "@paypal/paypal-js";

interface PayPalButtonsProps {
  amount: number; // Total amount (AUD) to charge (already includes shipping / tax outside)
  email?: string; // Optional buyer email (prefills Payer info server-side)
  disabled?: boolean; // Parent can disable interactions temporarily
  onSuccess(orderId: string): void; // Called after a successful capture
  onError?(message: string): void; // Non-fatal error handler (create / capture / render failures)
}

// Using the official loader ensures correct namespace shape & avoids manual script tag race conditions.

// Reuse a single script loading promise to avoid duplicate SDK injection / teardown (singleton pattern)
let paypalScriptPromise: ReturnType<typeof loadScript> | null = null;

export const PayPalButtons: React.FC<PayPalButtonsProps> = ({
  amount,
  email,
  disabled,
  onSuccess,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const renderedRef = useRef(false); // Whether Buttons successfully rendered at least once
  const retryRef = useRef(0); // Retry counter for missing Buttons namespace
  const initRunRef = useRef(false); // Prevent re-init in React Strict Mode double mount
  const [visible, setVisible] = useState(false); // Mark container visible before initial render attempt
  // Visibility detection: we only proceed when the container is actually in the layout flow. Rendering
  // Smart Buttons while the container is hidden can cause the internal iframe bootstrap to self-destruct.
  useEffect(() => {
    // If container exists and has width > 0, treat as visible (not display:none)
    if (containerRef.current && containerRef.current.offsetParent !== null) {
      setVisible(true);
    } else {
      // fallback: schedule visibility check next tick
      const id = requestAnimationFrame(() => {
        if (
          containerRef.current &&
          containerRef.current.offsetParent !== null
        ) {
          setVisible(true);
        }
      });
      return () => cancelAnimationFrame(id);
    }
  }, []);
  // Minimal interface for returned PayPal Buttons instance (subset used)
  interface PayPalButtonsInstance {
    render: (container: HTMLElement) => Promise<void> | void; // Provided by SDK
    close?: () => Promise<void> | void; // Provided by SDK for cleanup
  }
  const paypalButtonsInstanceRef = useRef<PayPalButtonsInstance | null>(null);
  const mountCountRef = useRef(0);

  const maxRetries = 2;
  const [fallbackApproveUrl, setFallbackApproveUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    // Avoid re-initializing buttons if already rendered and amount/email changes minimally.
    if (initRunRef.current && renderedRef.current) {
      return;
    }
    initRunRef.current = true;

    mountCountRef.current += 1;
    const currentMount = mountCountRef.current;
    console.info(
      `[PayPal] mount #${currentMount}, retries so far: ${retryRef.current}`
    );

    async function init() {
      if (!visible) {
        // Defer heavy work; parent selected the tab but container not painted yet.
        setLoading(false);
        return;
      }
      setInitError(null);
      setLoading(true);
      try {
        const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
        if (!clientId) throw new Error("Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID"); // Misconfigured env
        if (!paypalScriptPromise) {
          paypalScriptPromise = loadScript({
            clientId,
            currency: "AUD",
            intent: "capture",
            components: "buttons",
            disableFunding: "card",
            dataNamespace: "paypal_sdk",
            debug: true,
          });
        }
        const paypal = await paypalScriptPromise;
        if (cancelled) return;
        if (!paypal || !paypal.Buttons) {
          console.warn("[PayPal] SDK loaded but Buttons missing", paypal);
          if (retryRef.current < maxRetries) {
            retryRef.current += 1;
            console.info(`[PayPal] retry ${retryRef.current}/${maxRetries}`);
            await new Promise((r) => setTimeout(r, 300));
            return init();
          }
          // Fallback: create order server-side & surface approval link
          try {
            const createRes = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: Number(amount.toFixed(2)),
                email,
              }),
            });
            const data = await createRes.json();
            const links = Array.isArray(data?.links) ? data.links : [];
            const approveLink = links.find(
              (l: unknown): l is { rel: string; href: string } => {
                if (!l || typeof l !== "object") return false;
                const rel = (l as Record<string, unknown>).rel;
                const href = (l as Record<string, unknown>).href;
                return rel === "approve" && typeof href === "string";
              }
            );
            if (approveLink?.href) {
              setFallbackApproveUrl(approveLink.href);
              console.info("[PayPal] using fallback approval link.");
              return;
            }
          } catch (e) {
            console.error(
              "[PayPal] fallback approval link generation failed",
              e
            );
          }
          throw new Error("PayPal SDK failed (Buttons missing)");
        }
        if (!containerRef.current) return;

        // Prevent duplicate renders (important if React remounts during dev or tab toggled quickly)
        if (paypalButtonsInstanceRef.current) {
          console.info(
            "[PayPal] buttons instance already exists; skipping render"
          );
          return;
        }
        containerRef.current.innerHTML = "";

        const buttons = paypal.Buttons({
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
          },
          createOrder: async () => {
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: Number(amount.toFixed(2)),
                email,
              }),
            });
            if (!res.ok) {
              const t = await res.text();
              throw new Error(`Create order failed: ${t}`);
            }
            const data = await res.json();
            if (!data.id) throw new Error("No order id returned");
            return data.id;
          },
          onApprove: async (data: { orderID: string }) => {
            try {
              const res = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: data.orderID }),
              });
              if (!res.ok) {
                const t = await res.text();
                throw new Error(`Capture failed: ${t}`);
              }
              const capture = await res.json();
              onSuccess(capture.id || data.orderID);
            } catch (e: unknown) {
              const msg = e instanceof Error ? e.message : "Capture error";
              onError?.(msg);
            }
          },
          onError: (err: unknown) => {
            let msg = "PayPal error";
            if (err && typeof err === "object" && "message" in err) {
              msg = String((err as Record<string, unknown>).message);
            }
            onError?.(msg);
          },
          onCancel: () => {},
        });

        paypalButtonsInstanceRef.current = buttons;
        // Render after a microtask to ensure container is fully painted / measured
        await Promise.resolve();
        await buttons.render(containerRef.current);
        renderedRef.current = true;
        console.info("[PayPal] buttons rendered successfully");
      } catch (e: unknown) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : "Failed to init PayPal";
          setInitError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => {
      cancelled = true;
      try {
        if (paypalButtonsInstanceRef.current) {
          paypalButtonsInstanceRef.current.close?.();
          paypalButtonsInstanceRef.current = null;
        }
      } catch {
        // ignore
      }
    };
  }, [amount, email, onError, onSuccess, visible]);

  if (initError) {
    return (
      <div className="p-4 rounded-md border border-red-300 bg-red-50 text-sm text-red-700">
        PayPal failed to load: {initError}
        {fallbackApproveUrl && (
          <div className="mt-2">
            <a
              href={fallbackApproveUrl}
              className="underline text-blue-700"
              rel="noopener noreferrer"
              target="_blank"
            >
              Continue with PayPal (fallback)
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {loading && <p className="text-sm text-neutral-600">Loading PayPal…</p>}
      {!loading && !renderedRef.current && !initError && (
        <p className="text-xs text-red-600">
          PayPal not rendered. Check ad blockers / script blockers.
        </p>
      )}
      <div
        ref={containerRef}
        className={disabled ? "opacity-50 pointer-events-none" : ""}
      />
    </div>
  );
};

export default PayPalButtons;
