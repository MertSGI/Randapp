# Routing, Role Guard, and Layout QA

This document outlines the routing structure, role expectations, and verification steps for Randapp.

## 1. Route & Layout Map

The application is split into four distinct Layouts to enforce strict separation of concerns:

### Marketing Layout
- **Target Audience:** Salon owners
- **Routes:** 
  - `/` (Marketing Home)
  - `/features`
  - `/pricing`
  - `/demo`
  - `/contact`
  - `/login`
- **Navigation Navbar:** Özellikler, Fiyatlar, Demo Oluştur, İletişim, Giriş Yap, Abonelik Talep Et (CTA). (NO tenant booking/admin links).

### Salon Booking Layout
- **Target Audience:** Salon customers / end-users
- **Routes:**
  - `/book` (Or `/` if default redirect resolves here inside App flow)
  - `/ai-visualizer` (AI Visualizer for customers)
- **Navigation Navbar:** Salon Name/Logo, Randevu Al, *Yapay Zeka ile Tavsiye* (if enabled by tenant plan), WhatsApp Communication link. (NO platform marketing links).
- **AI Visualizer Specifics:** This is explicitly a **customer-facing** tool meant for advisory before booking. If `planService` dictates `aiRecommendationsEnabled: false`, the route will display "Bu özellik mevcut paketinizde aktif değildir." and the navigation link will be hidden.

### Admin Layout
- **Target Audience:** Salon owner/admin
- **Routes:**
  - `/admin`
  - `/admin/*` (Kurulum, Randevular, Hizmetler, Çalışanlar, Raporlar, Abonelik tabs inside)
- **Navigation Navbar:** Salon Admin heading, 'Siteyi Görüntüle' (View Site map), Logged-in email.
- **Roles:** `salon_owner`, `super_admin`

### Super Admin Layout
- **Target Audience:** Platform operators (Randapp founders)
- **Routes:**
  - `/super-admin`
  - `/super-admin/tenants`
  - `/super-admin/subscriptions`
  - `/super-admin/payments`
  - `/super-admin/onboarding`
  - `/super-admin/reports`
  - `/super-admin/settings`
- **Navigation Sidebar:** Strict platform metrics.
- **Roles:** `super_admin` only

## 2. Role Guards

Roles are enforced via `<ProtectedRoute>` which consumes the `AuthContext` user metadata.
- **Visitor:** Cannot access `/admin` or `/super-admin` (redirected to `/login`).
- **salon_owner:** Accesses `/admin`. Attempting to access `/super-admin` redirects out.
- **super_admin:** Accesses `/admin` and `/super-admin`.

## 3. Gemini API Security
- **Current State:** A frontend proxy is created but not wired securely for production.
- **TODO:** For live deployment, `geminiService.ts` calls must execute entirely server-side (Supabase Edge Function) to prevent leaking the restricted `GEMINI_API_KEY` to the browser.
- **Privacy Notice:** Customers are alerted: *"Fotoğrafınız yalnızca öneri oluşturmak için kullanılır. Lütfen hassas kişisel bilgi içeren görseller yüklemeyin."* when using the Visualizer.

## 4. Manual QA Checklist (Current Status)

- [x] Basic hash routing works (`/#/admin`, `/#/demo`, `/#/ai-visualizer`).
- [x] Admin is guarded.
- [x] Unauthenticated users are redirected cleanly to login.
- [x] AI Visualizer shows strictly within SalonBookingLayout.
- [x] AI Visualizer respects the boolean `aiRecommendationsEnabled` flag on the active plan.
- [x] Reporting Service properly falls back to static `service.price` for calculating MVP "Estimated Revenue".
- [x] No marketing tabs (Demo Oluştur, vs) leak into the salon booking experience.
- [x] Marketing Layout properly surfaces `/contact` and features.
