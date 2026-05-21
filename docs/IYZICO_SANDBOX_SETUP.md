# iyzico Sandbox Setup & Edge Function Testing

This guide details how to configure the iyzico sandbox environment and test the subscription flow safely via Supabase Edge Functions without exposing secrets to the frontend.

## 1. Required Supabase Edge Function Secrets
The frontend must never contain payment provider secret keys. All of these credentials must be added to your Supabase project as Edge Function secrets (via Supabase Dashboard -> Settings -> Edge Functions -> Secrets, or via `supabase secrets set ...` CLI).

- `IYZICO_API_KEY`: Your iyzico Sandbox API Key
- `IYZICO_SECRET_KEY`: Your iyzico Sandbox Secret Key
- `IYZICO_BASE_URL`: `https://sandbox-api.iyzipay.com`
- `SUPABASE_URL`: Your Supabase project URL (needed for Service Role access)
- `SUPABASE_SERVICE_ROLE_KEY`: Admin key for database writes (updating subscriptions securely after webhooks)

Additionally, plan references must be mapped to iyzico payment plan Reference Codes via secrets:
- `IYZICO_PLAN_STARTER_REF`
- `IYZICO_PLAN_PROFESSIONAL_REF`
- `IYZICO_PLAN_PREMIUM_REF`

## 2. iyzico Sandbox Merchant Setup
1. Log in to [iyzico Sandbox Panel](https://sandbox-merchant.iyzipay.com/).
2. Apply for or activate the Sandbox Merchant Account.
3. Activate the Subscription API (Abonelik API) from your panel and get API Keys.
4. **Create Products & Pricing Plans:** Create your Subscription Products (Starter, Professional, Premium) in the Subscription tab.
5. Set prices in TRY.
6. Copy the `PricingPlanReferenceCode` generated for each plan. Add these to your Edge Function secrets (as mentioned above).

## 3. Deploying Edge Functions
Use the Supabase CLI to deploy:
```bash
supabase functions deploy create-checkout-session
supabase functions deploy create-billing-portal-session
supabase functions deploy payment-webhook
```

## 4. Webhook Configuration
In the iyzico Sandbox Panel, configure your **Subscription Webhook URL** to point to your deployed Edge Function:
`https://YOUR_PROJECT_REF.supabase.co/functions/v1/payment-webhook`

Ensure webhook events are enabled.

## 5. Local App Configuration
Ensure your `.env` contains:
```env
VITE_DATA_MODE=supabase
VITE_PAYMENT_PROVIDER=iyzico
```

## 6. Testing the Flow
1. Run the app locally.
2. Go to the **Admin > Abonelik (Billing)** tab.
3. Click "Bu Plana Geç" / Upgrade for a plan.
4. Verify the `create-checkout-session` Edge Function returns a valid, sandbox-linked Checkout URL.
5. In the mock/sandbox checkout window, enter test card details provided by iyzico.
6. Submit the payment.
7. Verify that iyzico posts a Webhook event to `payment-webhook`.
8. Verify that `payment-webhook` correctly parses the payload, validates the signature, and updates the `subscriptions` and `payments` tables via the Service Role key.
9. Verify that a successful subscription triggers the tenant onboarding/provisioning state transition.
