# Salon Business Website Profile - QA Guide

## Overview
This document outlines the testing requirements for the new Salon Website Profile features that convert standard booking pages into mini-websites.

## Test Matrix

### 1. Database & Persistence Layer
- [ ] Verify `005_salon_business_profile.sql` migration runs without errors
- [ ] Verify Row Level Security (RLS) on `tenant_business_profiles`
  - [ ] Public users can SELECT `is_public=true`
  - [ ] Salon owners can SELECT/INSERT/UPDATE their own tenant_id
  - [ ] Super Admins can do all
- [ ] Verify schema matches `SalonBusinessProfile` interface from `types.ts`

### 2. Administrator Panel (`/admin`)
- [ ] Navigate to "Web Sitesi" tab
- [ ] Verify the form loads existing profile data correctly (Mock or Real)
- [ ] Toggle "Sayfa Yayında" and verify `is_public` state updates
- [ ] Edit "Slogan" and "Açık Adres"
- [ ] Add multiple hero gallery images using standard URLs
- [ ] Verify successful save notification and data persistence

### 3. Onboarding Wizard (`OnboardingWizard.tsx`)
- [ ] Login as a brand new tenant with no profile
- [ ] Navigate through Onboarding Wizard
- [ ] Verify Step 3: "İşletme Profili (Web Sitesi)" appears and requires input
- [ ] Verify completion state tracks the profile input ("Marka ve Profil")
- [ ] Verify readiness blocks go-live if missing profile info

### 4. Public Booking Page (`BookingPage.tsx`)
- [ ] Access public URL for a configured tenant
- [ ] Verify Hero Image is rendered (first image from `hero_gallery`)
- [ ] Verify display of the Slogan (`short_description`)
- [ ] Verify display of Address (`address`)
- [ ] Verify secondary gallery images render
- [ ] Verify empty states (if no gallery/slogan exists, fallback cleanly)

### 5. Demo Generator (`DemoLandingPage.tsx`)
- [ ] Visit main landing page and interact with Demo Generator section
- [ ] Populate Slogan and Verify live preview updates instantly
- [ ] Verify Address population and live preview updates instantly

### 6. Super Admin Visibility (`SuperAdminDashboard.tsx`)
- [ ] Login as Super Admin
- [ ] Navigate to unified dashboard
- [ ] In the "All Tenants" table, observe the new "Web Profile" column
- [ ] Verify status indicates "Active" or "Pending" based on `tenant_business_profiles` record matching `tenant_id`
