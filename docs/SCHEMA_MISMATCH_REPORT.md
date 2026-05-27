# Schema vs. Service Mismatch Report

## Overview
This document outlines discrepancies identified between the frontend TypeScript models/services and the initial Supabase SQL schema migrations (`001_initial_schema.sql` and onwards).

Since the platform currently runs completely in Mock / Presentation mode for Phase 10 execution readiness, these discrepancies do not block frontend demos or preview generation. However, before the official Supabase go-live, these schema additions are required.

## Phase 11 Audit Findings

### 1. `appointments` Table Mismatch
**Frontend Expectation (`types.ts` & `appointmentService.ts`):** 
The frontend expects robust cancellation fields to handle the Customer Portal cancellation flow.
```typescript
  status: 'confirmed' | 'cancelled' | 'cancelled_by_customer' | 'cancelled_by_salon' | 'completed' | 'no_show';
  cancelReason?: string;
  cancelledAt?: string;
  cancelledBy?: 'customer' | 'salon' | 'system';
```

**Database Reality (`001_initial_schema.sql`):**
The `appointments` table is missing these explicitly mapped cancellation fields.
```sql
CREATE TABLE public.appointments (
    ...
    status VARCHAR(50) DEFAULT 'pending',
    -- MISSING: cancel_reason
    -- MISSING: cancelled_at
    -- MISSING: cancelled_by
    ...
);
```

### 2. `customers` Table Mismatch
**Frontend Expectation (`types.ts` & `adminCustomerService.ts`):**
The `CustomerProfile` model defines several "Lite CRM" string fields:
```typescript
  preferredLanguage?: 'tr' | 'en';
  firstVisitAt?: string;
  totalAppointments?: number;
  stylePreference?: string;
  colorFormula?: string;
  avoidNotes?: string;
  careNotes?: string;
```

**Database Reality (`001_initial_schema.sql`):**
The `customers` table is completely flat and only contains basic fields (`name`, `email`, `phone`).
**Fix:** The frontend CRM module should serialize these advanced preferences into a JSONB `metadata` column or create a specific `customer_preferences` table if keeping it strictly relational.

### 3. Missing Referral Tables
**Frontend Expectation:**
The `referralService.ts` introduces:
- `ReferralCampaign`
- `ReferralCode`
- `ReferralLead`

**Database Reality:**
While `001_initial_schema.sql` includes a generic `campaigns` table, it does not match the strict schema defined in `ReferralCampaign`. The tables for tracking codes and leads are completely missing.

## Recommended Fix Plan (For Phase 12)

Before activating real Supabase data-fetching:

1. **Create `006_appointment_cancellation.sql`**:
   ```sql
   ALTER TABLE public.appointments
   ADD COLUMN IF NOT EXISTS cancel_reason TEXT,
   ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
   ADD COLUMN IF NOT EXISTS cancelled_by VARCHAR(50);
   ```

2. **Create `007_customer_crm_fields.sql`**:
   ```sql
   ALTER TABLE public.customers
   ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
   -- Migrate stylePreference, colorFormula, etc. into JSONB 
   -- OR create explicit columns depending on querying needs.
   ```

3. **Create `008_referral_system.sql`**:
   - Create tables `referral_campaigns`, `referral_codes`, and `referral_leads`.
   - Setup appropriate RLS (Row Level Security) ensuring only the tenant owner can see their campaigns.

The above migrations will fully align the Supabase schema with the established frontend behaviors without regressing any of the mock functional capabilities.
