import { Appointment, Service } from '../types';

/**
 * Generate a Google Calendar Web Intent URL.
 * This allows the user to click a link and immediately add it to their calendar
 * without requiring backend OAuth (Client-side solution).
 */
export const generateGoogleCalendarLink = (appointment: Appointment, service: Service): string => {
  const startTime = new Date(`${appointment.date}T${appointment.time}`);
  const endTime = new Date(startTime.getTime() + service.duration * 60000);

  const formatTime = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Appointment: ${service.name} at RadApp`,
    details: `Service: ${service.name}\nCustomer: ${appointment.user_name}\nNote: Booked via RadApp`,
    location: 'RadApp Barber Shop, Main St',
    dates: `${formatTime(startTime)}/${formatTime(endTime)}`
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * MOCK BACKEND CALENDAR SYNC
 * In a real app, this sends data to your Python backend, which uses a Service Account
 * to add the event to the Business's Master Calendar.
 */
export const syncToBusinessCalendar = async (appointment: Appointment): Promise<boolean> => {
    console.group("📅 Syncing to Business Google Calendar...");
    console.log(`Adding event for ${appointment.date} at ${appointment.time}`);
    console.groupEnd();

    // Simulate API Call
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("✅ Synced to Business Calendar successfully.");
            resolve(true);
        }, 1500);
    });
}