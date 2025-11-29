# Operator Manual: Standard Operating Procedures (SOPs)

## 🎯 Role Overview
As an Operator, your goal is to ensure **speed, quality, and customer satisfaction**. You are the human bridge between the customer and the automated system.

## 1. 📦 Order Processing (Manual/Agency)
**Trigger:** New order with status `PENDING_REVIEW` (usually Agency services).

### Steps:
1.  **Verify Details:** Check if the link is valid and the profile is Public.
2.  **Check Provider:** Go to the SMM Panel (e.g., JAP) and find the service.
3.  **Place Order:** Input the link and quantity in the provider's panel.
4.  **Update System:**
    - If successful -> Set status to `IN_PROGRESS` and save Provider Order ID.
    - If failed -> Check alternative provider.
5.  **Notify:** System automatically emails the customer.

## 2. ⚠️ Dispute Resolution
**Scenario:** Customer complains "Followers dropped" or "Not delivered".

### Protocol:
1.  **Check Status:** Look up Order ID in Dashboard.
    - If `COMPLETED` but customer says no -> Check "Start Count" vs "Current Count" on Instagram.
2.  **Refill (If eligible):**
    - If within 30 days and service has Refill Guarantee -> Trigger "Refill" button in Provider Panel.
    - Reply: "I've initiated a free refill for you. It should start within 24h."
3.  **Refund (Last Resort):**
    - Only if provider cannot deliver.
    - Calculate partial refund if partially delivered.

## 3. 💬 Customer Support Scripts

### ❓ "Why hasn't my order started?"
> "Hi [Name], thanks for reaching out. Most orders start within minutes, but sometimes Instagram updates cause small delays. Your order is in the queue and should start shortly. I'll personally monitor it for you."

### ❓ "My followers dropped!"
> "Hi [Name], this is normal as Instagram filters inactive accounts. Good news: your package includes a 30-Day Refill Guarantee. I've just activated a refill to restore your count. You'll see them coming back soon!"

### ❓ "Can I get a refund?"
> "Hi [Name], I can certainly help. As per our policy, we can refund if the order hasn't started in 72h. Let me check the status... [Check]. It looks like it's currently processing. Let's give it a bit more time, and if it doesn't complete, I'll process that refund for you immediately."

## 4. 🚨 Emergency Procedures
- **Provider Down:** Switch all services to Backup Provider in `services-catalog`.
- **Payment Gateway Issue:** Pause all ads immediately. Notify Admin.
