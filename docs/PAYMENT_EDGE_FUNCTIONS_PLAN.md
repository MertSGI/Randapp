# Payment Edge Functions Plan

To ensure security and proper data handling, **NO payment logic, secret keys, or raw calculations should run in the frontend SPA.**

We plan to implement the following Supabase Edge Functions:

## 1. `POST /functions/v1/create-checkout-session`
**Purpose:** Initialize a new checkout session (hosted payment page or widget token) for a given plan and tenant.
**Payload:** `{ "planId": "professional", "tenantId": "..." }`
**Flow:**
- Validate user's auth token (is admin of tenant).
- Read plan details from server config (price, setup fee).
- Call Payment Provider API with secret key.
- Return Checkout URL or Token to frontend.

## 2. `POST /functions/v1/create-billing-portal-session`
**Purpose:** Allow users to manage their subscription, download invoices, or update credit cards.
**Payload:** `{ "tenantId": "..." }`
**Flow:**
- Validate user auth.
- Retrieve provider `customer_id` from database.
- Call provider's createPortal API.
- Return Portal URL to frontend.

## 3. `POST /functions/v1/payment-webhook`
**Purpose:** Receive async notifications from the payment provider (e.g. successful charge, subscription canceled, trial ended).
**Payload:** Sent by provider.
**Security:** 
- **Webhook signature verification MUST happen here.** Cannot be bypassed.
**Flow:**
- Verify signature.
- Parse event type (`subscription.created`, `payment.failed`, etc.).
- Update Supabase `subscriptions` table.
- Revoke access or provision resources accordingly.

**CRITICAL NOTE:** Subscription table updates must ONLY be based on these verified webhooks, NOT on frontend callbacks or redirects, which can be easily spoofed.
