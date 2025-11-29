# External Integrations & APIs

## 🔌 SMM Provider (Service Delivery)
**Provider:** `JAP (JustAnotherPanel)` or `SMMFollows` (Example)
**Base URL:** `https://api.smmprovider.com/v2`

### Authentication
- **Method:** API Key in request body.
- **Key Name:** `key`

---

## 💳 Payment Gateways (Argentina Friendly)

## 💳 Payment Gateways (Argentina Friendly)

### 1. Cards & Global Payments: Paddle 🚣
**Why:** Merchant of Record (MoR) like Lemon Squeezy but with broader support and robust B2B features.
**Requirement:** You need a verified domain and a launched website to get approved.
**Supports:** Credit Cards, PayPal, Apple Pay, Google Pay.

#### Integration Flow
1.  **Client-side:** Use `Paddle.js` to open checkout overlay.
2.  **Webhooks:** Listen for `transaction.completed` and `subscription.created`.
3.  **Fulfillment:** Backend processes order upon webhook receipt.

### 2. Crypto: Cryptomus ₿
**Why:** Low fees, auto-convert to USDT, popular in SMM industry.
**Supports:** USDT (TRC20/BEP20), BTC, ETH, LTC.

#### Integration Flow
1.  **Create Payment:** POST to `/v1/payment`.
2.  **Display:** Show QR Code / Address to user.
3.  **Webhook:** Receive `payment_status` callback.

---

## 📧 Email Service (Transactional)

### Provider: Resend
- **Library:** `resend`
- **API Key:** `re_123...`

---

## 📊 Analytics

### Provider: PostHog
- **Usage:** Event tracking (Pageview, Order Created, Sign Up).
