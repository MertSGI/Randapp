export type Role = 'super_admin' | 'salon_owner' | 'staff' | 'customer';

export interface TenantBranding {
  tenantId: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  businessName: string;
  tagline?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
  address?: string;
  footerText?: string;
}

export interface SalonBusinessProfile {
  id: string;
  tenant_id: string;
  short_description?: string;
  about_text?: string;
  business_category?: string;
  address?: string;
  city?: string;
  district?: string;
  map_embed_url?: string;
  google_maps_url?: string;
  phone?: string;
  whatsapp_number?: string;
  instagram_url?: string;
  website_url?: string;
  email?: string;
  opening_hours_summary?: string;
  cover_image_url?: string;
  cover_images?: string[];
  logo_url?: string;
  gallery_images?: string[];
  amenities?: string[];
  parking_info?: string;
  payment_methods?: string[];
  cancellation_policy?: string;
  booking_policy?: string;
  featured_message?: string;
  seo_title?: string;
  seo_description?: string;
  is_public_profile_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  subdomain?: string;
  customDomain?: string;
  status: 'trialing' | 'active' | 'past_due' | 'cancelled' | 'expired' | 'none';
  planId?: string;
  createdAt: string;
  updatedAt: string;
  branding: TenantBranding;
}

export interface Staff {
  id: string;
  tenantId?: string;
  name: string;
  title: string;
  calendarEmail?: string;
  phone?: string;
  image?: string;
  isOwner?: boolean;
  active?: boolean;
}

export interface User {
  id: string;
  tenantId?: string;
  name: string;
  email: string;
  passwordHash?: string;
  phone?: string;
  role: Role;
  active?: boolean;
}

export interface Service {
  id: string;
  tenantId?: string;
  name: string;
  name_tr: string; // Turkish name
  duration: number; // in minutes
  price: number;
  image?: string; // URL to service image
  active?: boolean;
  category?: string;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  segment?: string;
  createdAt: string;
}

export interface CustomerMemoryNote {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
}

export interface CustomerMemoryPhoto {
  id: string;
  url: string;
  caption?: string;
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  tenantId: string;
  fullName: string;
  phone: string;
  email: string;
  preferredLanguage?: 'tr' | 'en';
  marketingConsent?: boolean;
  appointmentReminderConsent?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastAppointmentAt?: string;
  // New Customer Profile Lite fields
  firstVisitAt?: string;
  totalAppointments?: number;
  preferredStaffId?: string;
  lastServiceId?: string;
  stylePreference?: string;
  colorFormula?: string;
  avoidNotes?: string;
  careNotes?: string;
  internalNotes?: CustomerMemoryNote[];
  referencePhotos?: CustomerMemoryPhoto[];
  appointmentIds?: string[];
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: 'trialing' | 'active' | 'past_due' | 'cancelled' | 'expired' | 'payment_failed' | 'pending';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  cancelAtPeriodEnd?: boolean;
  paymentProviderCustomerId?: string;
  paymentProviderSubscriptionId?: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  provider: string;
  providerPaymentId: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  tenantId?: string;
  userId?: string;
  customerId?: string;
  user_name: string;
  user_email: string;
  serviceId: string;
  staffId: string;
  date: string; // ISO Date string YYYY-MM-DD
  time: string; // HH:mm
  status: 'confirmed' | 'cancelled' | 'cancelled_by_customer' | 'cancelled_by_salon' | 'completed' | 'no_show';
  notes?: string;
  cancelReason?: string;
  cancelledAt?: string;
  cancelledBy?: 'customer' | 'salon' | 'system';
  createdAt: string;
  syncedToGoogle: boolean;
  phone?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Plan {
  id: string;
  name: string;
  name_tr: string;
  description_en: string;
  description_tr: string;
  monthlyPrice: number;
  setupFee?: number;
  staffLimit: number; // 0 means unlimited
  serviceLimit: number;
  trialEnabled?: boolean;
  trialDays?: number;
  providerProductReferenceCode?: string;
  providerPlanReferenceCodeMonthly?: string;
  providerPlanReferenceCodeAnnual?: string;
  features: {
    customerMemory: boolean;
    customerPortal: boolean;
    referralCampaigns: boolean;
    reports: boolean;
    aiRecommendation: boolean;
    aiVisualization: boolean;
    aiMonthlyQuota: number;
    customDomain: boolean;
    prioritySupport: boolean;
  };
  isActive: boolean;
  isRecommended: boolean;
}

export interface ReferralCampaign {
  id: string;
  tenantId: string | 'global';
  campaignType: 'customer_referral' | 'business_referral';
  title: string;
  description: string;
  rewardType: 'discount' | 'credit' | 'free_month' | 'custom';
  rewardValue: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  maxUses?: number;
  createdBy: 'super_admin' | 'salon_owner';
}

export interface ReferralCode {
  id: string;
  code: string;
  campaignId: string;
  referrerType: 'customer' | 'tenant';
  referrerId: string;
  usageCount: number;
  status: 'active' | 'inactive';
}

export interface ReferralLead {
  id: string;
  campaignId: string;
  referralCode: string;
  leadName: string;
  leadPhone?: string;
  leadEmail?: string;
  status: 'pending' | 'converted' | 'rejected';
  createdAt: string;
}

export const SERVICES: Service[] = [
  { 
    id: 'srv_1', 
    name: "Men's Haircut", 
    name_tr: 'Saç Kesimi', 
    duration: 45, 
    price: 300,
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'srv_2', 
    name: 'Beard Trim & Shape', 
    name_tr: 'Sakal Tıraşı & Şekillendirme', 
    duration: 30, 
    price: 200,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'srv_3', 
    name: 'Manicure & Pedicure', 
    name_tr: 'Manikür & Pedikür', 
    duration: 60, 
    price: 500,
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'srv_4', 
    name: 'Hair Prosthesis', 
    name_tr: 'Protez Saç', 
    duration: 120, 
    price: 3500,
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'srv_5',
    name: 'Laser Epilation',
    name_tr: 'Lazer Epilasyon',
    duration: 45,
    price: 800,
    image: 'https://images.unsplash.com/photo-1555820585-c5ae44394b79?auto=format&fit=crop&w=800&q=80'
  }
];

export const BUSINESS_HOURS = {
  start: 9, // 09:00
  end: 21, // 21:00
  interval: 45, // minutes (adjusted for barber slots)
};