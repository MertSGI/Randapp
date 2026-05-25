# Privacy and Customer Data Notes

## Core Philosophy
We apply the Principle of Data Minimization. Collect only what is needed, use it only for stated operational purposes, and protect it at the tenant level.

## Handling of Customer Profiles
- **No Password Silos:** We don't force end-users to create accounts with passwords. Customer-side persistence is currently local storage only (Customer Account Lite). We strictly maintain Guest Booking fallback capabilities.
- **Owner Visibility (Customer Profile Lite):** Salon owners see aggregated customer memory (appointments, internal notes, preferences) exclusively to improve service logic.

## Handling of Reference Photos
- **No Biometrics, No AI Processing:** Uploaded images are strictly static references for haircuts, nails, and color history. We actively forbid processing customer photos for algorithmic facial recognition or biometrics.
- **No Public Sharing:** Images should never be shared via public or unauthenticated links.
- **Next Phase RLS:** Supabase storage must be configured with Row Level Security (RLS) policies allowing access ONLY if `auth.uid()` belongs to the `tenant_id` that owns the customer record. Public read access must be explicitly rejected.

## Consent & KVKK/GDPR
- Checkboxes in UI for data processing cover standard operations.
- Marketing consent is separated from operational appointment messages.
- Production phases mandate explicit data retention rules and clear "Delete Customer Record" utilities to easily wipe notes, photos, and anonymize history when requested by a consumer.
