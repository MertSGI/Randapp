# Final Pilot Readiness Checklist

This document details the critical path requirements for moving the Randapp project from Phase 0 to Phase 1 (Pilot Readiness).

## Core Architecture Integrity
- [x] **No Live Backend/Secrets:** Ensure no live Supabase keys, production Stripe/iyzico keys, or undocumented APIs exist.
- [x] **Mock-Safe Service Layer:** Services fallback to `localStorage` gracefully when `VITE_DATA_MODE=mock`.
- [x] **Separation of Concerns:** Contexts manage state, Services mock DB, Components manage UI.

## SaaS Flow & Provisioning
- [x] **Subscription Flow:** Onboarding triggers Trial/Purchase appropriately.
- [x] **Tenant Setup Configuration:** "Public Display Name", "Slug", Services, Staff, Brand Colors configurable via Admin.
- [x] **Slug Verification:** `slugUtils.ts` handles clean URL creation.
- [x] **Provisioning Gate:** Tenant site is available publicly (`is_public_profile_enabled = true`) only when setup is complete and plan is active.

## Abuse Prevention & KYB
- [x] **Verification Structure:** Mock models exist for Business Identity, Contact, and Risk Level.
- [x] **Super Admin Queue:** System conceptually supports a Super Admin approval/rejection pipeline for flagged content.
- [x] **Prohibited Business Policy:** Explicit definition of allowed vs. prohibited services documented.

## UI/UX & Formatting
- [x] **Embedded Booking:** Booking flow must sit within the salon site shell without breaking or redirecting.
- [x] **Navigation Fixes:** Anchor links (`#contact`, `#services`) scroll smoothly and do not break the HashRouter framework.
- [x] **Customer UI Cleanliness:** No "not-live", "mock mode", or internal system error banners displayed to the end booking user.
- [x] **Responsive Compliance:** Tested across devices according to `RESPONSIVE_QA_MATRIX.md`.

## Next Steps (Post-Pilot)
1. Substitute the LocalStorage mock layer with an authenticated Supabase backend.
2. Replace local Cloudflare Turnstile/reCAPTCHA mocks with strict implementations.
3. Integrate real payment gateway credentials for checkout.
4. Establish actual automated DNS generation (e.g., Cloudflare API) for tenant subdomain/custom-domain mappings.
