# Screenshot QA Checklist (Phase 12)

This checklist defines the required screenshots for final visual acceptance before proceeding to Phase 13 (Real Supabase & iyzico execution). Use this list to capture screens and provide feedback.

## 1. Marketing Site 
**Routes:** `/`, `/features`, `/pricing`, `/demo`, `/contact`, `/mobile-app`
- [ ] **Homepage Hero:** Clean typography, rotating industry phrases working without layout jumps.
- [ ] **Homepage Value Section:** Clear features, no broken grids. 
- [ ] **Features Page:** Showcase appointment & CRM features.
- [ ] **Pricing Page (Monthly):** Correct localization, clean cards, no WhatsApp redirect for direct plans.
- [ ] **Pricing Page (Annual):** Discount badges visible and correctly calculated.
- [ ] **Mobile App Page:** Must clearly state "planned channel" (not live yet), clean visuals.
- [ ] **Demo Page:** Clean form layout, professional messaging.
- [ ] **Contact Page:** Working layout, translated copy.

## 2. Public / Customer Experience
**Routes:** `/:tenantId/book` (or `/book`), `/customer/login`, `/customer/appointments`
- [ ] **Public Landing:** Business profile (simulated or real).
- [ ] **Booking - Service Selection:** Clean list of services with prices.
- [ ] **Booking - Staff Selection:** "No Preference / Bana Fark Etmez" option visible.
- [ ] **Booking - Time Selection:** Clear slots.
- [ ] **Booking - Customer Details:** Autofill friendly inputs (Name, Email, Phone).
- [ ] **Booking - Success Page:** Should prompt the user about the Customer Portal.
- [ ] **Customer Login:** Clean layout asking for Phone or Email.
- [ ] **Customer Portal - Appointments:** Upcoming & past lists. No 'Unknown' hardcoded defaults if data exists.
- [ ] **Customer Portal - Cancellation:** Clear cancellation warning and status updates.

## 3. Admin Owner Panel
**Route:** `/admin`
- [ ] **Dashboard/Setup:** Overview charts or welcome screen.
- [ ] **Appointments List:** Clean table or feed.
- [ ] **Appointment Card:** Should show Customer, Phone, Service, Staff, Time, Status, and "View Profile" CTA.
- [ ] **Customer Memory:** Detail view showing latest service, notes, preferences, history.
- [ ] **Referrals:** Active campaigns layout, no "coming soon" blockers for the mock data.
- [ ] **Reports:** Chart visibility, mock estimates.
- [ ] **Billing/Subscription:** Active plan, limits/quotas (e.g., AI requests, Staff), "Payment integration is not configured" message on checkout attempts.
- [ ] **Site Preview:** Simulated website view.

## 4. Super Admin Platform Operations
**Route:** `/super-admin`
- [ ] **Super Admin Dashboard:** tenant approval state, MRR estimates.
- [ ] **Plans/Pricing Manager:** Table of plans with Add/Edit behavior.
- [ ] **Referrals/Campaigns Manager:** Global/tenant campaign overview.
- [ ] **Payment Test Page:** Diagnostic view showing what is missing (secrets) vs what is ready. No fake success.
- [ ] **AI Settings:** Clear explanation of API key handling (backend proxy) and photo usage policies.
- [ ] **Tenant Preview:** Rendering the tenant's admin view as an impersonator.

## General Testing Rules
- Both **TR** and **EN** languages must be tested.
- CTAs should trigger intended mock actions or present a professional validation (e.g., "Edge Functions required for payment").
- Ensure no responsive layout breaks on Mobile width (capture standard mobile views selectively for Booking/Portals).
