# LARİ - Supabase Staging Seed Data Plan

This document maps out the specific seed data to populate a fresh Supabase Staging database, providing realistic, fictional, and KVKK-compliant test records for end-to-end verification under the **paymentless_limited_production** mode.

---

## 1. Seed Tenant & Subscription

### Tenant: Melis Güzellik & Nail Art
*   **id**: `550e8400-e29b-41d4-a716-446655440000` (Static test UUID)
*   **slug**: `melis-guzellik`
*   **name**: `Melis Güzellik & Nail Art`
*   **status**: `active`
*   **public_site_status**: `published`

### Subscription Record
*   **tenant_id**: `550e8400-e29b-41d4-a716-446655440000`
*   **plan_id**: `pilot_plan` (Manual paymentless pilot plan)
*   **status**: `manual_active`
*   **current_period_end**: `2027-01-01 00:00:00+00`

---

## 2. Seed Owner Account

*   **id**: `660f8400-e29b-41d4-a716-446655441111` (Referencing a valid auth.users UUID)
*   **tenant_id**: `550e8400-e29b-41d4-a716-446655440000`
*   **email**: `owner@melisguzellik.com`
*   **role**: `tenant_owner`
*   **full_name**: `Melis Demir`
*   **onboarding_completed**: `true`

---

## 3. Seed Services & Staff

### Services Catalog
1.  **Service 1**:
    *   **id**: `11111111-1111-1111-1111-111111111111`
    *   **name**: `Klasik Manikür & Kalıcı Oje`
    *   **price**: `400.00` TRY
    *   **duration**: `45` minutes
    *   **active**: `true`
2.  **Service 2**:
    *   **id**: `22222222-2222-2222-2222-222222222222`
    *   **name**: `Nail Art (Özel Tasarım)`
    *   **price**: `550.00` TRY
    *   **duration**: `60` minutes
    *   **active**: `true`

### Staff Members
1.  **Staff 1**:
    *   **id**: `77777777-7777-7777-7777-777777777777`
    *   **name**: `Selin Yılmaz`
    *   **role**: `specialist`
    *   **active**: `true`
2.  **Staff 2**:
    *   **id**: `88888888-8888-8888-8888-888888888888`
    *   **name**: `Ayşe Kaya`
    *   **role**: `stylist`
    *   **active**: `true`

---

## 4. Seed Availability & Working Hours

*   **tenant_id**: `550e8400-e29b-41d4-a716-446655440000`
*   **Regular hours**: Monday to Saturday, `09:00 - 19:00`.
*   **Lunch break**: `12:30 - 13:30`.
*   **Sunday**: Closed.

---

## 5. Seed Customer & Active Appointment

### Customer Profile (KVKK Compliant, Fictional)
*   **id**: `99999999-9999-9999-9999-999999999999`
*   **tenant_id**: `550e8400-e29b-41d4-a716-446655440000`
*   **name**: `Derya Test`
*   **email**: `derya.test@example.com`
*   **phone**: `+905550001122`

### Appointment Record
*   **id**: `aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`
*   **tenant_id**: `550e8400-e29b-41d4-a716-446655440000`
*   **customer_id**: `99999999-9999-9999-9999-999999999999`
*   **service_id**: `11111111-1111-1111-1111-111111111111`
*   **staff_id**: `77777777-7777-7777-7777-777777777777`
*   **date**: `2026-07-15`
*   **time**: `14:00:00`
*   **status**: `pending`

### Self-Service Token
*   **token_id**: `1111aaaa-2222-3333-4444-5555bbbbbbbb`
*   **appointment_id**: `aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`
*   **token**: `melis-derya-token-hash`
*   **expires_at**: `2026-07-16 14:00:00+00`

---

## 6. Seed Operational Log Tables

### Appointment Change Request
*   **id**: `55555555-5555-5555-5555-555555555555`
*   **appointment_id**: `aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`
*   **proposed_date**: `2026-07-16`
*   **proposed_time**: `15:30:00`
*   **status**: `pending_approval`
*   **requested_by**: `customer`

### Audit Event
*   **id**: `66666666-6666-6666-6666-666666666666`
*   **event_type**: `appointment.created`
*   **actor_id**: `99999999-9999-9999-9999-999999999999`
*   **details**: `{"channel": "public_booking_page"}`

### Support Ticket
*   **id**: `77777777-7777-7777-7777-777777777777`
*   **subject**: `Mobil Tema Hız Sorunu`
*   **description**: `Resimler yüklenirken yavaşlama gözlemleniyor.`
*   **status**: `open`

---

## 7. Cleanup & Purge Strategy

To wipe all staging records and restore a clean testing environment:

```sql
BEGIN;
DELETE FROM appointment_access_tokens WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM appointments WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM services WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM staff WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM tenants WHERE id = '550e8400-e29b-41d4-a716-446655440000';
COMMIT;
```
