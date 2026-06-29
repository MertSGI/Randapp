# LARI - Supabase Paymentless Production Implementation Matrix

This matrix tracks the data layer readiness of core live flows for the **paymentless_limited_production** launch mode. 

| Flow | Required for paymentless production? | Current local implementation | Current Supabase implementation | RLS ready? | Auth required? | Current status | Blocker? | Required next action |
|---|---|---|---|---|---|---|---|---|
| **Tenant registration** | Yes | `tenantRegistrationService` local state | REST endpoint stub via `tenantRegistrationService` | Primary Key | No (Public signup) | Completed / Staged | No | Verify with live Auth / Tenant table during pre-live staging |
| **Manual tenant provisioning** | Yes | `manualProvisioningService` in-memory logs | Db logs mapping in Supabase table | Yes (Super Admin) | Yes (Super Admin) | Completed | No | Ensure logging points to the `manual_provisioning_logs` table in Supabase |
| **Owner auth / login** | Yes | `authService` mock owner session | Supabase Auth via email/password | Yes | Yes | Ready for credentials | No | Ensure environmentPreflight checks require `supabase` auth mode |
| **Business profile** | Yes | `LocalBusinessProfileRepository` | `SupabaseBusinessProfileRepository` | Yes | Yes (Writes) | Ready | No | centralize connection in `repositoryFactory.ts` |
| **Services / catalog** | Yes | `LocalCatalogRepository` | `SupabaseCatalogRepository` | Yes | Yes (Writes) | Ready | No | Ensure staff assignments filter via `tenant_id` |
| **Staff** | Yes | `LocalCatalogRepository` | `SupabaseCatalogRepository` | Yes | Yes (Writes) | Ready | No | Implement complete staff mapping in Supabase repository |
| **Working hours / availability** | Yes | `LocalCatalogRepository` (availability rules) | REST endpoints stubbed | Yes | Yes (Writes) | Partial Stub | Yes (Core scheduling) | Implement Supabase availability rules storage |
| **Public booking** | Yes | `LocalBookingRepository` | `SupabaseBookingRepository` | Yes (Public inserts) | No (Anonymous / Public guest) | Ready | No | Test anonymous inserts without service role permissions |
| **Appointment self-service token** | Yes | `appointmentSelfServiceService` in-memory | Missing / Offline token checks | No | No (Secure hash-token) | Blocker | Yes | Implement persistent storage for self-service tokens with `tenant_id` scopes |
| **Cancellation / reschedule requests** | Yes | `appointmentSelfServiceService` | Missing / local mock | Yes | Yes (Approval) / No (Request) | Blocker | Yes | Implement appointment change request table and repository in Supabase |
| **Customers** | Yes | `LocalBookingRepository` (listCustomers) | `SupabaseBookingRepository` | Yes | Yes (Writes) | Ready | No | Filter queries by `tenant_id` |
| **Subscriptions / manual billing** | Yes | `subscriptionService` | REST partial implementation | Yes | Yes (Owner reads) | Completed / Partial | No | Ensure subscription fields for offline payment (`paidThroughDate`) persist in Supabase |
| **Communication outbox** | Yes | `communicationEventService` | Missing / stubbed | Yes | Yes | Staged / Warning | No (Outbox only) | Store simulated notification dispatches in Supabase `communication_outbox` |
| **Audit logs** | Yes | `auditLogService` | Missing / local mock | Yes | Yes | Staged / Warning | No | Save critical events to `audit_logs` table in Supabase |
| **Support tickets** | Yes | `supportTicketService` | Missing / local mock | Yes | Yes | Staged / Warning | No | Map support tickets to Supabase table |
| **Legal document versions** | Yes | `legalDocumentService` | local list config | Yes (Public reads) | No (Reads) / Yes (Writes) | Staged | No | Keep as local files; read static documents, store metadata in Supabase if edited |
| **Policy acceptance records** | Yes | `policyAcceptanceService` | local state list | Yes | Yes | Blocker | Yes | Implement persistent table for `policy_acceptances` tracking user consent |
| **Consent ledger** | Yes | `consentLedgerService` | local state list | Yes | Yes | Blocker | Yes | Create `consent_ledger` Supabase table and repository to store digital signatures |
| **Data export** | Yes | `dataExportService` | Reading localStorage/dataProvider | Yes | Yes | Completed / Staged | No | Ensure exporter reads from Supabase repositories when `VITE_DATA_MODE=supabase` |
| **Migration dry-run** | Yes | `migrationDryRunService` | Reading localStorage/dataProvider | Yes | Yes | Completed | No | Verify schema mappings before pushing to live tables |

---

## Technical Feasibility & Next Actions

1. **Self-Service Token Security**: Appointment tokens must have a column `token_hash` and `expires_at` mapped in Supabase with `tenant_id` filters to prevent cross-tenant enumeration.
2. **Cancellation Approvals**: Implement the appointment change request workflow in Supabase to track tenant owner reviews.
3. **Legal Compliance**: Policy acceptance tracking must write to a secure table `policy_acceptances` on every sign-off.
4. **Offline Mode Availability**: Local mode remains fully functional for offline dry-runs and demos (`VITE_DATA_MODE=local`).
