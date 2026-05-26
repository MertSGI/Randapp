# Randapp Full System QA Checklist

## Marketing Visitor (Platform Domain / Preview Root)
- [x] **`/#/` (Homepage)**: Loads `MarketingHomePage`, shows "Kendi Salonumu Önizle" CTAs, clear product promise (Website + Booking + AI).
- [x] **`/#/features`**: Loads `FeaturesPage`, explains features logically.
- [x] **`/#/pricing`**: Loads `PricingPage`, correct prices and plans, CTAs go to Demo or WhatsApp. No real payment gateways mock-fire accidentally.
- [x] **`/#/contact`**: Loads `ContactPage`, forms redirect to WhatsApp with proper lead data (Salon Adı, İl/İlçe, Telefon).
- [x] **`/#/demo`**: Loads `DemoLandingPage` (Onboarding/Sales entry point).
- [x] **Mobile Nav**: Hamburger menu works and closes on selection.
- [x] **SEO & Metadata**: `index.html` contains Title, Meta Description, OG Title/Desc, Twitter Card, and clearly frames target market (Kuaför, Güzellik Salonuvb.).

## Salon Customer (Tenant Domain / `/book`)
- [x] **Website First, Booking Second**: Visitors land on a highly polished, mobile-first website view mirroring the interactive Demo preview exactingly. The stepper is completely hidden until a booking CTA is tapped.
- [x] **Upload & Media Rendering**: Multi-cover image carousels and gallery popups are fully functional and respect files natively uploaded from device UI.
- [x] **Booking Lock Before Live**: If the tenant's `setupStatus` is not `live`, visiting `/#/book` without preview permissions shows a locked "Hizmet Geçici Olarak Kapalı" screen.
- [x] **Booking Flow Unlocked After Approval**: Once Super Admin approves, customers can access the full Booking Flow.
- [x] **Security / Preview Lock**: `?preview=true` works ONLY if the user is `super_admin` OR `salon_owner` of the matching `tenantId`. Anonymous users remain blocked.
- [x] **Maps Redirection**: "Yol Tarifi Al" and "Haritada Aç" generate correct Google Maps search URLs.
- [x] **Contact Actions**: WhatsApp routing is functional for sending appointment confirmations and manual contact.
- [x] **Multilingual Bookings (I18N)**: Booking widget and Customer Website accurately swap labels between Turkish and English globally, saving preferences per browser.
- [x] **Customers View Own Appointments**: Customers can log in using their matching phone/email locally.
- [x] **Customer Portal Cancellation**: Customers can cancel an appointment if within the policy window.
- [x] **Privacy Check**: Salon Notes are NOT visible anywhere in the Customer Portal.
- [x] **Customer Account Lite (Autofill)**: Customers can choose to bind their Name, Email, and Phone locally per tenant. Bypasses forced DB auth, providing pure frictionless autofill.

## Salon Owner / Tenant Admin (`/admin`)
- [x] **Login Mechanics**: `admin@randapp.com` can log in and is securely routed to their tenant dashboard.
- [x] **Sidebar/Navigation**: Features simple, clean left nav "Yönetim Paneli".
- [x] **Onboarding Wizard**: 
    - Saves properly step-by-step.
    - Quick additions (Service/Staff) function and update lists.
    - Step 8 explicitly checks required rules (`isInfoCompleted && isProfileCompleted && isBrandingCompleted && isServicesCompleted && isStaffCompleted`). 
    - Sets state to `ready_for_review` strictly. Never auto-lives the tenant.
- [x] **Business Website Profile**:
    - Toggle `is_public_profile_enabled` works.
    - Info updating and map link testing acts predictably.
    - "Site Önizlemesini Aç" generates a `/#/book?preview=true` link.
- [x] **Other Tabs**: Viewing appointments, reports, services, staff, and mock subscriptions are fully contained.
- [x] **Customer Memory**: The "Müşteriler" / "Customers" tab exists. Entering a matching email/phone during booking automatically ties the appointment to the simulated customer record. Owners can store notes and style-preference reference photos. KVKK disclaimers are present.

## Super Admin (`/super-admin`)
- [x] **Login Mechanics**: `superadmin@randapp.com` can log in and see high-level overview.
- [x] **Go-Live Approval**: Modifies status to `live`. Confirmed by window message.
- [x] **Mock Subscription Toggle**: Super Admins can manually force a mock subscription toggle (Active / Past Due) for demo purposes, with clear warning that this is a mock developer utility.
- [x] **Send-Back Flow**: "Send Back" correctly prompts for an optional note (using `window.prompt`) and sets state to `needs_changes` or `setup_in_progress` logically via backend mock service.
- [x] **Tenant Management**: Actions are appropriately contained, unbuilt advanced actions trigger a "Sonraki fazda eklenecek" placeholder.
- [x] **Payments & Diagnostics Test**: `SuperAdminPaymentTestPage` runs simulated sandbox responses successfully.

## State/Flow Integrity
- [x] Clean state machine: `setup_in_progress` → `ready_for_review` → (`live` XOR `needs_changes`).
- [x] Reusability of states across `TenantContext`, `goLiveService`, and local components.
- [x] `VITE_DATA_MODE=mock` robustly handles refresh/persistence across the SPA. 
- [x] **Demo Operations**: `demoSeeder.ts` is explicitly gated and ONLY functional in mock data mode to prevent destructive execution in production environments.

---
**Status**: All core routing boundaries, role constraints, and presentation polish passes are completed. The platform is ready for Edge Function integration for genuine iyzico/Supabase endpoints.
