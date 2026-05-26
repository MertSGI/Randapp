# Edge Function Contracts

The following documents the planned Supabase Edge Functions for Randapp production. 
All functions are isolated and securely hold secrets like `GEMINI_API_KEY` and `IYZICO_API_KEY`.

## 1. create-checkout-session
* **Path**: `/functions/v1/create-checkout-session`
* **Input Payload**: `tenantId`, `planId`, `billingCycle`, `successUrl`, `cancelUrl`
* **Output Payload**: `{ checkoutUrl: string }` or `{ mode: 'sandbox_not_configured', message: string }`
* **Auth Requirement**: Authenticated Salon Admin
* **Secrets Required**: `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
* **Side Effects**: Reads server-side plan configs (price, trialEnabled, trialDays). Creates an Iyzico subscription checkout request in sandbox/production. Logs to `audit_logs`.
* **Mock Fallback**: Directly simulates a success redirect or local mock status update.
* **Important Guidelines**: 
  - Price must be validated from server-side database, not frontend payload.
  - In a real iyzico subscription flow, trial plans should be configured with `trialPeriodDays` dynamically based on plan definitions.
  - In the trial flow, card validation/card collection behavior is entirely payment-provider controlled.
  - Randapp frontend NEVER signs iyzico requests directly or stores checkout keys.

## 2. payment-webhook
* **Path**: `/functions/v1/payment-webhook`
* **Input Payload**: Iyzico generic event payload.
* **Output Payload**: HTTP 200
* **Auth Requirement**: Iyzico Signature Verification
* **Secrets Required**: `IYZICO_SECRET_KEY`
* **Side Effects**: Inserts into `payments`, safely updates `subscriptions` status natively (idempotent), logs to `audit_logs`. Must handle retries idempotently.

## 3. subscription-sync
* **Path**: `/functions/v1/subscription-sync`
* **Input Payload**: `tenantId` (optional for bulk job)
* **Output Payload**: `{ status: "synced" }`
* **Auth Requirement**: System cron/cron expression or internal verified fetch.
* **Side Effects**: Polls Iyzico API to reconcile out-of-sync subscriptions and past-due statuses.

## 4. ai-recommendation
* **Path**: `/functions/v1/ai-recommendation`
* **Input Payload**: `tenantId`, `prompt`, `imageBase64` (Optional)
* **Output Payload**: `{ text: "..." }`
* **Auth Requirement**: Valid tenant constraints, validated `aiMonthlyQuota`.
* **Secrets Required**: `GEMINI_API_KEY`
* **Side Effects**: Triggers `ai_usage` increment, logs to `audit_logs`.
* **Mock Fallback**: Safe mock string if no API key is set.

## 4. ai-visualization
* **Path**: `/functions/v1/ai-visualization`
* **Input Payload**: `tenantId`, `prompt`, `imageBase64`
* **Output Payload**: `{ image: "..." }`
* **Auth Requirement**: Valid tenant constraints, validated `aiVisualizationEnabled`.
* **Secrets Required**: `GEMINI_API_KEY` (or AI Provider Key)
* **Side Effects**: Triggers `ai_usage` increment, logs to `audit_logs`.

## 5. cancel-appointment
* **Path**: `/functions/v1/cancel-appointment`
* **Input Payload**: `appointmentId`, `cancelReason`
* **Auth Requirement**: Valid customer session or valid salon admin token.
* **Side Effects**: Updates `appointments` status, verifies cancellation window rules.

## 6. customer-portal-auth
* **Path**: `/functions/v1/customer-portal-auth`
* **Input Payload**: `phone` or `email`, OTP
* **Side Effects**: Mints a session JWT for customer profile access mapping to Supabase Auth.
