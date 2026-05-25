# Customer Account Lite & Customer Profile Lite Model

## Philosophy
Randapp supports a "Customer Account Lite" and "Customer Profile Lite" model designed to be zero-friction for both customers and salon owners.

1. **Customer Account Lite (Customer Side)**
   - No password required.
   - Saves basic details (Name, Phone, Email) to local storage.
   - Speeds up future bookings on the same device.
   - Guest booking remains fully functional and intact.

2. **Customer Memory / Customer Profile Lite (Salon Owner Side)**
   - Displayed in Admin Dashboard -> "Customers" tab.
   - Aggregates appointments automatically by matching `email` or `phone`.
   - Allows salon owners to record:
     - Internal notes (e.g. "Does not like short layers")
     - Style preferences (e.g. Color formula: 7.1 + 8.12)
     - Reference photos.
   - Built to answer the real-world operational question: *"What did this customer want last time?"*

## Privacy and Data Minimization (KVKK / GDPR / CCPA)
- Only collect data strictly necessary for appointment operations and service continuity.
- Reference photos are **strictly for service history**. They are not processed for facial recognition, biometric identification, or automatic AI profiling.
- Explicit visual notices remind owners that photos are internal use only.
- Customers booking online see KVKK / Privacy policy notices indicating data is used purely for communication and service context.

## Mock / MVP Implementation
Currently, customer data on the admin side is aggregated in runtime from the mock `Appointment` array and maintained natively in `localStorage` under keys `mock_tenant_customers_{tenantId}`.

## Production / Next Phase Architecture (Supabase)
When moving to a real database (Supabase), the schema will look like: 
- `customers` (id, tenant_id, full_name, phone, email, style_preference, etc.)
- `customer_notes` (id, customer_id, text, created_by, created_at)
- `customer_photos` (id, customer_id, storage_url, created_at)
- Storage bucket: `tenant-private-files`, restricted by RLS to only `salon_owner` of that `tenant_id`.
