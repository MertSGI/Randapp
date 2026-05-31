# Subscription Lifecycle & Data Model

## Data Models

### 1. `Subscription`
Tracks the tenant's subscription to a software plan. 
*   `status`: 'trialing' | 'active' | 'past_due' | 'cancelled' | 'payment_failed' | 'pending'
*   `provider`: e.g., 'iyzico'
*   `providerSubscriptionReferenceCode`: Identifier from Iyzico.

### 2. `Payment`
Tracks individual billing events.
*   `status`: 'succeeded' | 'pending' | 'failed'
*   `amount` / `currency`: Bill amount.
*   `provider`: 'iyzico'

### 3. `PaymentEvent`
Raw incoming webhooks/responses from the provider. Stored for observability and idempotency.
*   `status`: 'processed' | 'failed'

### 4. `AuditLog`
General auditing for modifications, including webhook operations.

## Lifecycle States
* **Pending**: The customer initiated payment, awaiting webhook confirmation.
* **Trialing**: Free trial period active. Transition to active when trial ends and payment succeeds.
* **Active**: Billed successfully.
* **Past Due**: Payment failed. App functionality may be degraded.
* **Canceled**: Subscription terminated gracefully. Does not renew.

The `payment-webhook` Edge Function is responsible for parsing Iyzico's incoming webhook payload and securely shifting the Subscription status according to Iyzico’s confirmed events.
