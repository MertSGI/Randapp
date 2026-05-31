# Referral System Plan

## Overview
LARİ includes a simple referral program to encourage existing salon owners (tenants) to invite other businesses. 

## Data Model

**ReferralProgramRule**
- `id`: string
- `active`: boolean
- `rewardType`: 'discount' | 'free_month' | 'cash_credit' | 'setup_fee_discount'
- `rewardValue`: number
- `appliesToPlanIds`: string[]
- `requiresReferredTenantPaidSubscription`: boolean
- `minimumSubscriptionMonths`: number
- `maxRewardsPerTenant`: number
- `validFrom`: date
- `validTo`: date
- `createdBy`: string

**Referral**
- `id`: string
- `referrerTenantId`: string
- `referrerOwnerEmail`: string
- `referredBusinessName`: string
- `referredContactName`: string
- `referredPhone`: string
- `referredEmail`: string
- `referredCity`: string
- `status`: 'submitted' | 'contacted' | 'converted' | 'reward_pending' | 'rewarded' | 'rejected'
- `rewardApplied`: boolean
- `notes`: string
- `createdAt`: date
- `updatedAt`: date

## Admin Workflows
**Super Admin**:
- Create/Edit Referral Rules.
- View list of all referrals.
- Update status (e.g., mark as 'contacted' or 'rewarded').
- Manually apply rewards to tenants' billing terms.

**Salon Owner Admin**:
- Use the "Referans Ver / İşletme Öner" button.
- Fill out a simple form proposing another business.
- Track their own referral history and current rewards rules.

## Marketing
- Optional display block on the marketing site: "Başka bir salon öner, avantaj kazan."
