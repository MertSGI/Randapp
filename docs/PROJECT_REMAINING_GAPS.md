# Randapp Project Gaps & Remaining Work (Phase 14E Checkpoint)

This document categorizes the known missing pieces, pending integrations, and feature gaps that must be addressed before specific milestones.

### 1. Must fix before screenshot QA
- Ensure all generated/placeholder visual assets are strictly professional or user-facing friendly (no 'mock/debug' labels visible).
- Review all destructive button visual hierarchy (delete/deactivate actions should look intentional and warnings clear).
- Finalize the layout styling on mobile breakpoints (`md:hidden` states, responsive padding).
- Ensure "No records available" empty states look inviting rather than broken.

### 2. Must fix before pilot demo
- Ensure any "demo seed reset" does not wipe cross-tenant boundaries if multiple users are exploring concurrently.
- Complete Turkish/English translations (resolve any remaining mixed TR/EN copy).
- Legal/KVKK final review for booking forms (requires valid privacy policy links and explicit consent check).
- Clean up any raw JSON/debug screens that could leak mock environment details.

### 3. Must fix before Supabase sandbox
- Validate exact RLS (Row Level Security) policies (`docs/SUPABASE_RLS_AND_SECURITY_MODEL.md`) against actual edge functions.
- Secure private storage buckets for customer formula notes to prevent cross-tenant photo leaks.
- Real authentication flows using Supabase GoTrue (Email OTP or Magic Links) instead of mock login keys.

### 4. Must fix before production payment
- Integrate real iyzico sandbox API endpoints inside secure Supabase Edge Functions.
- Secure webhook signature verification (`x-iyzico-signature`) handling on incoming hooks.
- Handle multi-tenant subscription states dynamically vs static mock objects.
- Ensure service roles (VITE_SUPABASE_SERVICE_KEY) are removed from any potential frontend bundle exposures and moved 100% to backend Edge functions.

### 5. Can wait for later roadmap
- Automated referral rewards/wallet credit assignment (currently mock calculation).
- Deep integration with Gemini AI Edge functions for customer preference summaries (currently simulated logic).
- Mobile Application wrapping (Capacitor/React Native) for marketplace downloads.
- Salon discovery marketplace/rating features for B2C traffic.
- Full two-way Google Calendar calendar sync for staff availability mapping.
