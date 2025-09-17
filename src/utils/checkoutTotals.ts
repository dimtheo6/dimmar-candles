// src/utils/checkoutTotals.ts
// Centralized totals calculation used by checkout UI and payment intent creation

export interface Totals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

// subtotal is expected in AUD dollars (e.g., 49.9)
export function computeTotals(subtotal: number): Totals {
  const shipping = subtotal === 0 ? 0 : subtotal > 100 ? 0 : 9;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

export function toCents(valueAud: number): number {
  return Math.round(valueAud * 100);
}
