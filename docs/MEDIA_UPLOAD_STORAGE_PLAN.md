# Media Upload & Storage Plan

## Objective
Replace raw URL-pasting inputs with a standard "Upload from computer" UX for images across the Salon Admin panel (Logos, Cover Images, Gallery, Staff/Service Photos).

## Modes of Operation

### Mock Mode (`VITE_DATA_MODE=mock`)
- When running in Mock mode, uploads do NOT sync to an external bucket.
- Instead, files are immediately read via `FileReader` and converted to `Base64` or `Object URLs` for instantaneous client-side preview.
- These representations are persisted in `localStorage` alongside the business profile JSON. This is acceptable for local testing and sales demos, but comes with storage limits.

### Supabase Mode (`VITE_DATA_MODE=supabase`)
- Relies on **Supabase Storage**.
- A dedicated bucket named `tenant-media` is used.
- **Path Structure**:
  - `tenants/{tenantId}/logo/{filename}`
  - `tenants/{tenantId}/covers/{filename}`
  - `tenants/{tenantId}/gallery/{filename}`
  - `tenants/{tenantId}/staff/{staffId}/{filename}`
  - `tenants/{tenantId}/services/{serviceId}/{filename}`

## Security Constraints
- All paths are prefixed tightly by `tenantId`.
- **Row Level Security (RLS) / Storage Policies**:
  - `SELECT`: Publicly accessible (so the unauthenticated booking site can render images).
  - `INSERT/UPDATE/DELETE`: Restricted strictly to `salon_owner` users where their `auth.uid()` matches the `tenantId` mapping in the database.

## Validation
- **File Types**: `.jpg`, `.jpeg`, `.png`, `.webp` (strictly enforced).
- **Size Limits**: Maximum 5MB per file on the client-side before transmission.
