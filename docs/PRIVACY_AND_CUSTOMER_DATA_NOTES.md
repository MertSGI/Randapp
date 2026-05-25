# Privacy and Customer Data Notes

## Core Philosophy
We apply the Principle of Data Minimization. Collect only what is needed, use it only for stated operational purposes, and protect it at the tenant level.

## Handling of Customer Profiles
- **No Password Silos:** We don't force end-users to create accounts with passwords. 
- **Owner Visibility:** Salon owners see aggregated customer memory (appointments, internal notes, preferences) exclusively to improve service.

## Handling of Reference Photos
- **No Biometrics:** Uploaded images are strictly static references for haircuts, nails, and color history.
- **No Public Sharing:** Images should not be shared via links.
- **Next Phase RLS:** Supabase storage must be configured with Row Level Security (RLS) policies allowing access ONLY if `auth.uid()` belongs to the `tenant_id` that owns the customer record.

## Consent & KVKK/GDPR
- Checkboxes in UI for data processing cover standard operations.
- Marketing consent is separated from operational appointment messages.
- Customers have the right to request deletion. Future iterations must include a clear "Delete Customer Record" action that wipes notes, photos, and anonymizes appointment history.
