# Email Marketing Strategy: Automation Flows

## 🎯 Objective
Maximize **LTV (Lifetime Value)** and recover lost revenue through automated, timely emails.

## 1. 👋 Welcome Series (Lead Nurture)
**Trigger:** User signs up (or claims Free Trial).
- **Email 1 (Immediate):** "Welcome to Trend Up! 🚀"
  - Content: Introduction, 10% OFF first order coupon.
  - Goal: First purchase.
- **Email 2 (24h later):** "Why top influencers choose us"
  - Content: Social proof, case study.
  - Goal: Trust building.

## 2. 🛒 Abandoned Cart Recovery (High Priority)
**Trigger:** User adds to cart but doesn't pay within 1 hour.
- **Email 1 (1h later):** "Did you forget something?"
  - Content: Reminder of items in cart.
  - Goal: Recover sale.
- **Email 2 (12h later):** "Don't lose your growth! 📉"
  - Content: Urgency, "Stock is running low" (scarcity).
  - Goal: Recover sale.
- **Email 3 (24h later):** "Here is 5% OFF to help you decide"
  - Content: Small discount code.
  - Goal: Conversion at lower margin.

## 3. 💎 Post-Purchase Upsell (Retention)
**Trigger:** Order completed.
- **Email 1 (Immediate):** "Order Received! + A Gift 🎁"
  - Content: Receipt + Referral link ("Invite a friend, get $5").
  - Goal: Virality.
- **Email 2 (7 days later):** "Running low on fuel?"
  - Content: Reminder to refill or buy next tier.
  - Goal: Repeat purchase.

## 4. ↩️ Win-Back Campaign (Churn Prevention)
**Trigger:** No purchase in 30 days.
- **Email 1:** "We miss you, [Name] 🥺"
  - Content: "Come back and get 15% OFF your next order".
  - Goal: Reactivation.

---

## 🛠️ Technical Implementation
- **Provider:** Resend
- **Logic:** Triggered via Webhooks from Supabase (`auth.users`, `orders`).
