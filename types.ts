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
  name_tr: string; // Turkish name
  duration: number; // in minutes
  price: number;
  image?: string; // URL to service image
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
  { 
    id: 'srv_1', 
    name: "Men's Haircut", 
    name_tr: 'Saç Kesimi', 
    duration: 45, 
    price: 30,
    image: 'https://images.unsplash.com/photo-1593702295094-aea8c5c13d7b?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'srv_2', 
    name: 'Beard Trim & Shape', 
    name_tr: 'Sakal Tıraşı & Şekillendirme', 
    duration: 30, 
    price: 20,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'srv_3', 
    name: 'Hair & Beard Combo', 
    name_tr: 'Saç & Sakal Kombo', 
    duration: 75, 
    price: 45,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b7f30a?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'srv_4', 
    name: 'Hot Towel Shave', 
    name_tr: 'Sıcak Havlu Tıraşı', 
    duration: 45, 
    price: 35,
    image: 'https://images.unsplash.com/photo-1532710093739-9470acff878f?auto=format&fit=crop&q=80&w=800'
  },
];

export const BUSINESS_HOURS = {
  start: 9, // 09:00
  end: 21, // 21:00
  interval: 45, // minutes (adjusted for barber slots)
};