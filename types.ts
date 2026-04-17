export type Role = 'guest' | 'member' | 'admin';

export interface Staff {
  id: string;
  name: string;
  title: string;
  calendarEmail?: string;
  image?: string;
}

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
  staffId: string;
  date: string; // ISO Date string YYYY-MM-DD
  time: string; // HH:mm
  status: 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  syncedToGoogle: boolean;
  phone?: string;
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
    price: 300,
    image: 'https://picsum.photos/seed/mens-haircut/800/600'
  },
  { 
    id: 'srv_2', 
    name: 'Beard Trim & Shape', 
    name_tr: 'Sakal Tıraşı & Şekillendirme', 
    duration: 30, 
    price: 200,
    image: 'https://picsum.photos/seed/beard-trim/800/600'
  },
  { 
    id: 'srv_3', 
    name: 'Manicure & Pedicure', 
    name_tr: 'Manikür & Pedikür', 
    duration: 60, 
    price: 500,
    image: 'https://picsum.photos/seed/manicure-pedicure/800/600'
  },
  { 
    id: 'srv_4', 
    name: 'Hair Prosthesis', 
    name_tr: 'Protez Saç', 
    duration: 120, 
    price: 3500,
    image: 'https://picsum.photos/seed/hair-prosthesis/800/600'
  },
  {
    id: 'srv_5',
    name: 'Laser Epilation',
    name_tr: 'Lazer Epilasyon',
    duration: 45,
    price: 800,
    image: 'https://picsum.photos/seed/laser-epilation/800/600'
  }
];

export const BUSINESS_HOURS = {
  start: 9, // 09:00
  end: 21, // 21:00
  interval: 45, // minutes (adjusted for barber slots)
};