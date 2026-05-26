# Payment Readiness Checklist

This document tracks the readiness state of the Randapp platform for processing real production payments.

**Current State: Sandbox Dry-Run Preparation (Phase 7)**
*Production payment flows and live Iyzico connections are **DISABLED**, but dynamic CTA/Trial modes are pre-wired. Edge functions are scaffolded.*

## Sandbox Setup Steps
1. Apply Supabase migrations.
2. Deploy Edge Functions:
   - `create-checkout-session`
   - `payment-webhook`
   - `subscription-sync`
3. Set Supabase secrets:
   - `IYZICO_API_KEY`
   - `IYZICO_SECRET_KEY`
   - `IYZICO_BASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Configure iyzico sandbox product and plan reference codes.
5. Configure plan provider reference codes in Super Admin.
6. Test checkout session.
7. Test trial start.
8. Test webhook.
9. Verify subscriptions table update.
10. Verify payments table insert.
11. Verify audit log insert.
12. Test cancellation/failure/retry/idempotency.

## Phase 4 & 5 Status: Sandbox Readiness
- [x] Initial payment logic abstractions added (`paymentProvider.ts`).
- [x] Schema drafted for `payments` and `subscriptions`.
- [x] Mock trial flows established based on package configs.
- [x] Edge Function contracts documented (including Trial Period configurations).
- [x] Dynamic CTA transitions completed (Demo requests shift to 'Start Trial' automatically).
- [x] Trial and cancellation texts legalized and translated carefully.
- [x] Implement `create-checkout-session` edge function natively (Scaffolded).
- [x] Implement `payment-webhook` edge function natively (Scaffolded).
- [x] Ensure idempotency handling for webhook logs (Scaffolded).

**No card details are collected live. The frontend contains no Iyzico secrets.**

## 1. Frontend UI State
- [x] Payment UI safely defaults to mock/bypassed logic when `VITE_PAYMENT_PROVIDER=mock`.
- [x] Pricing Page clearly handles Trial-enabled plans dynamically and explicitly warns that cards are not collected in mock mode.
- [x] Billing Tab accurately represents mock trial status (`trialing`), shows remaining days, without false "Payment Completed" claims.
- [x] Super Admin has access to mock subscription toggle for operations.
- [x] All real payment requests correctly route to Edge Function contracts and safely fail/dummy-redirect when offline.

## 2. Infrastructure & Edge Functions (Sandbox Scaffolds Done)
- [x] Edge functions for Iyzico integration (e.g. `create-checkout-session`, `payment-webhook`) scaffolded.
- [ ] Supabase environment secrets required for Iyzico (e.g., `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`) must be manually configured in the cloud environment.
- [ ] Native Sandbox checkout must collect cards securely to initiate trials.

## 3. Webhook & Background Processes (Next Phase)
- [ ] Webhook endpoint must be fully tested from external sandbox payload generators.
- [ ] Trial cancellation and subscription termination must carefully align with webhook states.

## 4. Production Criteria (Next Phase)
Production Live Card Payments will NOT be activated until:
1. All Edge Functions are confirmed deployed and successfully log sandbox events.
2. The Database Subscription tracking completely aligns with Iyzico callback states, including trial-to-paid continuation handling.
3. Super Admins pilot the webhook flow from start to finish without breaking the UI lock out.
