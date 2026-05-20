import { Tenant, TenantBranding } from '../types';
import { dataProvider } from './dataProvider';

const DEMO_TENANT: Tenant = {
  id: 'tenant_demo',
  slug: 'demo',
  name: 'Nexus Salon',
  status: 'active',
  branding: {
    tenantId: 'tenant_demo',
    businessName: 'MA Yılmaz Design',
    tagline: 'Premium Hair & Beauty',
    footerText: 'MA Yılmaz Hair Design. All rights reserved.',
    primaryColor: '#000000',
  }
};

export const tenantService = {
  async resolveTenantFromHost(hostname: string): Promise<Tenant> {
    const mode = import.meta.env.VITE_DATA_MODE || 'mock';
    if (mode === 'supabase') {
      // Logic for supabase mode:
      // await supabase.from('tenants').select().or(`custom_domain.eq.${hostname},slug.eq.${subdomain}`).single();
      console.warn('Supabase tenant resolution scaffold working.', hostname);
    }
    
    // Fallback or mock behavior
    return DEMO_TENANT;
  },

  async getCurrentTenant(): Promise<Tenant> {
    const hostname = window.location.hostname;
    return this.resolveTenantFromHost(hostname);
  },

  async getTenantBranding(tenantId: string): Promise<TenantBranding | null> {
    const mode = import.meta.env.VITE_DATA_MODE || 'mock';
    if (mode === 'supabase') {
      // Supabase specific query to tenant_branding
      return null; // Return real branding later
    }
    
    const key = `randapp:${tenantId}:branding`;
    return dataProvider.get<TenantBranding>(key);
  }
};
