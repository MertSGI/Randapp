import { Appointment, User } from '../types';

const APPOINTMENTS_KEY = 'nexus_appointments';
const USERS_KEY = 'nexus_users';

// Initialize with some dummy data if empty
const initStorage = () => {
  if (!localStorage.getItem(APPOINTMENTS_KEY)) {
    const dummy: Appointment[] = [
      {
        id: 'apt_001',
        userId: 'guest_1',
        user_name: 'John Doe',
        user_email: 'john@example.com',
        serviceId: 'srv_1', // Men's Haircut
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        syncedToGoogle: true,
      }
    ];
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(dummy));
  }
};

export const getAppointments = (): Appointment[] => {
  initStorage();
  const data = localStorage.getItem(APPOINTMENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAppointment = (appointment: Appointment): void => {
  const current = getAppointments();
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify([...current, appointment]));
};

export const updateAppointmentStatus = (id: string, status: Appointment['status']): void => {
  const current = getAppointments();
  const updated = current.map(apt => apt.id === id ? { ...apt, status } : apt);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
};

export const checkAvailability = (date: string, time: string): boolean => {
  const appointments = getAppointments();
  return !appointments.some(
    apt => apt.date === date && apt.time === time && apt.status === 'confirmed'
  );
};

export const getBookedSlots = (date: string): string[] => {
  const appointments = getAppointments();
  return appointments
    .filter(apt => apt.date === date && apt.status === 'confirmed')
    .map(apt => apt.time);
};