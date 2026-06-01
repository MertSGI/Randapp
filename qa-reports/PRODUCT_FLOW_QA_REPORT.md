# Product Flow QA Report

## Summary
- **Forbidden Wording Found:** 27
- **Old Branding (Randapp) Found:** 22
- **Frontend Secrets Exposed:** 0
- **Raw Card Inputs Detected:** 0

## Details

### Forbidden Customer-Facing Wording
- pages/AIVisualizerPage.tsx: "mock"
- pages/PricingPage.tsx: "mock"
- pages/PricingPage.tsx: "sandbox"
- pages/customer/CustomerLoginPage.tsx: "mock"
- pages/customer/CustomerPortalPage.tsx: "mock"
- components/BillingTab.tsx: "mock"
- components/layouts/MarketingLayout.tsx: "mock"
- components/layouts/SalonBookingLayout.tsx: "mock"
- utils/mockEntityStore.ts: "mock"
- utils/translations.ts: "not configured"
- utils/translations.ts: "roadmap"
- utils/translations.ts: "coming soon"
- services/adminCustomerService.ts: "mock"
- services/authService.ts: "mock"
- services/availabilityService.ts: "mock"
- services/brandingService.ts: "mock"
- services/businessProfileService.ts: "mock"
- services/calendarService.ts: "mock"
- services/geminiService.ts: "roadmap"
- services/goLiveService.ts: "mock"
- services/mediaUploadService.ts: "mock"
- services/notificationService.ts: "mock"
- services/provisioningService.ts: "mock"
- services/subscriptionService.ts: "mock"
- services/subscriptionService.ts: "not configured"
- services/subscriptionService.ts: "sandbox"
- services/tenantService.ts: "mock"

### Old Branding (Randapp) Remaining
- pages/customer/CustomerLoginPage.tsx
- pages/customer/CustomerPortalPage.tsx
- pages/super-admin/SuperAdminAISettingsPage.tsx
- components/MockDiagnosticTool.tsx
- utils/demoSeeder.ts
- utils/slugUtils.ts
- services/appointmentService.ts
- services/authService.ts
- services/brandingService.ts
- services/businessProfileService.ts
- services/customerService.ts
- services/goLiveService.ts
- services/planService.ts
- services/provisioningService.ts
- services/referralService.ts
- services/serviceCatalogService.ts
- services/staffService.ts
- services/subscriptionService.ts
- services/supabaseDataProvider.ts
- services/superAdminService.ts
- services/tenantService.ts
- contexts/LanguageContext.tsx

### Frontend Secrets Exposed
None detected.

### Raw Card Inputs Detected
None detected.
