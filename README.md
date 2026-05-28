# Dimmar Candles — Next.js E‑commerce Store 🕯️

**Dimmar Candles** is a small e‑commerce storefront built with Next.js (App Router), TypeScript, Tailwind CSS, and a simple payments stack (Stripe + PayPal). It's a practical example of a production-ready checkout flow with server APIs, webhooks, and order persistence.

---

## 🚀 Quick start

Prerequisites:

- Node.js 18+ (recommended)
- npm / pnpm / yarn

Install and run locally:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

Build for production:

```bash
npm run build
npm start
```

Run the linter:

```bash
npm run lint
```

---

## 🔧 Features

- Product & category pages using the Next.js App Router (`app/`)
- Shopping cart with client-side state (`src/store/cartStore.ts`)
- Checkout with Stripe Payment Intents (card & Afterpay/Clearpay)
- PayPal Orders integration + server-side create/capture endpoints
- Stripe webhooks to finalize orders (`/api/webhooks/stripe`)
- Email sending via Resend (`src/lib/orders.ts`)
- Firebase client config available for optional integrations (`src/lib/firebase.ts`)
- UI components, React Query provider, Tailwind CSS styling

---

## 🔐 Environment variables

Create a `.env.local` file and provide the following variables used by the app and server API routes:

- Stripe
  - `STRIPE_SECRET_KEY` — your Stripe secret API key
  - `STRIPE_WEBHOOK_SECRET` — webhook signing secret (for production/local testing with Stripe CLI)

- PayPal
  - `PAYPAL_CLIENT_ID` / `NEXT_PUBLIC_PAYPAL_CLIENT_ID` — client id for PayPal JS (sandbox or live)
  - `PAYPAL_SECRET` / `PAYPAL_CLIENT_SECRET` — server-side secret for creating orders
  - `PAYPAL_API_BASE` (optional) — base URL for PayPal API (defaults to sandbox)

- Firebase (client)
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

- Email / notifications
  - `RESEND_API_KEY` — API key for Resend (used to send order emails)
  - `ORDER_EMAIL_FROM` — from address for order emails (e.g. `Store <orders@yourdomain.com>`)

> Tip: For local Stripe Webhook testing, use the Stripe CLI and set `STRIPE_WEBHOOK_SECRET` accordingly.

---

## 🧭 Project structure (high level)

- `app/` — pages & API routes (Next.js App Router)
- `src/components/` — reusable UI components (header, product grid, checkout, PayPal buttons)
- `src/lib/` — integrations (Stripe, PayPal helpers, Firebase, orders/email)
- `src/store/` — client state (cart using Zustand)
- `src/hooks/` — custom React hooks for data fetching and UI behavior

---

## 🧪 Testing Payments

### Stripe (card & Afterpay)

Make sure you are using **test/sandbox keys** (`sk_test_...` / `pk_test_...`) in your `.env.local`.

**Test card numbers (AUD):**

| Scenario                              | Card number           | Expiry          | CVC          |
| ------------------------------------- | --------------------- | --------------- | ------------ |
| Successful payment                    | `4242 4242 4242 4242` | Any future date | Any 3 digits |
| Payment requires authentication (3DS) | `4000 0025 0000 3155` | Any future date | Any 3 digits |
| Card declined                         | `4000 0000 0000 9995` | Any future date | Any 3 digits |

**Afterpay/Clearpay:** Use the test card above (`4242...`) when prompted inside the Afterpay modal. Afterpay test mode auto-approves payments without a real account.

**Testing webhooks locally:**

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli).
2. Log in: `stripe login`
3. Forward events to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the **webhook signing secret** printed by the CLI (`whsec_...`) and set it as `STRIPE_WEBHOOK_SECRET` in `.env.local`.
5. Trigger a test event manually if needed:
   ```bash
   stripe trigger payment_intent.succeeded
   ```

Full list of Stripe test cards: https://stripe.com/docs/testing#cards

---

### PayPal

Make sure `PAYPAL_API_BASE` is set to the sandbox URL (or left unset — it defaults to `https://api-m.sandbox.paypal.com`) and that you're using sandbox credentials.

1. Create a [PayPal Developer](https://developer.paypal.com/dashboard/) account and navigate to **Sandbox > Accounts**.
2. Use the auto-generated **buyer** sandbox account to log in and approve payments during checkout.
3. Use the auto-generated **merchant** sandbox account credentials as `PAYPAL_CLIENT_ID` / `PAYPAL_SECRET`.
4. After a successful capture you can verify the transaction in the **Sandbox > Transactions** dashboard.

---

## 🔁 Payments & Orders

- Stripe: server-side Payment Intent creation at `/api/create-payment-intent`, and webhook handling in `/api/webhooks/stripe`.
- PayPal: server-side create and capture endpoints under `/api/paypal/*`. Orders are persisted (pending → captured) via `saveOrUpdateOrder`.

---

## 📦 Deployment

This project deploys easily to Vercel (recommended) — the App Router and Edge/Server routes work out of the box.
When deploying, set all environment variables in your Vercel project settings.
