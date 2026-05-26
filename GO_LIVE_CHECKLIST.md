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

## 6. AI & Edge Functions
- [ ] Deploy Edge Functions (`supabase functions deploy ai-recommendation`, `ai-visualization`).
- [ ] Set `GEMINI_API_KEY` securely in Supabase secrets.
- [ ] Verify `aiMonthlyQuota` plan constraints are strictly checked in the Edge Function (not just frontend).
- [ ] Ensure any Customer Memory future AI features have an explicit GDPR/KVKK Boolean opt-in column in `customers` table before enabling.
