# LARİ Multi-Branch Foundation

This document traces the foundation established to safely support multi-branch salon and business models (clinics, chains, franchises) within the LARİ platform, while preventing single-branch merchants from suffering UX overload.

## 1. Architectural Strategy

We chose a localized "Tenant → Branch → Service/Staff/Appointment" scaling model:
- **Tenant:** Denotes the primary business entity or corporate account. All subscriptions, payments, and global policies belong here.
- **Branch (`BusinessBranch`):** Denotes physical or distinct operational locations.
  - A singleton tenant will silently operate under an automatically derived **Primary Branch**.
  - A Kurumsal (Enterprise) tenant can define and manage multiple branches.

## 2. Entitlement Gating

The multi-branch features are tightly enclosed within `entitlementService.ts`.
- **Başlangıç, Standart, Profesyonel, Premium:** `maxBranches = 1`, `multi_branch = false`.
- **Kurumsal:** `maxBranches = 999`, `multi_branch = true`.
- Attempted expansion by a non-Kurumsal user will result in a visual upsell/lock message inside the `BranchManagementSection`.

## 3. Public Booking Routing (Foundation Phase)

### Current Implementation state:
- The public `SalonWebsiteView` handles single-branch requests flawlessly.
- Data structures (`types.ts`) accept `branchId` cleanly across related relational data (`Appointment`, `Service`, `Staff`).

### **Roadmap for Full Enterprise Online Booking:**
When full multi-branch goes live entirely, the UX flow should be:
1. `BookingPage` resolves the `Tenant`.
2. Checks `branchService.listBranches(tenant.id)`.
3. If branches > 1: Present a map/list branch selector as **Step 0**.
4. Steps 1-5 filter out `Staff`, `Services`, and `timeSlots` corresponding ONLY to the selected `branchId`.

## 4. Supabase DB Schema Implications (Migration Preview)

While currently simulated in `branchService.ts` via structured `localStorage`, the data-source adapter strategy dictates the following Supabase footprint when formally migrating:

```sql
CREATE TABLE public.business_branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    city TEXT,
    district TEXT,
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    public_site_status TEXT DEFAULT 'published',
    verification_status TEXT DEFAULT 'not_submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Related future alters:
-- ALTER TABLE public.staff ADD COLUMN branch_id UUID REFERENCES public.business_branches(id);
-- ALTER TABLE public.appointments ADD COLUMN branch_id UUID REFERENCES public.business_branches(id);
```

## 5. Super Admin Visibility

The platform infrastructure correctly isolates tenants but now has the schema headroom to iterate `branchId` rollups across financial reporting and analytics, separating regional performances for top-tier merchants.
