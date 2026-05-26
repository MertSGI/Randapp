# Privacy and Customer Data Safeguards

## Customer Memory & Profile Lite
- **Private by Default:** All salon notes, preferences, and reference photos are strictly private to the salon owner/admin roles.
- **Customer Portal Barrier:** The new Customer Portal Lite explicitly prevents a user from fetching private internal salon notes.
- **Reference Photos:** Uploaded reference photos are strictly for service continuity and manual style reference. 

## No Deep AI Photo Analysis
- Photos are currently NOT sent to the Gemini API.
- Customer faces are NOT subjected to biometric identification or facial recognition routines. 
- Privacy copy explicitly states: "These images are stored only for salon service history... They are not used for facial recognition..."

## Marketing Consent vs. Operational Data
- Randapp collects email/phone essentially for operational contact (appointment scheduling, cancellation, reminders).
- Strict separation is maintained between this and future marketing/campaign consent scopes.

## Future Production Action Items
- **RLS:** Supabase Row Level Security must isolate `customers`, `notes`, and `photos` strictly by `tenant_id`. 
- **Private Buckets:** Photo storage buckets MUST NOT be public. Signed URLs or authorized fetches must be used via backend/Edge Functions.
- **Data Export & Deletion:** The system must implement compliant endpoints handling GDPR/KVKK requests to delete or export a customer's entire dataset.
- **Audit Logs:** Customer or Salon cancellations must be logged with actor scopes and timestamps.
