# LARİ Product Capability Truth Matrix

This matrix outlines the system capabilities as of pre-live phase, detailing what works locally versus what requires external infrastructure (Supabase, Custom Domains, live SMTP, etc).

| Feature | Status | User-facing? | Requires external setup? | Package/role | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Self-service registration** | Partial | Yes | Yes (Payment Provider) | All | Requires Iyzico/Stripe for real card storage |
| **Manual sales provisioning** | Yes (Mock) | No (Super Admin) | No | Super Admin | Through `manualProvisioningService.ts` |
| **Tenant public site** | Yes | Yes | No (For local/hash routing) | All | Core functionality |
| **Tenant subdomain** | Yes (Routing logic) | Yes | Yes (Wildcard DNS/SSL) | All | `https://tenant.randevulari.com` logic is ready but DNS must be mapped to the CDN. |
| **Branch URLs** | Yes | Yes | Yes (Subdomain logic) | Premium+ | `https://tenant.randevulari.com/branch` or query param fallback. |
| **Custom domains** | Yes (Requested status) | Yes | Yes (DNS A/CNAME) | Premium/Enterprise | Request flow exists; backend automated verification is future. |
| **Booking** | Yes | Yes | No | All | End-to-end UX works |
| **Admin onboarding** | Yes | No (Owner) | No | Owner | |
| **Payments** | Simulated | Yes | Yes (Iyzico/Provider API) | All | Cannot take real money until VITE_PAYMENT_RUN_MODE = production_live |
| **Trial** | Yes | Yes | Yes (Billing setup) | All | 14-days standard logic, verified in checkout. |
| **Campaigns** | Yes | Yes | No | Various | Internal coupon/discount logic works. |
| **Platform referrals** | Yes | Yes | No | All | `referralService.ts` tracks codes |
| **Customer referrals** | Yes | Yes | No | Premium+ | Part of loyalty modules |
| **AI assistant** | Simulated | Yes | Yes (Gemini API / Supabase RLS) | Premium+ | Mocked locally, requires edge functions for secure API key proxy. |
| **Customer memory** | Yes | No (Owner) | No | Premium+ | CRM functionality |
| **Reports** | Yes | No (Owner) | No | Various | Aggregation works locally. |
| **Data export/import** | Yes | No (Owner) | No | All | `dataExportService.ts` handles JSON payloads. |
| **Notifications** | Simulated | Yes | Yes (SMTP/WhatsApp API) | Premium+ | Currently logs to console. |
| **Multi-language** | Yes | Yes | No | All | `i18nLanguageConfig` drives this |
| **Multi-market** | Yes | Yes | No | Platform | Drives currency, defaults, and brand fallback (LARİ vs RandevuLari domain vs lari.app domain). Visible brand is LARİ. |
| **Super Admin** | Yes | No | No | Super Admin | Has pilot tracker, manual provisioning, etc. |

## Subdomain & DNS Requirements
For `*.randevulari.com` and `*.lari.app` to work in production:
1.  **Wildcard DNS**: Map `*.randevulari.com` to the Cloud Run / Vercel / hosting provider ingress IP or CNAME.
2.  **Wildcard SSL**: Provision a wildcard TLS certificate to cover `*.randevulari.com`.
3.  **App Routing**: The host environment will receive `tenantname.randevulari.com`. The `domainResolverService.ts` parses this on startup, extracts `tenantname`, and initializes the app with that tenant context in the booking flow.

## Custom Domain Workflows
When a user requests `booking.myhairsalon.com`, they must point a CNAME to `custom.randevulari.com` (or equivalent). TLS for third-party domains usually requires programmatic SSL certificate generation through the hosting provider's API. This is a manual or semi-automated process outside of the React SPA.
