# Privacy and Customer Data Safeguards

## Customer Memory & Profile Lite
- **Private by Default:** All salon notes, preferences, and reference photos are strictly private to the salon owner/admin roles.
- **Customer Portal Barrier:** The new Customer Portal Lite explicitly prevents a user from fetching private internal salon notes.
- **Reference Photos:** Uploaded reference photos are strictly for service continuity and manual style reference. 

## Strict AI Usage Boundaries
- **No Automatic AI Submission:** Customer Memory private notes and reference photos are **NOT** sent to the AI by default.
- **Explicit Processing Only:** Only photos/prompts explicitly submitted via the `/ai-visualizer` flow are sent to the AI backend proxy.
- **Volatile Processing:** Edge Functions process AI imagery directly in memory and delete references. No images are stored by AI providers for training purposes (opted out by default in Cloud).
- **No Deep AI Photo Analysis:** Customer faces are NOT subjected to biometric identification, facial recognition routines, or emotional profiling. Features are strictly limited to hair/eyebrow/style and beauty domain advice.
- **Privacy Copy:** The UI explicitly states: "Your photo is only used for temporary processing to generate recommendations. Please do not upload images containing sensitive personal information."

## Marketing Consent vs. Operational Data
- Randapp collects email/phone essentially for operational contact (appointment scheduling, cancellation, reminders).
- Strict separation is maintained between this and future marketing/campaign consent scopes.

## Future Production Action Items
- **RLS:** Supabase Row Level Security must isolate `customers`, `notes`, and `photos` strictly by `tenant_id`. 
- **Private Buckets:** Photo storage buckets MUST NOT be public. Signed URLs or authorized fetches must be used via backend/Edge Functions.
- **Data Export & Deletion:** The system must implement compliant endpoints handling GDPR/KVKK requests to delete or export a customer's entire dataset.
- **Audit Logs:** Customer or Salon cancellations must be logged with actor scopes and timestamps.
- **Opt-in Logs (Future):** Any future automated use of Customer Memory for AI styling MUST have an explicitly recorded opt-in boolean on the customer's profile row in Postgres.
