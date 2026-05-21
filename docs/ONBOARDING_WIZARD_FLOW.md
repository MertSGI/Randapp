# Onboarding Wizard Flow

The onboarding wizard guides salon owners through setting up their salon on the platform. It is located in the Admin Panel (`/admin`) and acts as a central hub before the salon goes "live" to accept bookings.

## Steps

1. **Salon Information**: Collect basic details.
   - **Required**: Business Name, WhatsApp Number.
   - *Optional*: Instagram Handle, Address.
2. **Branding & Design**: Customize the look and feel.
   - **Required**: Primary Color (defaults to black).
   - *Optional*: Logo URL, Footer Text.
3. **Services**: Setting up the services offered.
   - The wizard prompts the user to add *at least one active service*. It displays currently added services and directs the user to the `Services` tab for management.
4. **Staff / Specialists**: Setting up the team.
   - The wizard prompts the user to add *at least one active staff member*. Displays currently added staff and directs the user to the `Staff` tab for management.
5. **Business Hours**: Operational hours.
   - Currently, standard hours (09:00 - 18:00) are automatically applied as a placeholder. Detailed configuration will come in a later phase.
6. **Test Appointment**: Verification.
   - The owner is encouraged to generate a test appointment on their own booking page to verify settings. The booking page link is provided.
7. **Go-Live Readiness**: Final review and submission.
   - Validates that Steps 1, 3, and 4 are complete.
   - If complete, the owner can "Mark as Ready for Review".
   - The Super Admin will then review and officially approve the tenant to go live.

## State Management
- Step completion is derived dynamically from tenant data, service arrays, and staff arrays.
- Validation checks are enforced before allowing progression or clicking "Ready for Review".
- If the tenant is missing required data, `readiness.blockingReasons` are displayed in Step 7.
