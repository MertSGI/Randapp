# Public Site Provisioning Architecture

This document describes the intended architecture for generating and managing public-facing salon websites on the Randapp platform.

## 1. Flow Overview

1. **Purchase/Trial**: A professional completes checkout or begins a 7-day trial.
2. **Onboarding Wizard**: They complete their business setup (Adding services, staff, branding, contact info, and choosing a public URL slug).
3. **Tenant & Profile Updates**:
   - `tenant` table holds core details (`name`, `slug`, `subdomain`, `customDomain`, `status`).
   - `salon_business_profiles` table holds rich display data (`public_display_name`, `about_text`, `cover_images`, `contact details`).
4. **Site Generation (Virtual)**: Once required fields are complete and subscription is valid, their domain becomes active.
5. **Publishing**: The business sets `is_public_profile_enabled = true`. Their website becomes accessible at `{slug}.randapp.com` or their custom domain.

## 2. Slug & Subdomain Rules

We enforce specific rules to ensure URLs are web-safe and distinct from platform routes:

- **Validation**: Lowercase ASCII alphanumeric and hyphens only (`^[a-z0-9][a-z0-9-]*[a-z0-9]$`), no consecutive hyphens. Length between 3 and 50 chars.
- **Auto-generation**: `generateSlugFromName("Nexus Güzellik")` handles Turkish character mapping (ç->c, ş->s, vb) and formats cleanly to `nexus-guzellik`.
- **Reserved Words**: Slugs like `admin`, `api`, `app`, `www`, `randapp`, `book`, etc., are strictly blocked to prevent routing collisions.
- **Decoupling**: The business `public_display_name` (e.g. "Nexus Güzellik") is separate from the `slug` (e.g. `nexus-guzellik-izmir`), giving them full control over their URL without affecting their display brand.

## 3. URL Router Resolution Design

To serve a dynamic tenant website, the infrastructure will execute the following resolution pattern:

1. **Host Header Check**:
   - Request comes to `nexus.randapp.com` (or `www.nexus.randapp.com`).
   - The edge router extracts `nexus` from the Host header.
   - It queries `tenant WHERE subdomain = 'nexus' OR slug = 'nexus'`.
2. **Custom Domain Check**:
   - Request comes to `www.nexusguzellik.com`.
   - Edge router queries `tenant WHERE customDomain = 'www.nexusguzellik.com'`.
3. **Fallback Path Validation**:
   - In development/preview or direct linking, routes like `randapp.com/s/nexus` resolve similarly.

## 4. Provisioning States

Public websites respect exactly the tenant's current setup & billing state:

- **Draft / Incomplete**: Website returns 404 or a "Coming Soon" page to the public. Admin can see it via Preview.
- **Published**: Website is live, accepting bookings. Requires active subscription or trial.
- **Suspended / Expired**: If the trial ends or payment fails, the public site shows a generic standard graceful unavailability banner without exposing internal dashboard errors.

## 5. Roadmap

- **DNS Automation**: Integrate with Cloudflare or GCP Cloud DNS APIs to automatically register and verify CNAME records for Custom Domains (`customDomain` field).
- **Image Hosting**: Replace local file arrays with direct Cloud Storage or Supabase Storage upload signed URLs for gallery images.
- **Instagram API**: Currently using mock/static feeds on the public site layout. Implement Instagram Basic Display API OAuth inside the admin settings to fetch live `media` edges for the tenant widget securely.
- **Google Maps Embed**: Store `maps_embed_url` or use Google Maps Places ID with a server-side Maps API key. In the interim, use visually consistent placeholder static map pins that link out to `https://maps.google.com/?q={address}` (as currently implemented).
