# Row Level Security (RLS) Policy Plan & Table Access Control Matrix

To ensure that the LARİ multi-tenant architecture remains secure and leak-proof, Supabase RLS is configured across all tables. This document outlines the granular table-by-table access controls, parameters, and roles.

---

## 1. Access Control Matrix

| Table Name | Public Read | Owner Read/Write | Customer Write | Super Admin | Service Role | tenant_id Required | branch_id Optional | Audit Fields Required |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **tenants** | ❌ No | ✅ Yes (Read/Edit meta) | ❌ No | ✅ Yes (Full) | ✅ Yes | ✅ Yes (primary) | ❌ No | `created_at`, `updated_at` |
| **business_profiles** | ✅ Yes | ✅ Yes (Full) | ❌ No | ✅ Yes (Full) | ✅ Yes | ✅ Yes (primary) | ❌ No | `created_at`, `updated_at` |
| **services** | ✅ Yes | ✅ Yes (Full) | ❌ No | ✅ Yes (Full) | ✅ Yes | ✅ Yes (primary) | ❌ No | `created_at`, `updated_at` |
| **staff** | ✅ Yes | ✅ Yes (Full) | ❌ No | ✅ Yes (Full) | ✅ Yes | ✅ Yes (primary) | ✅ Yes | `created_at`, `updated_at` |
| **branches** | ✅ Yes | ✅ Yes (Full) | ❌ No | ✅ Yes (Full) | ✅ Yes | ✅ Yes (primary) | ❌ No | `created_at`, `updated_at` |
| **appointments** | ❌ No | ✅ Yes (Full) | ✅ Yes (Booking) | ✅ Yes (Full) | ✅ Yes | ✅ Yes (primary) | ✅ Yes | `created_at`, `updated_at`, `updated_by` |
| **customers** | ❌ No | ✅ Yes (Full) | ✅ Yes (Booking) | ✅ Yes (Full) | ✅ Yes | ✅ Yes (primary) | ❌ No | `created_at`, `updated_at` |
| **customer_memory** | ❌ No | ✅ Yes (Full) | ❌ No | ✅ Yes (Full) | ✅ Yes | ✅ Yes (primary) | ❌ No | `created_at`, `updated_at` |
| **subscriptions** | ❌ No | ✅ Yes (Read-Only) | ❌ No | ✅ Yes (Full) | ✅ Yes | ✅ Yes (primary) | ❌ No | `created_at`, `updated_at` |
| **referrals** | ❌ No | ✅ Yes (Read-Only) | ❌ No | ✅ Yes (Full) | ✅ Yes | ✅ Yes (primary) | ❌ No | `created_at`, `updated_at` |
| **customer_campaigns** | ✅ Yes | ✅ Yes (Full) | ❌ No | ✅ Yes (Full) | ✅ Yes | ✅ Yes (primary) | ❌ No | `created_at`, `updated_at` |
| **communication_outbox**| ❌ No | ✅ Yes (Full) | ❌ No | ✅ Yes (Full) | ✅ Yes | ✅ Yes (primary) | ❌ No | `created_at` |
| **custom_domain_requests**| ❌ No | ✅ Yes (Create/Read) | ❌ No | ✅ Yes (Full) | ✅ Yes | ✅ Yes (primary) | ❌ No | `created_at`, `updated_at` |
| **media_records** | ✅ Yes | ✅ Yes (Full) | ❌ No | ✅ Yes (Full) | ✅ Yes | ✅ Yes (primary) | ❌ No | `created_at` |

---

## 2. Granular Security Policies by Table

### Tenants (`tenants`)
*   **Purpose**: Core tenant workspace subscription parameters and identification.
*   **Policies**:
    *   `SELECT / UPDATE`: Only authenticated owners where `auth.uid()` links to the tenant via `users_profile`.
    *   Super Admin has root access to transition plans or verify accounts.
    *   No dynamic public modifications allowed.

### Business Profiles (`business_profiles`)
*   **Purpose**: Public representation, holding custom aesthetic parameters, hours, logos.
*   **Policies**:
    *   `SELECT`: Public access allowed if profile is enabled.
    *   `UPDATE`: Only authenticated tenant owners.

### Services (`services`) & Staff (`staff`)
*   **Purpose**: The operational catalogue used by the booking public layout.
*   **Policies**:
    *   `SELECT`: Universally viewable if associated with an active public-facing profile.
    *   `INSERT / UPDATE / DELETE`: Only authenticated tenant owners.

### Business Branches (`branches`)
*   **Purpose**: Defines operational workspace subdivisions for Enterprise packaging.
*   **Policies**:
    *   `SELECT`: Public-readable for booking choices.
    *   `INSERT / UPDATE / DELETE`: Restricted to the owning tenant session.

### Appointments (`appointments`) & Customers (`customers`)
*   **Purpose**: Dynamic transactions and CRM metrics entries.
*   **Policies**:
    *   `SELECT`: Only authorized tenant accounts. Standard public sessions **cannot** fetch individual/list appointments.
    *   `INSERT`: Allowed anonymously to support customer-facing reservations, with strict validations mapping parameters to the active tenant space.
    *   `UPDATE / DELETE`: Denied to general public. Authorized owners only.

### Customer Memory / Notes (`customer_memory`)
*   **Purpose**: Private notes, preferences, or visual reference records.
*   **Policies**:
    *   **Strict Block**: Public access entirely denied.
    *   `SELECT / INSERT / UPDATE / DELETE`: Bounded solely to the owning tenant ID to keep notes secure.

### Subscriptions (`subscriptions`)
*   **Purpose**: Plans, periods, prices, and renew cycles.
*   **Policies**:
    *   `SELECT`: Tenant owners can view active limits and invoices.
    *   `INSERT / UPDATE / DELETE`: Prohibited for tenant sessions. Managed exclusively via backend jobs or Super Admin tools using the `service_role` credential.

### Communication / Outbox (`communication_outbox`)
*   **Purpose**: Temporary outbox mapping to SMS/WhatsApp template pipelines.
*   **Policies**:
    *   `SELECT / UPDATE`: Authorized tenant owners (to see notifications ready to send or logged).
    *   `INSERT`: System or Edge Functions.

### Custom Domain Requests (`custom_domain_requests`)
*   **Purpose**: Handles requests processing for custom salon `.com` redirects.
*   **Policies**:
    *   `SELECT / INSERT`: Registered owners wishing to apply their own domain.
    *   `UPDATE / DELETE`: Restricted to Super Admin reviewing certificate logs.

---

## 3. Super Admin & Service Role Privileges

*   **Super Admin Override**: Super Admins override isolation filters. A custom database security rule or user attribute flag (`role = 'super_admin'`) bypasses basic `tenant_id` scopes to support customer diagnostics and configuration fixes.
*   **Service Role Safeguards**: The database `service_role` key passes all RLS barriers. It is strictly secluded inside secure cloud runtime contexts (Edge, Express services) and must never be exposed or referenced in client-facing frontend files. All user audit entries must record `updated_by` context to guarantee traceability.
