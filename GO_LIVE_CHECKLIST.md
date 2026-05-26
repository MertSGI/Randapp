# Go-Live Checklist (Pre-Production)

## 1. Authentication & Security
- [ ] Connect Supabase Auth for Admin/Salon Owners.
- [ ] Implement OTP / Magic Link for Customer Portal Lite. (Remove LocalStorage mock).
- [ ] Enforce Row Level Security (RLS) on all Supabase tables (`appointments`, `customers`, `notes`, `services`, `staff`).
- [ ] Lock down storage buckets so reference photos are 100% private.

## 2. Payments (iyzico)
- [ ] Complete Sandbox Webhook integration.
- [ ] Test real success/failure card scenarios in Sandbox.
- [ ] Migrate credentials from sandbox to live environment.
- [ ] Super Admin triggers production mode flag.

## 3. Communication Integration
- [ ] Connect transactional SMS provider for appointment confirmations.
- [ ] Connect transactional Email provider for admin alerts.

## 4. Frontend & Reliability
- [ ] Verify `VITE_DATA_MODE=supabase` functions gracefully without UI layout shifts.
- [ ] Enable Service Worker for PWA (Offline edge cases).
- [ ] Clean any console warnings and verify React strict mode behaviors.

## 5. Privacy & KVKK Data Rollout
- [ ] Add explicit KVKK tickboxes to production booking forms.
- [ ] Ensure Terms of Service and Privacy Policy links map to correct legal pages.
- [ ] Verify Data Deletion mechanisms work according to local customer scope requests.
