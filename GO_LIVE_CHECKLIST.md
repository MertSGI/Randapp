# Randapp Go-Live Checklist

This document tracks the readiness of the Randapp platform before transitioning from the sandbox/mock environment to production operations (Iyzico / Supabase / real APIs).

**Important Note for Pilot Phase:** The app is currently optimized for demonstration using `VITE_DATA_MODE=mock`. Customer memory, demo seeding utilities, and AI configurations are safely locked to local mock storage.

## 1. Routing & Subdomain Readiness
- [x] Implemented `/admin/site-preview` and `/super-admin/tenant-preview/:tenantId` protected routes for secure previewing before go-live.
- [x] Defined routing architecture separating marketing vs tenant paths.
- [x] Mock tenant resolution acts as a fallback on `localhost`.
- [ ] **Action Required (Next Phase)**: Before going live, update `tenantService` to correctly resolve domains if custom root domains are mapped.

## 2. Payment Gateway (Iyzico) Readiness
- [x] Ensured `PricingPage` and internal `BillingTab` do NOT display active card payment collection text when in mock mode.
- [x] Super Admin mock subscription toggle works as a developer utility.
- [ ] **Action Required (Next Phase)**: Configure server-side API endpoints via Edge Functions with actual Iyzico tokens.
- [ ] **Action Required (Next Phase)**: Add explicit Checkout components when `VITE_PAYMENT_PROVIDER=iyzico` connects to real backend. Do not expose Iyzico secret keys to frontend.

## 3. Product & Marketing Generalization
- [x] Marketing copy adapted to clarify support for businesses beyond hair salons.
- [x] Demo Seeder utilities are safely gated in the Marketing Layout footer only when `VITE_DATA_MODE=mock`.

## 4. AI Guardrails (Gemini)
- [x] `SuperAdminAiSettingsPage` deployed in mock mode.
- [x] Frontend Gemini mock integration returns safe defaults, with no API keys exposed in code.
- [x] Customer Memory Reference Photos isolated from AI processing to ensure privacy compliance.
- [ ] **Action Required (Next Phase)**: Gemini proxy backend must be deployed mapping Supabase User ID to Token Quota.

## 5. Security & Access
- [x] Service workers disabled to prevent stale cache issues during presentation.
- [x] Booking Page successfully isolates `subStatus === 'suspended'`.
- [ ] **Action Required (Next Phase)**: Supabase RLS policies must be fully defined before switching off `VITE_DATA_MODE=mock`.
- [ ] **Action Required (Next Phase)**: Customer reference photos must be isolated by `tenantId` explicitly via Postgres RLS before allowing real uploads. No public storage bucket permissions can be granted. 
