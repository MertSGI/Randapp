# Randapp Go-Live Checklist

This document tracks the readiness of the Randapp platform before transitioning from the sandbox/mock environment to production operations (Iyzico / Supabase / real APIs).

## 1. Routing & Subdomain Readiness
- [x] Implemented `/admin-preview` and `/super-admin/tenant-preview/:tenantId` protected routes for secure previewing before go-live.
- [x] Defined routing architecture separating ` মার্কেটিং` (Marketing) vs `/:tenantSlug` (Tenant Booking) paths explicitly in `App.tsx`.
- [x] Mock tenant resolution (`DEMO_TENANT`) acts as a fallback on `localhost` regardless of path.
- [ ] **Action Required**: Before going live on a custom domain or Vercel, update `tenantService.resolveTenantFromHost` to parse `window.location.pathname` or `hash` to extract `tenantSlug` when not mapping via custom domain.

## 2. Payment Gateway (Iyzico) Readiness
- [x] Ensured `PricingPage` and internal `BillingTab` do NOT display active card payment collection text when `VITE_PAYMENT_PROVIDER=mock`.
- [x] Changed CTA to "Abonelik İçin Görüş" / "Satış Ekibiyle Görüş" in mock mode.
- [ ] **Action Required**: Configure server-side API endpoints (`/api/checkout` etc.) using actual Iyzico tokens.
- [ ] **Action Required**: Add explicit "Satın Al / Kredi Kartı ile Öde" UI components when `VITE_PAYMENT_PROVIDER=iyzico`. Do not expose Iyzico secret keys to frontend.

## 3. Product & Marketing Generalization
- [x] Marketing copy adapted to clarify support for "Klinikler, stüdyolar ve randevulu çalışan tüm diğer işletmeler" alongside hair salons.
- [x] Admin Setup simplified (`AdminLayout` top-nav converted, negative padding fixed, preview links clarified).

## 4. AI Guardrails (Gemini)
- [x] `SuperAdminAiSettingsPage` deployed to define platform limits (System prompt, image generation toggles).
- [ ] **Action Required**: `GeminiService` currently uses an embedded proxy or direct endpoint which may not apply proper rate limiting by tenant. An edge function backend must be deployed to map Supabase User ID to Token Quota.

## 5. Security & Access
- [x] Service workers disabled to prevent stale cache issues during presentation mode.
- [x] Booking Page successfully isolates `subStatus === 'suspended'` blocking unauthenticated users from viewing draft salon sites.
- [ ] **Action Required**: Supabase RLS (Row Level Security) policies must be fully defined before switching off `VITE_DATA_MODE=mock`.
