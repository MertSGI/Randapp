# End-to-End Flow QA

## Playwright Integrations
A script (`scripts/verify-product-flow.mjs`) actively tests the core product workflows end-to-end to ensure that new builds don't break the registration, onboarding, booking, or session architecture.

## Scenarios Covered

**1. Registration Flow (`/#/register`)**
- Fills out registration form entirely.
- Asserts that local mock data logic successfully accepts the registration payload.
- Asserts the transition into the Checkout Handoff modal state.

**2. Routing & Branding Matrix**
- Checks that old branding (`randapp`) and weak wording (`roadmap`, `sandbox`, `demo payment`) DO NOT appear on customer-facing routes:
  - `/#/`
  - `/#/features`
  - `/#/pricing`
  - `/#/register`
  - `/#/book`
- Asserts that all standard text is shown.

**3. Admin Continuity**
- Ensures that when a new tenant registers, `TenantService` resolves the hostname fallback logic strictly to the newly generated `lari_active_tenant_id` to provide immediate "preview" consistency rather than loading a completely unrelated prepopulated test database.

## Execution
Run `npx --yes node scripts/verify-product-flow.mjs`.

## Remaining Gaps
- Currently tests run in browser UI but do not deeply examine Database state when `VITE_DATA_MODE=supabase`. E2E must be combined with unit tests against test DB credentials before production.
