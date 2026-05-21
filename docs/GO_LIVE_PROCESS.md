# Go-Live Process

## When a Tenant Can Go Live
Before a tenant can accept public bookings, it must meet several criteria evaluated by `goLiveService.getGoLiveReadiness`. 

Requirements:
- Subscription status must be `active` or `trial`.
- `provisioning_status` must be advanced beyond `onboarding_required`.
- At least 1 active staff member exists.
- At least 1 active service exists.
- Core branding and business info is set.

## Manual Setup Support Process
In cases where customers need configuration assistance (Setup Fee covered this), support agents or super-admins can access the tenant's view or a centralized dashboard to fill in remaining services, pricing, and settings. They can use the "Internal Notes" section to coordinate.

## Public Booking Gate Behavior
If `canTenantAcceptBookings` returns false, customers visiting the `/` endpoint will see a clean unavailability screen instead of the booking form.
Possible reasons shown to users:
- "Bu salon geçici olarak randevu kabul etmiyor."
- "Salon kurulumu devam ediyor."
- "Online randevu sistemi henüz aktif değil."

Sensitive billing details are never exposed.

## Production Security Note
The frontend UI enforces go-live mock steps, but **final go-live approval must happen server-side**. In Supabase mode, updating `go_live_status` or accepting DB writes to public endpoints MUST be secured by RLS policies or Edge Functions enforcing these state checks.
