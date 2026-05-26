# Randapp Pilot Demo Script & Presentation Guide

This document outlines the ideal flow for demonstrating Randapp to salon owners during the pilot phase.
**Ensure you are in development `VITE_DATA_MODE=mock` to use demo seed tools safely before the meeting.**

## Core Value Proposition (Sales Message)
**EN:** "Randapp gives small businesses more than online booking: it gives them a mini website, smart booking, customer memory, and an owner dashboard."
**TR:** "Randapp küçük işletmelere sadece online randevu değil; mini web sitesi, akıllı randevu akışı, müşteri hafızası ve işletme yönetim paneli sağlar."

---

## Pre-Meeting Setup (5 mins before)
1. Open the application.
2. Ensure you are on the Marketing Home Page (`/?demoTools=1`). You must add `?demoTools=1` to the URL.
3. Scroll to the footer, confirm you see "Demo Utils (Dev Mode Only)".
4. Click **"Reset Local Data"** to clear previous sessions.
5. Click **"Seed Pilot Demo Data"** to load the polished demo tenant with mock appointments, staff, services, and customer memory.
6. The app will reload. You are ready.

---

## 1. Opening Pitch
- **Goal:** Set the stage. Identify the pain points (notebooks, Instagram DMs, lost customer preferences).
- **Say:** "Managing a salon means juggling Instagram DMs for appointments, remembering hair color formulas in your head, and trying to look professional. Randapp solves this by giving you a digital storefront, a smart appointment system, and a customer memory hub in one place. Best of all, it's incredibly simple to set up."

## 2. Marketing Site & Instant Demo
- **Show:** Scroll through the features page.
- **Action:** Click "Preview My Salon" (Kendi Salonumu Önizle) or navigate to `/demo`.
- **Explain:** "We let business owners see what their app looks like instantly before they even sign up. They just enter their name, and we generate a personalized landing page."

## 3. Public Salon Website
- **Action:** Open the seeded tenant's public website.
- **Explain:** "This isn't just a booking widget. This is your salon's digital home. Customers see your cover photos, your services, your staff, and your address. It looks professional on both mobile and desktop."
- **Note:** Mention that "Manual custom domain support / Manuel özel domain desteği" is provided.

## 4. Booking Flow & Customer Portal Lite
- **Action:** Click "Book Appointment".
- **Show:** Step 1: Services. Select "Saç Kesimi".
- **Show:** Step 2: Staff. Point out the "Bana Fark Etmez" (No Preference) option.
- **Explain:** "Customers who just want the earliest slot can pick 'No Preference'. The system intelligently picks the first available staff member."
- **Show:** Customer Details.
- **Explain:** "We don't force customers to remember passwords. They book easily. Upon success, they get a summary."
- **Action:** Visit `/customer/login`. Login with the mock phone/email.
- **Show:** Customer Portal Lite. Show their past and upcoming appointments. Cancel an appointment if possible.
- **Explain:** "Customers have total control over their bookings within the cancellation window, reducing no-shows and your administrative workload."
- **Note on Payments:** Explicitly state: "For this pilot, the booking is instantly confirmed offline. Online payments will be activated in our next phase."

## 5. Admin Owner Dashboard & Appointments
- **Action:** Log in as the admin (`admin@randapp.com` / `admin123`).
- **Show:** The Appointments tab. 
- **Explain:** "Here is your daily view. You see exactly who is coming and for what."

## 6. The Customer Memory Story (Key Selling Point)
- **Say:** **EN:** "Randapp remembers the customer, not only the appointment." / **TR:** "Randapp sadece randevuyu değil, müşteriyi de hatırlar."
- **Action:** On an appointment card, click **"View Customer Profile"**.
- **Show:** The Customer Memory tab opens directly to that customer.
- **Highlight:**
  - **Total visits & Last Visit.**
  - **Style Preferences:** Show the "Wella 7.1 + 8.1" color formula logged.
  - **Internal Notes:** "Likes green tea".
  - **Appointment History.**
- **Reference Photos (Privacy Note):** "You can upload reference photos of their hair. These are strictly for your salon's private history. We do not use AI facial recognition or share these publicly." (Explain this is in mock/local mode currently).

## 7. Reports & Owner Settings
- **Action:** Switch to "Reports".
- **Explain:** "You immediately see your estimated revenue and appointment volume. No math required."
- **Action:** Switch to "Subscription" (Abonelik).
- **Explain:** "This is where you would upgrade your plan in the future. Currently, you are in a pilot mode, so live payments are not active."

## 8. Super Admin Operations Center
- **Action:** Log out. Log in as Super Admin (`superadmin@randapp.com` / `superadmin123`).
- **Show:** The dashboard stats.
- **Feature:** Show the Mock "Toggle Sub" button. Explain how the platform team can manually manage subscription states if they don't pay their real-life bill. "We have full operational control."

## 9. Closing Value Proposition
- **Say:** "With Randapp, a salon owner steps away from pen and paper, elevates their brand, and builds an unforgettable customer experience through Customer Memory. We are ready to onboard our first test businesses."
