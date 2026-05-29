# Responsive & Screenshot QA Checklist (Phase 14)

This checklist defines the required screenshots for final visual and responsive acceptance before proceeding further. Use this list to capture screens across mobile and desktop.

**Required Viewports:**
- Mobile Small (360px / 390px / 430px)
- Desktop (1024px / 1440px)

## 1. Marketing Site (Mobile & Desktop)
**Routes:** `/`, `/features`, `/pricing`, `/demo`, `/contact`, `/mobile-app`
- [ ] **Homepage Hero:** Clean typography, rotating industry phrases working without layout jumps.
- [ ] **Homepage Value Section:** Clear features, no broken grids. 
- [ ] **Features Page:** Showcase appointment & CRM features.
- [ ] **Pricing Page (Monthly/Annual):** Clean cards, no WhatsApp redirect for direct plans.
- [ ] **Mobile App Page:** Must clearly state "planned channel" (not live yet), clean visuals.
- [ ] **Demo Page:** Clean form layout, professional messaging.
- [ ] **Contact Page:** Working layout, translated copy.

## 2. Public / Customer Experience (Mobile-First)
**Routes:** `/:tenantId/book` (or `/book`), `/customer/login`, `/customer/appointments`
- [ ] **Public Landing:** Business profile (simulated or real).
- [ ] **Booking Flow (Mobile):** Service selection, Staff selection, Time selection, Customer Details.
- [ ] **Booking Flow (Desktop):** Step-by-step layout.
- [ ] **Booking - Success Page:** Should prompt the user about the Customer Portal.
- [ ] **Customer Login:** Clean layout asking for Phone or Email.
- [ ] **Customer Portal - Appointments (Mobile):** List of upcoming & past appointments.
- [ ] **Customer Portal - Cancellation:** Clear cancellation warning.

## 3. Admin Owner Panel (Adaptive)
**Route:** `/admin`
- [ ] **Mobile Admin Shell:** Must show bottom navigation bar, NO horizontal cramped tabs on small screens.
- [ ] **Desktop Admin Shell:** Full management panel with horizontal tabs.
- [ ] **Mobile Dashboard/Setup:** Overview cards.
- [ ] **Mobile Appointments List:** Vertical card feed showing Customer, Phone, Service, Staff, Time, Status, and "View Profile" CTA.
- [ ] **Mobile Customer Memory:** Detail view showing latest service, notes, preferences, history.
- [ ] **Mobile Referrals:** Active campaigns layout.
- [ ] **Mobile Billing/Subscription:** Active plan, limits/quotas.

## 4. Super Admin Platform Operations (Adaptive)
**Route:** `/super-admin`
- [ ] **Mobile Super Admin Navigation:** Collapsed drawer or menu layout working on mobile.
- [ ] **Mobile Tenants Page:** Table replaced by stacked cards.
- [ ] **Mobile Onboarding/Review:** Table replaced by responsive cards. 
- [ ] **Mobile Super Admin Plans Page:** Inputs stack cleanly, buttons don't overflow.
- [ ] **Mobile Referrals Page:** Global campaign management.
- [ ] **Mobile Payment Test Page:** Diagnostics clearly visible and stack nicely.
- [ ] **Desktop Super Admin Dashboard:** Operations feel rich and powerful.

## 5. Phase 14J Final Screenshot Readiness Checklist
Ensure these exact screens are captured and reviewed:
1. [ ] Admin Settings mobile (Persistence and fields)
2. [ ] Admin Settings desktop
3. [ ] Super Admin mobile navigation/drawer
4. [ ] Super Admin Tenants mobile
5. [ ] Super Admin Onboarding mobile
6. [ ] Super Admin Plans mobile
7. [ ] Super Admin Referrals mobile
8. [ ] Super Admin Payment Test mobile
9. [ ] Pricing desktop/mobile
10. [ ] Public booking mobile
11. [ ] Booking success mobile
12. [ ] Customer portal mobile

## General Testing Rules
- Both **TR** and **EN** languages must be tested.
- CTAs should trigger intended mock actions or present a professional validation (e.g., "Edge Functions required for payment").
- The product must feel like a cohesive SaaS, not stitched-together generated screens.

