# Row Level Security (RLS) Policy Plan

To ensure that the LARİ multi-tenant architecture remains secure and leak-proof, Supabase RLS is configured across all tables.

## Guiding Principles

1. **Tenant Isolation**: A user with `role = 'salon_owner'` or `role = 'staff'` can only read or modify records where `tenant_id` matches their own tenant binding in `users_profile`.
2. **Public Minimization**: The public (unauthenticated or unverified users) can only read explicit public records:
   * Published `tenant_business_profiles` (when `is_public_profile_enabled = true`).
   * Active `services` and `staff` connected to a published tenant.
   * `availability_rules` required for booking interfaces.
3. **Safe Ingestion (Booking)**: The public can `INSERT` into `appointments` through restricted payload structures (or preferably via an Edge Function doing validation), but cannot `SELECT` lists of appointments. 
4. **Super Admin Omnipotence**: Users with `role = 'super_admin'` bypass standard tenant filters via policy overrides.
5. **Private Data Safety**: `customer_memory`, `payments`, `audit_logs`, and `business_verification_reviews` are NEVER accessible to public roles.

## Mapping RLS to Workflows

### 1. Booking Flow
- Public user views `/[tenant slug]`. 
- RLS allows `SELECT` from `tenants`, `business_profiles`, `services`, `staff`, `availability_rules` where `slug` matches.
- Public user commits a booking. 
- Due to strict validation needs (preventing double-booking), we recommend handling appointment insertion through a secure Edge Function with the `service_role` key, rather than exposing direct public `INSERT` capability on `appointments`. If direct `INSERT` is used, the policy will restrict modifying explicit constraints.

### 2. Tenant Dashboard (Admin)
- `salon_owner` logs in.
- RLS validates `auth.uid()` against `users_profile` and allows `SELECT`, `UPDATE`, `INSERT`, `DELETE` operations on `services`, `staff`, `appointments`, `customer_memory` exclusively bounded by `tenant_id`.

### 3. Iyzico Webhooks & Payments
- Edge Functions handling Iyzico webhooks will use the `service_role` key to bypass RLS, allowing them to record events in `payment_events`, `payments`, and update `subscriptions` safely without exposing those tables to external modification.

### 4. Application Status Updates
- To prevent sandbox tampering, fields like `subscription_status`, `verification_status`, and `public_site_status` on the `tenants` table cannot be updated by `salon_owner`. The RLS `UPDATE` policy or column-level permissions (via views or Edge Functions) structure keeps these variables heavily governed.
