# Subscription QA Checklist

## Admin Panel (Billing Tab)
- [ ] **Mock Active Subscription Test**: Verify the "Active" status renders a green badge and shows the current plan correctly.
- [ ] **Trial Status Test**: Selecting "Trial" in the mock control renders a trial badge.
- [ ] **Past Due Warning Test**: Selecting "Past Due" triggers a warning block but allows the rest of the application (admin) to function.
- [ ] **Plan Limit Test**: Ensure that limits on Staff and Services throw a block error message in the respective tabs when trying to add beyond allowed plan limits. Ensure a comment exists reminding that final enforcement is server-side.
- [ ] **Mock Checkout Test**: Clicking "Bu Plana Geç" for a higher tiered plan triggers the checkout mock (alert or log).
- [ ] **Mock Billing Portal Test**: Clicking "Fatura / Ödeme Yönetimi" triggers the portal mock.

## Public Booking Component
- [ ] **Suspended Booking Lock Test**: Set status to "Suspended" in Dev Mode. Go to the booking preview/page. A block message "Bu salonun online randevu sistemi geçici olarak kullanılamıyor..." should render instead of step 0 (staff selection). No customer should be able to book.

## Backend / Config
- [ ] **Env Variable Test**: `VITE_PAYMENT_PROVIDER=mock`, ensure no provider secret exists in `.env.example`.
- [ ] **Supabase Schema Alignment Test**: Check the `002_subscription_alignment.sql` migration to ensure `subscriptions` has `provider_reference` and `payments` has `subscription_id`, connecting the models properly for future Webhook integration.
