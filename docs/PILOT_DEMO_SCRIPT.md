# Pilot Demo Script

This document outlines a standardized flow for showcasing the Randapp platform to early adopters, investors, or pilot salon owners.

## What is Live vs. Mock?
- **Live Now:** Complete Frontend Flow, Profile Generation, Local State Persistence, Super Admin Mock-Approval, AI Styling Concept (if API key active), and Full Public Website Simulator.
- **Mock / Sandbox:** Supabase DB connections, Real SMS Notifications, Real Credit Card charges.
- **Manual Setup required:** Actual DNS Subdomains, Iyzico Production Keys.

## Step-by-Step Flow

### 1. The Hook (Demo Generator)
1. Navigate to the main Randapp Marketing Landing Page.
2. Direct attention to the immediate value: "See what your salon looks like."
3. Open `/demo` route.
4. Input the Salon Owner's actual business name and choose a color scheme.
5. Click **"Demo Oluştur"**.
6. Present the instant, beautiful simulated website. Walk through the slick interface and highlight the professional gap between this and a standard Instagram page.

### 2. The Setup (Business Owner Perspective)
1. Complete the mock demo registration or log in as `admin@randapp.com`.
2. Enter the **Yönetim Paneli**.
3. Tab over to **İşletme Profili / Web Sitesi**.
4. Show how straightforward the upload process is.
   - Upload a Logo.
   - Upload 2-3 Cover Photos.
5. Click **"Site Önizlemesini Aç"** to instantly prove the changes reflect on the public site layout. Mention the auto-rotation (carousel).
6. Jump back to the **Onboarding Wizard** or **Hizmetler / Uzmanlar** pages. Add a quick Service and Staff member.

### 3. Review & Verification (Super Admin Perspective)
1. Point out the "Yayına Alınmaya Hazır" (Ready for Review) button the salon owner presses.
2. Log out, then log in safely as `superadmin@randapp.com`.
3. Open **Onboarding / Go-Live** from the Super Admin sidebar.
4. Locate the specific Tenant in the pending list.
5. Click **Siteyi Önizle** — ensure it opens cleanly.
6. Click **Approve Go-Live** (explain this is where quality control happens).

### 4. The Action (Customer Booking Flow)
1. Navigate to the simulated Public URL (`/#/book?tenantId=...`).
2. Demonstrate how the website is a standalone entity (No booking stepper clutters the view).
3. Click **Randevu Al** or pick a specific service.
4. Show the clean stepper.
5. Select the Service.
6. Select the Expert (Highlight the "En yakın müsaitlik" tag natively resolving).
7. Select "Bana Fark Etmez" to showcase smart auto-assignment.
8. Pick a specific Time block.
9. Enter customer details.
10. Confirm Booking. Show success phase.

### 5. The Loyalty & Memory Feature (Salon Owner)
1. On the Admin Panel, click the **Müşteriler / Customers** tab.
2. Observe how the system automatically created a profile for the customer who just booked.
3. Open the customer's profile.
4. Point out the appointment history and "First Visit / Last Visit" stats.
5. Emphasize styling memory: Click "Edit" on Style Preferences and add: *“Always wants the same layered cut. Formula 7.1 + 8.0 mix.”*
6. Mention: *“Randapp remembers the customer, not only the appointment. You will never have to ask ‘what did we do last time’ again.”*
7. Simulate adding a quick Reference Photo (mentioning it’s private, tenant-scoped, and KVKK compliant).

### 6. Management & Reports
1. Log back in as `admin@randapp.com`.
2. Open the **Takvim / Randevular** section to see the new appointment populated.
3. Open the **Raporlar** page to view the mock revenue/growth charts, emphasizing tracking and analytics value.
4. Show the **Abonelik / Faturalandırma** screen, explaining that live card payments are the final phase before absolute public launch.
