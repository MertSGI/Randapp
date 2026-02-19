export type Role = 'guest' | 'member' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
}

export interface Appointment {
  id: string;
  userId: string;
  user_name: string;
  user_email: string;
  serviceId: string;
  date: string; // ISO Date string YYYY-MM-DD
  time: string; // HH:mm
  status: 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  syncedToGoogle: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export const SERVICES: Service[] = [
  { id: 'srv_1', name: 'General Consultation', duration: 30, price: 50 },
  { id: 'srv_2', name: 'Deep Tissue Massage', duration: 60, price: 90 },
  { id: 'srv_3', name: 'Dental Cleaning', duration: 45, price: 120 },
  { id: 'srv_4', name: 'Physiotherapy', duration: 30, price: 75 },
];

export const BUSINESS_HOURS = {
  start: 8, // 08:00
  end: 22, // 22:00
  interval: 30, // minutes
};