import { Tenant, TenantBranding } from '../types';
import { dataProvider } from './dataProvider';
import { supabase } from './supabaseClient';

const DEMO_TENANT: Tenant = {
  id: 'tenant_demo',
  slug: 'demo',
  name: 'Nexus Studio',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  branding: {
    tenantId: 'tenant_demo',
    businessName: 'Nexus Studio',
    tagline: 'Premium Wellness & Style',
    footerText: 'Nexus Studio. All rights reserved.',
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
    
    // In all modes, if we are specifically previewing pilot demo, return it.
    // This allows /pilot -> /#/tenant_pilot_demo flow to work even in production/supabase mode without breaking the publish gate.
    const activeTenantId = localStorage.getItem('lari_active_tenant_id');
    const isPilotDemoRoute = window.location.hash.includes('#/tenant_pilot_demo') || window.location.pathname.includes('/tenant_pilot_demo');
    
    if (isPilotDemoRoute || activeTenantId === 'tenant_pilot_demo') {
        return {
             id: 'tenant_pilot_demo',
             slug: 'tenant_pilot_demo',
             name: 'Lumina Güzellik & Kuaför',
             status: 'active',
             createdAt: new Date().toISOString(),
             updatedAt: new Date().toISOString(),
             verificationStatus: 'approved',
             publicSiteStatus: 'published',
             businessRiskStatus: 'normal',
        } as Tenant;
    }

    // In mock mode, allow local overrides
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
    if (mode === 'mock') {
       if (activeTenantId && activeTenantId !== 'tenant_pilot_demo') {
          const registeredArr = JSON.parse(localStorage.getItem('lari_registered_tenants') || '[]');
          const tenantRecord = registeredArr.find((t: any) => t.id === activeTenantId);
          if (tenantRecord) {
             return {
                id: tenantRecord.id,
                slug: tenantRecord.id, // simplified slug
                name: tenantRecord.businessName,
                status: 'active',
                createdAt: tenantRecord.created_at || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                verificationStatus: tenantRecord.verificationStatus || 'not_submitted',
                publicSiteStatus: tenantRecord.publicSiteStatus || 'draft',
                businessRiskStatus: tenantRecord.businessRiskStatus || 'normal',
             } as Tenant;
          }
       }
    }
    
    return this.resolveTenantFromHost(hostname);
  },

  async getTenantBranding(tenantId: string): Promise<TenantBranding | null> {
    if (tenantId === 'tenant_pilot_demo') {
      const key = `randapp:${tenantId}:branding`;
      return dataProvider.get<TenantBranding>(key);
    }
    
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
  },

  async updateTenantBranding(tenantId: string, updates: Partial<TenantBranding>): Promise<TenantBranding | null> {
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
    
    // Get existing to merge
    const current = await this.getTenantBranding(tenantId) || { tenantId } as TenantBranding;
    const next = { ...current, ...updates };

    if (mode === 'supabase') {
      const { data, error } = await supabase
        .from('tenant_branding')
        .upsert({
          tenant_id: tenantId,
          business_name: next.businessName,
          tagline: next.tagline,
          footer_text: next.footerText,
          logo_url: next.logoUrl,
          primary_color: next.primaryColor,
          accent_color: next.secondaryColor,
          instagram_url: next.instagramUrl,
          whatsapp_number: next.whatsappNumber,
          address: next.address
        }, { onConflict: 'tenant_id' });
        
      if (error) {
        console.error("Error updating branding:", error);
        return null;
      }
      return next;
    }

    const key = `randapp:${tenantId}:branding`;
    await dataProvider.set(key, next);
    return next;
  }
};
