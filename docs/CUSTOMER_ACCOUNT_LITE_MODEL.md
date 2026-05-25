# Customer Account Lite Model

## Overview
Randapp implements a "Lite" customer account model. Our goal is to streamline the booking experience by offering autofill capabilities without forcing users into a heavy, password-based registration flow.

## How it works (Mock Mode)
- During step 4 of the booking flow (User Details), customers can check "Save my details on this device".
- Their Name, Email, and Phone are committed to `localStorage` under a tenant-specific key (`randapp_customer_profile_<tenantId>`).
- On their next visit to the same tenant's booking page, the details are automatically fetched from `localStorage` and prefilled in the form.
- The `SalonWebsiteView` displays a small "chip" showing the user is recognized.
- Users can clear their profile from the booking form.
- In `mock` mode, backend persistence for a global customer account is simulated by local storage.

## Future Supabase Integration (Live Mode)
- During Go-Live, the `customerService` will sync this profile information to a `customers` table in Supabase.
- A light verification (via SMS OTP or Magic Link Email) later may grant them access to a full "Customer Dashboard" to view past and upcoming appointments, but for Phase 1/Pilot, the local storage approach serves the immediate autofill need.

## Security Considerations
- We never store passwords.
- PII (Name, Email, Phone) are only stored locally attached to the unique Tenant scope.
- `autocomplete` attributes on input tags instruct the browser to use its native autofill vault as well.
