import { Tenant as GlobalTenant, SalonBusinessProfile, Service, Staff, TimeSlot } from '../../types';

export interface Tenant extends GlobalTenant {
  official_business_name?: string;
  public_display_name?: string;
  owner_user_id?: string;
  category?: string;
  city?: string;
  district?: string;
  phone?: string;
  address?: string;
  instagram_handle?: string;
  subscription_status?: string;
  business_risk_status?: string;
  onboarding_status?: string;
}

export interface TenantRepository {
  listTenants(): Promise<Tenant[]>;
  getTenantById(id: string): Promise<Tenant | null>;
  createTenant(input: Partial<Tenant>): Promise<Tenant>;
  updateTenant(id: string, patch: Partial<Tenant>): Promise<void>;
  setActiveTenant(id: string): void;
  getActiveTenantId(): string | null;
}

export interface BusinessProfileRepository {
  getProfile(tenantId: string): Promise<SalonBusinessProfile | null>;
  updateProfile(tenantId: string, patch: Partial<SalonBusinessProfile>): Promise<SalonBusinessProfile | null>;
  submitForReview(tenantId: string): Promise<void>;
  updatePublicSiteStatus(tenantId: string, status: string): Promise<void>;
}

export interface CatalogRepository {
  listServices(tenantId: string, options?: { activeOnly?: boolean }): Promise<Service[]>;
  getServiceById(serviceId: string): Promise<Service | null>;
  createService(tenantId: string, input: Omit<Service, 'id' | 'tenantId'>): Promise<Service>;
  updateService(serviceId: string, patch: Partial<Service>): Promise<Service | null>;
  deleteOrDeactivateService(serviceId: string): Promise<boolean>;
  
  listStaff(tenantId: string, options?: { activeOnly?: boolean }): Promise<Staff[]>;
  getStaffById(staffId: string): Promise<Staff | null>;
  createStaff(tenantId: string, input: Omit<Staff, 'id' | 'tenantId'>): Promise<Staff>;
  updateStaff(staffId: string, patch: Partial<Staff>): Promise<Staff | null>;
  deleteOrDeactivateStaff(staffId: string): Promise<boolean>;
  
  assignServiceToStaff(staffId: string, serviceId: string): Promise<void>;
  removeServiceFromStaff(staffId: string, serviceId: string): Promise<void>;
  listStaffForService(tenantId: string, serviceId: string): Promise<Staff[]>;
  
  listAvailabilityRules(tenantId: string, staffId?: string): Promise<any[]>;
  updateAvailabilityRule(ruleId: string, patch: any): Promise<void>;
  createAvailabilityRule(tenantId: string, input: any): Promise<any>;
}

export interface BookingRepository {
  listAppointments(tenantId: string): Promise<any[]>;
  createAppointment(input: any): Promise<any>;
  updateAppointment(id: string, patch: any): Promise<void>;
  listCustomers(tenantId: string): Promise<any[]>;
  getCustomerMemory(customerId: string): Promise<any>;
}

export interface SubscriptionRepository {
  getSubscription(tenantId: string): Promise<any>;
  createPendingCheckout(tenantId: string, planId: string): Promise<any>;
  updateSubscriptionStatus(tenantId: string, status: string): Promise<void>;
  listPaymentEvents(tenantId: string): Promise<any[]>;
}

export interface SuperAdminRepository {
  listTenants(): Promise<Tenant[]>;
  listSubscriptions(): Promise<any[]>;
  listPayments(): Promise<any[]>;
  approveTenant(tenantId: string): Promise<void>;
  rejectTenant(tenantId: string, reason: string): Promise<void>;
  suspendTenant(tenantId: string): Promise<void>;
}
