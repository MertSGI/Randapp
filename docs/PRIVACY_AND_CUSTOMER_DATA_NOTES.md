# Privacy and Customer Data Notes

## Pilot Compliance Scope
During the pilot and mock phase, actual customer telemetry or data routing to global databases is not happening. However, we have designed the UX indicating our approach to privacy and data boundaries.

## Customer Data Boundaries (Tenant Isolation)
A super-admin oversees the SaaS platform, but their visibility into raw tenant customer data (e.g. John Doe's phone number booking with Tenant A) should be strictly separated.
- A Super Admin dashboard should theoretically aggregate counts ("Tenant A has 40 customers") rather than exposing John Doe's PII.
- Super Admins can only log in and mask as a Tenant if they are explicitly granted support overrides, but ethically should not browse raw appointment ledgers.

## The Privacy Notice UI
- During booking checkout, a privacy label is shown underneath the "Save my details" checkbox.
- Turkish: "Bilgilerinizi yalnızca randevu oluşturma ve randevu hatırlatma amacıyla kullanırız."
- English: "We only use your information for booking and appointment reminders."
- The `Aydınlatma Metni` / `Privacy Notice` acts as the KVKK / GDPR visual placeholder.

## Customer Profiles
The "Account Lite" data model captures the lowest necessary footprint (Name, Phone, Email) strictly for fulfilling contact requirements around the appointment lifecycle (booking confirmation logic, WhatsApp/Email notifications, Staff alerts).
