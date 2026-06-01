import { Tenant, User, TenantBranding } from '../types';
import { tenantService } from './tenantService';
import { authService } from './authService';
import { dataProvider } from './dataProvider';

export const DEMO_PILOT_TENANT_ID = 'tenant_pilot_demo';

const PILOT_TENANT: Tenant = {
  id: DEMO_PILOT_TENANT_ID,
  slug: 'demo',
  name: 'Lumina Güzellik & Kuaför',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  branding: {
    tenantId: DEMO_PILOT_TENANT_ID,
    businessName: 'Lumina Güzellik & Kuaför',
    tagline: 'Kendinizi özel hissedeceğiniz o yer',
    footerText: 'Lumina Güzellik. Tüm hakları saklıdır.',
    primaryColor: '#8b5cf6',
  }
};

const PILOT_USER: User = {
  id: 'user_pilot_owner',
  tenantId: DEMO_PILOT_TENANT_ID,
  name: 'Demo Sahibi',
  email: 'owner@lumina.local',
  role: 'salon_owner',
  active: true,
};

// Realistic mock services and staff
const PILOT_SERVICES = [
  { id: 'srv_1', tenantId: DEMO_PILOT_TENANT_ID, name: 'Saç Kesimi', description: 'Trend modellere uygun kesim', duration: 45, price: 650, categoryId: 'cat_hair' },
  { id: 'srv_2', tenantId: DEMO_PILOT_TENANT_ID, name: 'Saç Boyama', description: 'Organik boyalarla renklendirme', duration: 120, price: 1800, categoryId: 'cat_hair' },
  { id: 'srv_3', tenantId: DEMO_PILOT_TENANT_ID, name: 'Fön', description: 'Kalıcı ve hacimli fön', duration: 30, price: 250, categoryId: 'cat_hair' },
  { id: 'srv_4', tenantId: DEMO_PILOT_TENANT_ID, name: 'Manikür', description: 'Klasik veya kalıcı oje', duration: 45, price: 400, categoryId: 'cat_nails' },
];

const PILOT_STAFF = [
  { id: 'stf_1', tenantId: DEMO_PILOT_TENANT_ID, name: 'Elif Yılmaz', role: 'Saç Uzmanı', isAvailable: true, services: ['srv_1', 'srv_2', 'srv_3'] },
  { id: 'stf_2', tenantId: DEMO_PILOT_TENANT_ID, name: 'Zeynep Kaya', role: 'Tırnak Uzmanı', isAvailable: true, services: ['srv_4'] },
  { id: 'stf_3', tenantId: DEMO_PILOT_TENANT_ID, name: 'Ahmet Demir', role: 'Kuaför', isAvailable: true, services: ['srv_1', 'srv_3'] },
];

const PILOT_CUSTOMERS = [
  { id: 'cus_1', tenantId: DEMO_PILOT_TENANT_ID, name: 'Ayşe T.', phone: '5551234567', notes: 'Boyaya alerjisi var, organik kullanılsın., Kahve ikramını seviyor.', appointmentCount: 4, lastVisit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString() },
  { id: 'cus_2', tenantId: DEMO_PILOT_TENANT_ID, name: 'Deniz K.', phone: '5559876543', notes: 'Hafta sonu sabah saatlerini tercih eder., Asimetrik kesim seviyor.', appointmentCount: 12, lastVisit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
];

// Seed appointments for Today
const todayStr = new Date().toISOString().split('T')[0];

const PILOT_APPOINTMENTS = [
  {
      id: 'app_1',
      tenantId: DEMO_PILOT_TENANT_ID,
      serviceId: 'srv_1',
      staffId: 'stf_1',
      customerName: 'Ayşe T.',
      customerPhone: '5551234567',
      date: todayStr,
      time: '10:00',
      status: 'confirmed',
      notes: 'Zamanında gelecek.'
  },
  {
      id: 'app_2',
      tenantId: DEMO_PILOT_TENANT_ID,
      serviceId: 'srv_4',
      staffId: 'stf_2',
      customerName: 'Burcu Y.',
      customerPhone: '5552223344',
      date: todayStr,
      time: '14:30',
      status: 'pending',
      notes: 'İlk gelişi.'
  }
];

export const pilotDemoService = {
  
  async seedAndEnterDemoContext() {
    // Save previous state to restore later if needed
    const prevTenant = localStorage.getItem('lari_active_tenant_id');
    const prevSession = localStorage.getItem('lari_active_owner_session');
    
    // We do NOT overwrite lari_registered_tenants array, just the active one for the session
    if (prevTenant && prevTenant !== DEMO_PILOT_TENANT_ID) {
       localStorage.setItem('lari_saved_real_tenant_id', prevTenant);
    }
    if (prevSession && !prevSession.includes('user_pilot_owner')) {
       localStorage.setItem('lari_saved_real_session', prevSession);
    }
    
    // Seed Data into dataprovider explicitly for `tenant_pilot_demo`
    await dataProvider.set(`randapp:${DEMO_PILOT_TENANT_ID}:branding`, PILOT_TENANT.branding);
    await dataProvider.set(`randapp:${DEMO_PILOT_TENANT_ID}:services`, PILOT_SERVICES);
    await dataProvider.set(`randapp:${DEMO_PILOT_TENANT_ID}:staff`, PILOT_STAFF);
    await dataProvider.set(`randapp:${DEMO_PILOT_TENANT_ID}:appointments`, PILOT_APPOINTMENTS);
    await dataProvider.set(`randapp:${DEMO_PILOT_TENANT_ID}:customers`, PILOT_CUSTOMERS);
    
    // Seed billing status to pass admin gates
    const mockSub = {
        tenantId: DEMO_PILOT_TENANT_ID,
        planId: 'professional',
        status: 'active',
        trialStart: new Date().toISOString(),
        trialEnd: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        cancelAtPeriodEnd: false,
        paymentProvider: 'local_dry_run'
    };
    await dataProvider.set(`randapp:${DEMO_PILOT_TENANT_ID}:subscription`, mockSub);
    localStorage.setItem(`mock_subscription_${DEMO_PILOT_TENANT_ID}`, JSON.stringify(mockSub));
    
    // Auth and tenant active
    localStorage.setItem('lari_active_tenant_id', DEMO_PILOT_TENANT_ID);
    localStorage.setItem('lari_active_owner_session', JSON.stringify(PILOT_USER));
    localStorage.setItem('lari_in_pilot_demo', 'true');
    
    // Append to registered tenants list only if not exists, but we can also just let it be loaded from session
    const regArr = JSON.parse(localStorage.getItem('lari_registered_tenants') || '[]');
    if (!regArr.some((t: any) => t.id === DEMO_PILOT_TENANT_ID)) {
       regArr.push({
           id: DEMO_PILOT_TENANT_ID,
           businessName: PILOT_TENANT.name,
           email: PILOT_USER.email,
           planId: 'professional',
           status: 'active',
           created_at: new Date().toISOString()
       });
       localStorage.setItem('lari_registered_tenants', JSON.stringify(regArr));
    }
  },

  async exitDemoContext() {
     localStorage.removeItem('lari_in_pilot_demo');
     
     const savedTenant = localStorage.getItem('lari_saved_real_tenant_id');
     if (savedTenant) {
         localStorage.setItem('lari_active_tenant_id', savedTenant);
         localStorage.removeItem('lari_saved_real_tenant_id');
     } else {
         localStorage.removeItem('lari_active_tenant_id');
     }
     
     const savedSession = localStorage.getItem('lari_saved_real_session');
     if (savedSession) {
         localStorage.setItem('lari_active_owner_session', savedSession);
         localStorage.removeItem('lari_saved_real_session');
     } else {
         localStorage.removeItem('lari_active_owner_session');
     }
  },
  
  isPilotDemoActive() {
      return localStorage.getItem('lari_in_pilot_demo') === 'true';
  }
};
