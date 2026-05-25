# Salon Website Design System

The product architecture implements a "Website First, Booking Second" philosophy. The public-facing system acts as a mini-website for salons before funneling users into the complex booking workflow.

## 1. Core Principles
1. **Vertical SaaS Generalization**: While initially targeted for barbers/salons, the vocabulary and layout should scale gently to dentists, clinics, and studios.
2. **Mobile-First Geometry**: The layout employs a `max-w-lg mx-auto` constraints approach to frame the site on desktop exactly as a mobile canvas (approx 500px).
3. **No Top Stepper in Marketing**: The user should never see booking steps ("Hizmet Seç, Saat Seç, Bilgilerin") until they explicitly tap a "Randevu Al" or equivalent CTA.

## 2. Shared Components (`SalonWebsiteView.tsx`)
This component is the true rendering engine for:
- Demo Site generated previews
- App Admin Preview Site (`SitePreviewPage`)
- Super Admin Tenant Preview (`SuperAdminTenantPreviewPage`)
- Live Customer Site (`BookingPage` -> Step 0)

## 3. Upload UX
The legacy approach expected users to paste Google Images/Instagram links manually.
The new pattern requires file uploads:
- **Logo**: 1x Local Blob Upload
- **Cover Carousel**: N-ary Local Blob Upload (`cover_images` array)
- **Gallery**: N-ary Local Blob Upload
URL fields are now placed inside a collapsible context `<details>` to prevent confusing standard mobile/desktop users who expect a raw file picker.

## 4. Lightbox & Immersiveness
- Gallery taps use a localized state variable to stretch a high z-index Fixed absolute block masking the entire viewport to give immersive gallery views.
- Cover blocks support native arrows + fallback dots + Lightbox expand.
