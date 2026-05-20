import { apiClient } from './apiClient';
import { Appointment } from '../types';

const getAppointmentsKey = (tenantId: string) => `randapp:${tenantId}:appointments`;

export const getAppointments = async (tenantId: string): Promise<Appointment[]> => {
  return apiClient.getList<Appointment>(getAppointmentsKey(tenantId));
};

export const createAppointment = async (tenantId: string, appointment: Omit<Appointment, 'id' | 'tenantId' | 'createdAt'>): Promise<Appointment> => {
  const key = getAppointmentsKey(tenantId);
  const existing = await apiClient.getList<Appointment>(key);
  
  const newAppointment: Appointment = {
    ...appointment,
    id: `apt_${Date.now()}`,
    tenantId,
    createdAt: new Date().toISOString(),
  };
  
  await apiClient.set(key, [...existing, newAppointment]);
  return newAppointment;
};

export const updateAppointmentStatus = async (tenantId: string, appointmentId: string, status: Appointment['status']): Promise<Appointment | null> => {
  const key = getAppointmentsKey(tenantId);
  const existing = await apiClient.getList<Appointment>(key);
  
  const idx = existing.findIndex(a => a.id === appointmentId);
  if (idx === -1) return null;
  
  existing[idx].status = status;
  await apiClient.set(key, existing);
  return existing[idx];
};

export const deleteAppointment = async (tenantId: string, appointmentId: string): Promise<boolean> => {
  const key = getAppointmentsKey(tenantId);
  const existing = await apiClient.getList<Appointment>(key);
  
  const filtered = existing.filter(a => a.id !== appointmentId);
  if (filtered.length === existing.length) return false;
  
  await apiClient.set(key, filtered);
  return true;
};

export const getBookedSlots = async (tenantId: string, date: string, staffId?: string): Promise<string[]> => {
  const appointments = await getAppointments(tenantId);
  return appointments
    .filter((apt) => apt.date === date && apt.status === 'confirmed' && (!staffId || apt.staffId === staffId))
    .map((apt) => apt.time);
};
