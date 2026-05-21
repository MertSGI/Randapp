# Routing and Role QA

## Current Implementation State
- Route `/super-admin/*` is strictly guarded for the `super_admin` role.
- Route `/admin/*` is strictly guarded for the `salon_owner` role (or `admin` equivalence).
- Unauthenticated users trying to access guarded routes hit `ProtectedRoute` and are met with "Bu alana erişim yetkiniz yok" or get redirected to login, depending on exact URL and login state.
- `LoginPage.tsx` handles automatic role redirection after successful login.
- Mock `superadmin@randapp.com` is configured in `authService.ts`.

## Layout Distribution
- `MarketingLayout`: Used by public-facing non-salon pages (Landing, Login, Pricing).
- `SalonBookingLayout`: Used by customer-facing tenant routes (`/book`, `/ai-visualizer`).
- `AdminLayout`: Used by the salon owner dashboard (`/admin`).
- `SuperAdminLayout`: Used by the super admin dashboard (`/super-admin`).

## QA Sign-Off Status
- Layout Mapping Matches Specs: **YES**
- Role Definitions Documented: **YES**
- Unauthorized Fallbacks Established: **YES**
- Admin to Super Admin crossover blocked: **YES** (verified via `ProtectedRoute.tsx`)
- Super Admin Dashboard operational with Mock Actions: **YES**
