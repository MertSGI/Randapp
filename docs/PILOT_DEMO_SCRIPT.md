# LARİ Pilot Demo Script & Presentation Guide

This document outlines the ideal flow for demonstrating Randapp to business owners during the pilot phase.
**Ensure you are in development `VITE_DATA_MODE=mock` to safely demonstrate functionality without affecting production databases.**

## 1. 30-second intro (Elevator Pitch)
**EN:** "Randapp gives appointment-based businesses a professional digital storefront, an intelligent booking flow, and a powerful 'Customer Memory' CRM. It upgrades you from scattered WhatsApp messages to a unified platform."
**TR:** "Randapp randevu tabanlı işletmelere profesyonel bir vitrin, akıllı rezervasyon akışı ve gelişmiş 'Müşteri Hafızası' sunar. Sizi dağınık WhatsApp mesajlarından kurtarıp tek bir pürüzsüz sisteme geçirir."

## 2. 3-minute quick demo (The "Wow" Path)
- Show the **Marketing Homepage**, emphasize how clean and professional it looks.
- Jump straight to the **Customer Booking Flow** (`/book`). Show the simplicity of service -> staff -> time selection.
- Show the **Admin App** on a simulated mobile view. Open the "Today" view and click on a customer's **Customer Memory** to reveal past notes and style preferences.
- **Punchline:** "In 3 minutes, your customer booked seamlessly, and you remembered exactly what they needed before they walked in."

## 3. 7–10 minute full demo
This is the detailed walk-through. Follow the paths below in order.

### 4. Business owner path (Marketing to Trial)
- Show `/` (Homepage) and `/features`. Point out that the product is for barbers, wellness studios, clinics, and consultants.
- Click **"Contact"** or **"Demo"**. Explain how lead capture works (currently routes safely securely to sales).
- Show the **Pricing** page. Toggle Monthly/Annual.

### 5. Customer booking path
- Show the **Public Business Website** (e.g., Nexus Studio). It looks like a real bespoke website, not just a widget.
- Walk through the booking stepper.
- Highlight the **"No Preference" (Bana Fark Etmez)** option: "This maximizes your calendar efficiency by picking the earliest slot."
- Complete the booking. Show the polished **Success Page**.
- Explain the **Customer Portal**: Customers can log in with phone/email (no passwords needed) to view and cancel their eligible appointments.

### 6. Admin owner path
- Log in as the business owner (`admin@randapp.com`).
- Demonstrate the **Mobile-first Admin Layout**.
- Click through **Today**, **Appointments**, **Services**, and **Staff**. Show how easy it is to toggle a service's availability.
- Show **Referrals**: Explain how owners can run word-of-mouth campaigns safely.
- Show **Settings & Business Profile**: Show where the public display name and policies are managed. Explain that official names are locked for platform safety.

### 7. Super Admin path
- Log in as Super Admin (`superadmin@randapp.com`).
- Show the **Platform Overview Dashboard**: Fast KPIs (MRR, Tenants).
- Show **Tenants**: Mention that you can Pause/Resume or Review onboarding businesses.
- Show **Subscriptions & Plans**: Explain how the platform scales globally and how you can add new pricing tiers.

### 8. Pricing/trial/payment explanation
- Show the payment CTA on the Admin Billing tab.
- **Script:** "We present the 'Start Trial' button exactly as the user will see it. Because we are in the Pilot phase, clicking it shows a professional message that payment integration is being finalized. In production, this securely connects to Iyzico via edge functions without exposing any sensitive keys to the frontend."

### 9. Customer Memory sales angle
- **Script:** "Randapp remembers the customer, not just the transaction."
- Show how the Admin can see *First Visit, Total Appointments, Care Notes, Internal Notes, and Reference Photos*.
- Explain the value: "When your staff changes, the customer memory stays with the business."

### 10. Mobile app roadmap explanation
- Show the `/mobile-app` marketing page.
- **Script:** "Right now, you get a powerful web platform. In the future, your customers will download the Randapp app to discover local businesses on a map and book directly. You are securing your spot on that future map today."

### 11. AI explanation
- Mention Gemini AI features (Insights, Auto-notifications).
- **Script:** "AI handles mundane tasks like drafting notification texts or analyzing busy hours. Right now, it's operating in a mock/safe mode for the demo to prevent accidental costs or data leaks, but the interface layer is fully built for the backend edge functions."

### 12. Objection handling
- **"I already use a notebook and WhatsApp, it's free."**
  - *Response:* "WhatsApp is great for chat, but it doesn't remember your customer's last color formula or automatically fill empty slots. Randapp saves you 5+ hours a week in back-and-forth messaging."
- **"What if my customers don't want to download an app?"**
  - *Response:* "They don't have to! The entire booking flow works in any web browser, directly from your Instagram bio link."
- **"Is my data secure?"**
  - *Response:* "Yes. We use isolated cloud infrastructure. Your internal notes aren't visible to customers, and reference photos are kept entirely private."
