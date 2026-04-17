import { Appointment, User, Staff } from '../types';

const APPOINTMENTS_KEY = 'nexus_appointments';
const USERS_KEY = 'nexus_users';
const STAFF_KEY = 'nexus_staff';

// Initialize with some dummy data if empty
const initStorage = () => {
  if (!localStorage.getItem(STAFF_KEY)) {
    const dummyStaff: Staff[] = [
      { id: 'stf_1', name: 'Mustafa Ali Yılmaz', title: 'Master Hair Designer', calendarEmail: 'mustafa@example.com' },
      { id: 'stf_2', name: 'Ahmet Yılmaz', title: 'Senior Barber', calendarEmail: 'ahmet@example.com' },
      { id: 'stf_3', name: 'Ayşe Kaya', title: 'Laser & Beauty Specialist', calendarEmail: 'ayse@example.com' }
    ];
    localStorage.setItem(STAFF_KEY, JSON.stringify(dummyStaff));
  }

  if (!localStorage.getItem(APPOINTMENTS_KEY)) {
    const dummy: Appointment[] = [
      {
        id: 'apt_001',
        userId: 'guest_1',
        user_name: 'John Doe',
        user_email: 'john@example.com',
        serviceId: 'srv_1', // Men's Haircut
        staffId: 'stf_1',
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

export const getStaff = (): Staff[] => {
  initStorage();
  const data = localStorage.getItem(STAFF_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveStaff = (staffMember: Staff): void => {
  const current = getStaff();
  localStorage.setItem(STAFF_KEY, JSON.stringify([...current, staffMember]));
};

export const updateStaff = (id: string, updatedFields: Partial<Staff>): void => {
  const current = getStaff();
  const updated = current.map(stf => stf.id === id ? { ...stf, ...updatedFields } : stf);
  localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
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

export const checkAvailability = (date: string, time: string, staffId: string): boolean => {
  const appointments = getAppointments();
  return !appointments.some(
    apt => apt.date === date && apt.time === time && apt.status === 'confirmed' && apt.staffId === staffId
  );
};

export const getBookedSlots = (date: string, staffId: string): string[] => {
  const appointments = getAppointments();
  return appointments
    .filter(apt => apt.date === date && apt.status === 'confirmed' && apt.staffId === staffId)
    .map(apt => apt.time);
};