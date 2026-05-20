import { Tenant, TenantBranding } from '../types';
import { dataProvider } from './dataProvider';
import { supabase } from './supabaseClient';

const DEMO_TENANT: Tenant = {
  id: 'tenant_demo',
  slug: 'demo',
  name: 'Nexus Salon',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  branding: {
    tenantId: 'tenant_demo',
    businessName: 'MA Yılmaz Design',
    tagline: 'Premium Hair & Beauty',
    footerText: 'MA Yılmaz Hair Design. All rights reserved.',
    primaryColor: '#000000',
  }
};

export const tenantService = {
  async resolveTenantFromHost(hostname: string): Promise<Tenant | null> {
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
    if (mode === 'supabase') {
      // If local dev, we could fallback, but let's strictly attempt resolution.
      if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
        console.warn('Local environment detected, falling back to demo tenant for testability.');
        return DEMO_TENANT;
      }

      const baseDomain = (import.meta as any).env.VITE_APP_BASE_DOMAIN;
      let querySlug = '';
      let isSubdomain = false;
      
      if (baseDomain && hostname.endsWith(`.${baseDomain}`)) {
        querySlug = hostname.replace(`.${baseDomain}`, '');
        isSubdomain = true;
      }

      const queryParams = isSubdomain 
        ? `slug.eq.${querySlug}` 
        : `custom_domain.eq.${hostname},slug.eq.${hostname.split('.')[0]}`; // Fallback to splitting host if no base domain logic matched

      const { data: tenant, error } = await supabase
        .from('tenants')
        .select('*')
        .or(queryParams)
        .single();
        
      if (tenant) {
        return {
          id: tenant.id,
          slug: tenant.slug,
          name: tenant.name,
          status: tenant.status,
          createdAt: tenant.created_at || new Date().toISOString(),
          updatedAt: tenant.updated_at || new Date().toISOString(),
        } as Tenant;
      }
      
      console.warn('Supabase tenant resolution failed. Tenant not found for host:', hostname);
      return null;
    }
    
    // Fallback or mock behavior
    return DEMO_TENANT;
  },

  async getCurrentTenant(): Promise<Tenant | null> {
    const hostname = window.location.hostname;
    return this.resolveTenantFromHost(hostname);
  },

  async getTenantBranding(tenantId: string): Promise<TenantBranding | null> {
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
    if (mode === 'supabase') {
      const { data: branding, error } = await supabase
        .from('tenant_branding')
        .select('*')
        .eq('tenant_id', tenantId)
        .single();
        
      if (branding) {
        return {
          tenantId: branding.tenant_id,
          businessName: branding.business_name || '',
          tagline: branding.tagline || '',
          footerText: branding.footer_text || '',
          logoUrl: branding.logo_url,
          primaryColor: branding.primary_color,
          secondaryColor: branding.accent_color,
          instagramUrl: branding.instagram_url,
          whatsappNumber: branding.whatsapp_number,
          address: branding.address,
        } as TenantBranding;
      }
      return null;
    }
    
    const key = `randapp:${tenantId}:branding`;
    return dataProvider.get<TenantBranding>(key);
  }
};
