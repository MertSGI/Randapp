# Payment Readiness Checklist

This document tracks the readiness state of the Randapp platform for processing real production payments.

**Current State: Safe for Pilot (No Live Payments)**

## 1. Frontend UI State
- [x] Payment UI safely defaults to mock/bypassed logic when `VITE_DATA_MODE=mock`.
- [x] Pricing Page clearly labels plans but does not process real card transactions in mock mode.
- [x] Billing Tab accurately represents mock trial/subscription status without false "Payment Completed" claims.
- [x] Super Admin has access to mock subscription toggle for operations.
- [x] Payment Test view in Super Admin remains mock/sandbox only, no real payment capability.

## 2. Infrastructure & Edge Functions (Next Phase)
- [ ] Edge functions for Iyzico integration (e.g. `create-payment`, `webhook-handler`) must be built and deployed via Supabase CLI.
- [ ] Supabase environment secrets required for Iyzico (e.g., `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`) must be manually configured in the cloud environment.
- [ ] Sandbox testing must be enabled through configuration variables instead of code-level bypass hacks.

## 3. Webhook & Background Processes (Next Phase)
- [ ] Webhook endpoint must be fully tested from external sandbox payload generators.
- [ ] Subscription lifecycle scripts (activation, pause, termination) must properly reflect webhook events.

## 4. Production Criteria (Next Phase)
Production Live Card Payments will NOT be activated until:
1. All Edge Functions are confirmed deployed and successfully log sandbox events.
2. The Database Subscription tracking completely aligns with Iyzico callback states.
3. Super Admins pilot the webhook flow from start to finish without breaking the UI lock out.
