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
  async resolveTenantFromHost(hostname: string): Promise<Tenant> {
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
    if (mode === 'supabase') {
      // Query tenant by custom domain, or if not found (or subdomain is tested), by slug.
      // This is a basic implementation of subdomain/custom domain resolution
      
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select('*')
        .or(`custom_domain.eq.${hostname},slug.eq.${hostname.split('.')[0]}`)
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
      // Fallback for development if configured, otherwise returning a suspended or error state is better.
      // TODO: strictly handle not_found in production
      return {
        ...DEMO_TENANT,
        status: 'suspended'
      };
    }
    
    // Fallback or mock behavior
    return DEMO_TENANT;
  },

  async getCurrentTenant(): Promise<Tenant> {
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
          businessName: DEMO_TENANT.branding?.businessName || '',
          tagline: DEMO_TENANT.branding?.tagline || '',
          footerText: DEMO_TENANT.branding?.footerText || '',
          logoUrl: branding.logo_url,
          primaryColor: branding.primary_color,
          accentColor: branding.accent_color,
        } as TenantBranding; // Coercing shape until types fully match DB
      }
      return null;
    }
    
    const key = `randapp:${tenantId}:branding`;
    return dataProvider.get<TenantBranding>(key);
  }
};
