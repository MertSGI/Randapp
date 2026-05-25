# Booking Availability Model

## Objective
Refine the end-user booking UX by programmatically guiding the customer to the nearest available appointment.

## Logic Flow

1. **Service Selection First**: The customer clicks on a service they want.
2. **Staff Filtering**: The system filters staff members down to those who provide the selected service.
3. **Availability Badges**:
   - For each viable staff member, the system queries their scheduled appointments and business hours to render a "Next Available Slot" badge (e.g., "En Yakın: Bugün 14:30").
   - Highlights the absolute earliest staff member.
4. **Auto-Selection**:
   - A button is provided: "En erken müsait randevuyu göster".
   - Clicking this automatically selects the staff member with the earliest badge and skips the customer forward to that time slot in the calendar view.
5. **Slot Generation**:
   - Availability is dynamically computed based on `tenant.businessHours`.
   - Existing appointments block out time.

## Data Layer Requirements

`availabilityService.ts` will manage:
- `getAvailableSlotsForStaff(tenantId, staffId, serviceId, dateRange)`
- `getNextAvailableSlotForStaff(tenantId, staffId, serviceId)`
- `getEarliestAvailableStaff(tenantId, serviceId)`

This model allows a clean calculation of time slots internally without full external two-way calendar sync for the MVP launch.
