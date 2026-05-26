# Plan Management Model

## Overview
Randapp pricing and subscription plans are centrally managed by the Super Admin, moving away from fully hardcoded client-side limits. Plans have dynamic pricing, limits, and feature toggles, along with rules for Monthly and Annual billing periods.

## Data Structures

**Plans**
- `planId`: string (e.g., starter, professional, premium)
- `name`: string
- `monthlyPrice`: number
- `annualPrice`: number
- `annualDiscountPercent`: number
- `setupFee`: number
- `currency`: string
- `maxStaff`: number
- `maxServices`: number
- `maxMonthlyAppointments`: number
- `customDomainEnabled`: boolean
- `includedSubdomain`: boolean
- `customComDomainIncluded`: boolean
- `aiRecommendationsEnabled`: boolean
- `reportsEnabled`: boolean
- `campaignsEnabled`: boolean
- `whatsappAutomationEnabled`: boolean
- `googleCalendarEnabled`: boolean
- `supportLevel`: string (e.g., 'standard', 'priority')
- `referralEligible`: boolean

## Super Admin Flow
Super Admins can:
- Modify `monthlyPrice` and `annualPrice` variables.
- Toggle feature flags or increase limits on specific plans.
- Control whether custom `.com` domains are bundled for free in the Annual plans.

## Billing Periods
Users on the `PricingPage` and `BillingTab` can toggle between Monthly and Annual payments.
Annual payments apply the `annualDiscountPercent` and often unlock extra features (like a custom `.com` domain).

## AI and Storage Edge Rules (Phase 4 Updates)
- AI features (`aiRecommendationsEnabled`, `aiVisualizationEnabled`) are checked entirely server-side in Edge Functions before invoking external APIs.
- Media buckets (`tenant-public-media`, `customer-private-reference-photos`) map to strict RLS policies, bypassing generic mock constraints.
