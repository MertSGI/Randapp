# Payment Webhooks Integration Code

## Edge Function: `payment-webhook`
The Iyzico webhooks push state changes asynchronously to LARİ.
Path: `/supabase/functions/payment-webhook/index.ts`

### Requirements
- **Signature Verification**: Every incoming webhook must be verified.
- **Idempotency**: Webhooks might be delivered more than once. The system must not duplicate provisions or payments. We will check the `PaymentEvent` table to prevent re-processing.
- **Role Isolation**: The function must use `SUPABASE_SERVICE_ROLE_KEY` to update the DB, bypassing RLS security rules safely because it has verified the incoming payload using `IYZICO_SECRET_KEY`.

### Integration Steps
1. Configure the `IYZICO_WEBHOOK_SECRET` in Edge function environments.
2. Deploy the function: `supabase functions deploy payment-webhook`.
3. Provide the URL of your edge function to Iyzico portal callback settings.
