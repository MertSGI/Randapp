# Migration Plan: Local Storage to Supabase

This plan addresses a clean backend switch from the LocalStorage and Mock Service layer to a live Supabase project.

## Phase 1: Database Provisioning and Schema Sync
- Spin up Supabase instance.
- Execute all SQL instructions located in `supabase/migrations/*`.
- Verify the schema through Supabase Dashboard, ensuring the tables matching the mock interfaces exist and RLS policies are enabled.

## Phase 2: Supabase Client Injection
- Replace the mock delay wrappers used in `services/*.ts` with live `@supabase/supabase-js` API calls.
- **Example Mapping**:
  - `localStorage.getItem('lari_registered_tenants')` -> `supabase.from('tenants').select('*')`
  - `localStorage.getItem('lari_active_owner_session')` -> Supabase Auth (`supabase.auth.getSession()`)
  - Admin configuration -> `supabase.from('business_profiles').update(...)`

## Phase 3: Auth & Tenant Binding
- Redirect `/register` to perform `supabase.auth.signUp()`.
- Utilize Supabase auth triggers to automatically insert initial `tenants` and `users_profile` assignments upon signup success.
- Convert the 14-day card-required checkout stub to issue an edge function call `POST /functions/v1/create-checkout-session` rather than synchronously mocking the Iyzico modal.

## Phase 4: Public Booking Read APIs
- Switch public `/pilot` and `/demo` or dynamically slug-based URLs to issue `supabase.from('tenants').select('..., business_profiles(*), services(*), staff(*)')` where `slug = requested_slug`.
- Ensure fallback to local mock data remains available ONLY for pure visual `/demo` cases if needed, otherwise query from the database.

## Critical Cutover Details
- The mock keys `lari_active_tenant_id`, `lari_selected_plan`, `lari_registration_context`, and `lari_demo_context` will be fully deprecated once cutover is complete.
- We must maintain the 14-day card-required trial enforcement logic structurally within the billing Edge Functions.
- All product features, branding boundaries, and QA constraints achieved in the frontend must hold true post-cutover.
