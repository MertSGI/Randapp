# LARİ - Paymentless Production Go/No-Go Report

This report evaluates the current readiness of the LARİ application for deployment under the **paymentless_limited_production** (Ödemesiz Kısıtlı Canlı Üretim) launch mode. It outlines the executive decision, reviewed evidence, exact verification criteria, rollback guidelines, and next steps for the operator.

---

## 🚦 1. Executive Decision: NO-GO (Pending Physical Staging Execution)

While the codebase, database schema, RLS policies, and priority-1 repositories are **100% statically verified, compiled, and ready**, the official decision for live production deployment is a strict **NO-GO** until a real, physical Supabase Staging project is provisioned, successfully smoke-tested, and officially documented in the `docs/SUPABASE_STAGING_EXECUTION_RESULT_LOG.md`.

* **Codebase Status**: **READY** (Static QA checks pass; compilation and linting are 100% green; role naming is canonicalized to `tenant_owner`; users_profile mappings are aligned).
* **Environment Status**: **BLOCKED** (A real cloud-hosted staging project has not been linked or tested yet. The remote smoke test correctly reported `BLOCKED` due to missing credentials).

**This gate is non-negotiable.** Physical staging execution must be performed by the operator to guarantee live database and RLS safety.

---

## 📂 2. Evidence Reviewed

The following repository assets, static QA scripts, and templates have been inspected and validated:

1. **Staging Execution Framework**:
   - `docs/REAL_SUPABASE_STAGING_EXECUTION_OPERATOR_GUIDE.md` (Operational setup, links, and command sequences)
   - `docs/SUPABASE_STAGING_EXECUTION_RESULT_LOG.md` (Empty verification template)
   - `docs/SUPABASE_STAGING_BROWSER_SMOKE_CHECKLIST.md` (Browser manual flow validations)
   - `docs/SUPABASE_STAGING_COMMAND_SHEET.md` (Command line reference guides)
2. **Local Preflight QA Suites**:
   - `npm run qa:supabase-staging-env` (**PASSED** - verified configuration structure)
   - `npm run qa:supabase-migration-integrity` (**PASSED** - verified SQL syntax and chronological migrations)
   - `npm run qa:supabase-active-migration-path` (**PASSED** - verified alphabetical sequence)
   - `npm run qa:supabase-auth-rls-bootstrap` (**PASSED** - verified no legacy `salon_owner` exists; `tenant_owner` is canonical)
   - `npm run qa:real-supabase-staging-execution` (**PASSED** - verified guide, checklists, and result log existence)
3. **Database Migrations and Tests**:
   - `supabase/migrations/001_initial_schema.sql` (Canonical `tenant_owner` roles)
   - `supabase/migrations/20260622_paymentless_production_rls_identity_alignment.sql` (Strict RLS safety bounds)
   - `supabase/tests/paymentless_production_rls_smoke.sql` (Multi-tenant isolation unit tests)
   - `supabase/seed/paymentless_staging_seed.sql` (Fictional mock data sequence)
4. **Programmatic Smoke Testing**:
   - `scripts/smoke-supabase-paymentless-staging.mjs` (Hardened with `--env-only`, `--read-only`, and `--write-staging-fixtures` modes)

---

## 📊 3. Pass/Fail & Readiness Table

| Verification Gate | Required / Optional | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Static Code Compilation** | Required | **PASS** | `npm run build` succeeds cleanly. |
| **Linter Assertions** | Required | **PASS** | No compilation or lint errors. |
| **Canonical Role Migration** | Required | **PASS** | All instances of legacy `salon_owner` role replaced by `tenant_owner`. |
| **Priority 1 Repositories** | Required | **PASS** | Verified via static preflight suite. |
| **SQL Schema Syntax** | Required | **PASS** | Migrations check completes successfully. |
| **Staging Config Guide** | Required | **PASS** | Operator guide, Result Log, and checklists are created. |
| **Physical Staging Project** | Required | **PENDING** | Must be created in the Supabase console. |
| **Physical Staging Run Log** | Required | **FAIL/INCOMPLETE** | Result log is currently empty; requires operator execution. |
| **No localStorage for Live** | Required | **PASS** | System utilizes real Supabase Postgres for live-critical data. |
| **Disabled Online Payment** | Required | **PASS** | Online payments are fully disabled; no iyzico credentials required. |
| **Zero Client Secret Leakage** | Required | **PASS** | Service role key is kept strictly out of frontend bundles. |

---

## 🛑 4. Blockers & Required Fixes Before Launch

### Blockers:
1. **Physical Database Validation**: A real physical Supabase project has not been provisioned. The command-line smoke runner returned a `BLOCKED` status because `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not configured in the developer environment.
2. **Incomplete Staging Execution Result Log**: The operator must fill out the results in `SUPABASE_STAGING_EXECUTION_RESULT_LOG.md` with clear `PASS` markings before launching production.

### Required Actions Before Launch:
1. Provision a real staging database in the Supabase console.
2. Apply the canonical migrations alphabetically using `npx supabase db push`.
3. Link the test user UUIDs using SQL Editor scripts.
4. Execute the staging smoke test command:
   ```bash
   npm run smoke:supabase-paymentless-staging -- --write-staging-fixtures
   ```
5. Complete manual browser checks via `docs/SUPABASE_STAGING_BROWSER_SMOKE_CHECKLIST.md`.

---

## ⚠️ 5. Warnings & Scope Boundaries

### Warnings:
- **No Client-Side Secrets**: Never add `SUPABASE_SERVICE_ROLE_KEY` or other private keys with a `VITE_` prefix.
- **Strict Brand Integrity**: The visible brand remains **LARİ** globally. No custom-branded prefixes, slogans, or creative renaming are permitted.
- **Canonical Domain**: All tenant slugs and public routes must resolve under the `randevulari.com` Turkey domain strategy.

### Allowed Launch Scope (Once Staging is Passed):
- **Core Appointments**: Anonymous bookings persist in the Postgres database.
- **Setup Onboarding Wizard**: Fully functional local wizard for catalog, staff, working hours, and shop settings.
- **Tenant Owner Panel**: Read/write capabilities for services, staff, appointments, and general details.
- **Manual Billing**: Subscription tab displays active plans and manual activation guidelines without card input.
- **Self-Service Customer Token**: Anonymous cancellation and reschedule requests are persistent and auditable.

### Must-Not-Claim List:
- Do **not** claim or display "automatic online payments", "iyzico checkout", or "automatic subscriptions".
- Do **not** offer a "7-day trial" or use "no-card required" marketing copy, as there are no card capture requirements in the current launch scope.
- Do **not** display mock telemetry, logging scripts, or network status lines (anti-slop constraints).

---

## 🔄 6. Rollback Plan

If a major bug, schema conflict, or RLS data leakage occurs after going live:
1. **Immediate Redeployment**: Revert the hosting server to the previous stable release commit.
2. **Database Schema Recovery**:
   - If a table or index corruption occurs, restore the database using the latest night snapshot.
   - For individual tenant recovery, run the cascade script to wipe and restore only the affected tenant namespace:
     ```sql
     BEGIN;
     DELETE FROM public.appointments WHERE tenant_id = 'xxxx-yyyy';
     DELETE FROM public.customers WHERE tenant_id = 'xxxx-yyyy';
     COMMIT;
     ```
3. **Emergency Read-Only Lock**: If an RLS violation is detected, immediately disable anonymous public insertions in the staging/production SQL editor by disabling the target policy.

---

## 🏁 7. Pilot Tenant Onboarding Constraints (First 3 Tenants)

To minimize operational risk during the initial rollout:
1. **Manual Profile Registration**: The operator must manually insert the `users_profile` record for the tenant owner after they register on the site.
2. **Step-by-Step Setup Validation**: An operator must sit with the first three tenant owners to verify that their service catalogs, staff hours, and public booking slugs load without layout bugs.
3. **Simulated Outbox Verification**: Operators must manually check the database `communication_outbox` after each appointment creation to ensure that SMS and email templates are generating correctly before moving to live messaging services.

---

## 📈 8. Post-Launch Monitoring Checklist

Keep track of system performance and integrity daily:
- [ ] Monitor the `audit_events` table for unauthorized cross-tenant operations.
- [ ] Verify that the daily backup cron runs successfully on the Supabase dashboard.
- [ ] Check `communication_outbox` rows marked as `pending` to ensure the background job scheduler remains healthy.
- [ ] Conduct weekly checks for duplicate or orphaned user records in `users_profile`.
