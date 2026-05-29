# Randapp Automated QA Screenshots

This folder contains automatically captured screenshots of the Randapp application for QA purposes.

## How to Capture
Run from the project root:
```bash
npm run qa:screenshots
```
*(Ensure the local dev server is running on localhost:3000 or configure QA_BASE_URL)*

## Outputs
- `mobile/` - Contains 390x844 viewports
- `desktop/` - Contains 1440x1000 viewports
- `QA_SCREENSHOT_REPORT.html` - Visual review dashboard

## Priority Review Order
1. Homepage (`/`)
2. Pricing (`/pricing`)
3. Booking Flow (`/book`)
4. Booking Success (if generated)
5. Admin Mobile (`/admin`)
6. Admin Settings
7. Super Admin Mobile (`/super-admin`)
8. Payment Diagnostics (`/super-admin/payment-test`)

## Known Limitations
- Modals that require interaction to open are not captured automatically in this pass.
- Timeouts might occasionally cut off images loading if network is slow. Re-run if a screenshot looks empty.