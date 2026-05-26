# Edge Function Contracts

The following documents the planned Supabase Edge Functions for Randapp production. 
All functions are isolated and securely hold secrets like `GEMINI_API_KEY` and `IYZICO_API_KEY`.

## 1. checkout-session
* **Path**: `/functions/v1/create-checkout-session`
* **Input Payload**: `tenantId`, `planId`, `successUrl`, `cancelUrl`
* **Output Payload**: `checkoutUrl`, `sessionId`
* **Auth Requirement**: Authenticated Salon Admin
* **Secrets Required**: `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`
* **Side Effects**: Creates a session in provider, logs to `audit_logs`.
* **Mock Fallback**: Directly simulates a success redirect.

## 2. payment-webhook
* **Path**: `/functions/v1/payment-webhook`
* **Input Payload**: Iyzico payload.
* **Output Payload**: HTTP 200
* **Auth Requirement**: Iyzico Signature Verification
* **Secrets Required**: `IYZICO_SECRET_KEY`
* **Side Effects**: Inserts into `payments`, updates `subscriptions` status, logs to `audit_logs`.

## 3. ai-recommendation
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
