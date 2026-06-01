import { Tenant, User, TenantBranding } from '../types';
import { tenantService } from './tenantService';
import { authService } from './authService';
import { dataProvider } from './dataProvider';
import { TRIAL_CONFIG } from './trialConfigService';

export const DEMO_PILOT_TENANT_ID = 'tenant_pilot_demo';

const createSVGPlaceholder = (text: string, color1: string, color2: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="800" height="600" fill="url(#grad)" />
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="bold" font-size="48" fill="white" opacity="0.9">${text}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const PILOT_TENANT: Tenant = {
  id: DEMO_PILOT_TENANT_ID,
  slug: 'demo',
  name: 'Lumina Güzellik & Kuaför',
  status: 'active',
  publicSiteStatus: 'published',
  verificationStatus: 'approved',
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

const PILOT_BUSINESS_PROFILE = {
    tenantId: DEMO_PILOT_TENANT_ID,
    public_display_name: 'Lumina Güzellik & Kuaför',
    about_text: 'Şehrin merkezinde, kendinizi özel hissedeceğiniz profesyonel saç, cilt ve tırnak bakım stüdyosu. Uzman kadromuzla yanınızdayız.',
    short_description: 'Şehrin en iyi saç tasarım ve bakım stüdyosu.',
    contact_phone: '0555 123 45 67',
    contact_email: 'info@luminaguzellik.local',
    address: 'Atatürk Caddesi, No: 123, Kat: 2',
    city: 'İstanbul',
    district: 'Kadıköy',
    instagram_handle: 'luminaguzellik',
    business_category: 'Güzellik Salonu',
    working_hours: {
      "Monday": "09:00-19:00",
      "Tuesday": "09:00-19:00",
      "Wednesday": "09:00-19:00",
      "Thursday": "09:00-19:00",
      "Friday": "09:00-20:00",
      "Saturday": "09:00-20:00",
      "Sunday": "Kapalı"
    },
    logo_url: createSVGPlaceholder('Lumina', '#1e1b4b', '#4c1d95'),
    cover_images: [
      createSVGPlaceholder('Stüdyo İç Mekan', '#312e81', '#4338ca'),
      createSVGPlaceholder('Saç Tasarım Merkezi', '#4c1d95', '#6d28d9'),
      createSVGPlaceholder('Manikür Masası', '#7c3aed', '#8b5cf6'),
      createSVGPlaceholder('Berber Bölümü', '#1e1b4b', '#3730a3'),
      createSVGPlaceholder('Bekleme Alanı', '#3730a3', '#4f46e5')
    ],
    gallery_images: [
      createSVGPlaceholder('Saç Kesimi', '#1e1b4b', '#3730a3'),
      createSVGPlaceholder('Manikür', '#4338ca', '#4f46e5'),
      createSVGPlaceholder('Saç Boyama', '#4c1d95', '#6d28d9'),
      createSVGPlaceholder('Müşteri Geri Bildirimi', '#312e81', '#4338ca')
    ]
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
  { id: 'srv_1', tenantId: DEMO_PILOT_TENANT_ID, name: 'Saç Kesimi', description: 'Trend modellere uygun kesim', duration: 45, price: 650, categoryId: 'cat_hair', image: createSVGPlaceholder('Saç Kesimi', '#1e1b4b', '#312e81') },
  { id: 'srv_2', tenantId: DEMO_PILOT_TENANT_ID, name: 'Saç Boyama', description: 'Organik boyalarla renklendirme', duration: 120, price: 1800, categoryId: 'cat_hair', image: createSVGPlaceholder('Saç Boyama', '#312e81', '#4338ca') },
  { id: 'srv_3', tenantId: DEMO_PILOT_TENANT_ID, name: 'Fön', description: 'Kalıcı ve hacimli fön', duration: 30, price: 250, categoryId: 'cat_hair', image: createSVGPlaceholder('Fön', '#4338ca', '#4f46e5') },
  { id: 'srv_4', tenantId: DEMO_PILOT_TENANT_ID, name: 'Manikür', description: 'Klasik veya kalıcı oje', duration: 45, price: 400, categoryId: 'cat_nails', image: createSVGPlaceholder('Manikür', '#4c1d95', '#6d28d9') },
];

const PILOT_STAFF = [
  { id: 'stf_1', tenantId: DEMO_PILOT_TENANT_ID, name: 'Elif Yılmaz', role: 'Saç Uzmanı', title: 'Master Saç Stilisti', isAvailable: true, services: ['srv_1', 'srv_2', 'srv_3'], image: createSVGPlaceholder('EY', '#4c1d95', '#7c3aed') },
  { id: 'stf_2', tenantId: DEMO_PILOT_TENANT_ID, name: 'Zeynep Kaya', role: 'Tırnak Uzmanı', title: 'Nail Artist', isAvailable: true, services: ['srv_4'], image: createSVGPlaceholder('ZK', '#4338ca', '#4f46e5') },
  { id: 'stf_3', tenantId: DEMO_PILOT_TENANT_ID, name: 'Ahmet Demir', role: 'Kuaför', title: 'Kuaför / Kesim', isAvailable: true, services: ['srv_1', 'srv_3'], image: createSVGPlaceholder('AD', '#312e81', '#3730a3') },
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
    await dataProvider.set(`randapp:${DEMO_PILOT_TENANT_ID}:profile`, PILOT_BUSINESS_PROFILE);
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
        trialEnd: new Date(new Date().setDate(new Date().getDate() + TRIAL_CONFIG.trialDayCount)).toISOString(),
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
           publicSiteStatus: 'published',
           verificationStatus: 'approved',
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
