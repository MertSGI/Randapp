# LARİ Supabase Schema Architecture

This document describes the mapping of application entities into Supabase tables, aligning the initial prototype (localStorage/mock) architecture to a real relational and secure database schema.

## Core Hierarchy

- **Auth Session (auth.users)**: Represents a physical identity authenticated via Supabase Auth.
- **Tenants (tenants)**: The root boundary for an establishment (salon, spa). All business data flows down from a Tenant UUID.
- **Business Profiles (tenant_business_profiles / business_profiles)**: The public representation, containing visual configurations, opening hours, descriptions, and location details.

## Resource Entities

- **Services (services)**: Available treatments or services offered.
- **Staff (staff)**: The employees or practitioners at the establishment.
- **Staff Services (staff_services)**: Junction table matching what staff members can perform what services.
- **Availability Rules (availability_rules)**: Define recurring or specific shifts/availability for staff/tenant.

## Transaction Entities

- **Appointments (appointments)**: Booking records connecting Customer, Tenant, Service, and Staff.
- **Customers (customers)**: Core customer CRM profile for a tenant.
- **Customer Memory (customer_memory)**: Private add-on holding internal notes, preferences, and reference photo metadata (No biometric indexing).

## Billing & Go-Live Pipeline

- **Subscriptions (subscriptions)**: Current trial or active payment plan state.
- **Payments (payments) & Payment Events (payment_events)**: Logs and webhook records processing from sandbox/production (e.g. Iyzico).
- **Business Verification (business_verification_reviews)**: Logs of Super Admin manual review gate for publish approval.
- **Audit Logs (audit_logs)**: Detailed tracking of tenant state changes and risk-related events.

## Referral & Growth
- **Referral Campaigns (referral_campaigns)**: B2C Custom reward models published by salons for their end users.
- **Platform Referral Settings (platform_referral_programs)**: B2B system configurations dictating global free-month reward thresholds.
- **Platform Referrals (platform_referrals)**: The relationship linking referring tenant IDs to the referred, holding current qualification lifecycle state.
- **Referral Reward Ledger (referral_reward_ledgers)**: Auditable trails of free months granted off active subscriptions, consumed and pending.

## Notification & Communication Layer

- **Notification Templates (notification_templates)**: Scaffolding dictating text/email/WhatsApp notifications.
- **Notification Logs (notification_logs)**: Records of message dispatch statuses.
