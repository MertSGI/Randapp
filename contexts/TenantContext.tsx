import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Tenant, TenantBranding } from '../types';

interface TenantContextType {
  tenant: Tenant | null;
  branding: TenantBranding | null;
  isLoadingTenant: boolean;
  tenantStatus: 'active' | 'not_found' | 'suspended';
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Demo tenant fallback for local development or when default is needed
const DEMO_TENANT: Tenant = {
  id: 'tenant_demo',
  name: 'Demo Salon',
  slug: 'demo',
  subdomain: 'demo',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  branding: {
    tenantId: 'tenant_demo',
    businessName: 'MA Yılmaz Design', // Preserving original name for demo
    tagline: 'Premium Hair & Beauty',
    footerText: 'MA Yılmaz Hair Design. All rights reserved.',
    primaryColor: '#000000',
  }
};

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [branding, setBranding] = useState<TenantBranding | null>(null);
  const [isLoadingTenant, setIsLoadingTenant] = useState(true);
  const [tenantStatus, setTenantStatus] = useState<'active' | 'not_found' | 'suspended'>('active');

  const resolveTenantFromHost = async (hostname: string): Promise<Tenant | null> => {
    // Phase 4: Tenant resolution logic
    // In a real backend, we'd do a fetch to GET /api/tenant/resolve?host=${hostname}
    
    return new Promise(resolve => {
      setTimeout(() => {
        if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
          // Dev fallback
          resolve(DEMO_TENANT);
        } else {
          // For now in frontend demo mode, just return the demo tenant
          // Real logic would parse subdomain or custom domain here
          resolve(DEMO_TENANT);
        }
      }, 500); // Simulate API call
    });
  };

  const loadTenant = async () => {
    setIsLoadingTenant(true);
    try {
      const hostname = window.location.hostname;
      const resolvedTenant = await resolveTenantFromHost(hostname);
      
      if (!resolvedTenant) {
        setTenantStatus('not_found');
        setTenant(null);
        setBranding(null);
      } else if (resolvedTenant.status !== 'active') {
        setTenantStatus('suspended');
        setTenant(resolvedTenant);
        setBranding(resolvedTenant.branding);
      } else {
        setTenantStatus('active');
        setTenant(resolvedTenant);
        setBranding(resolvedTenant.branding);
      }
    } catch (error) {
      console.error("Failed to load tenant", error);
      setTenantStatus('not_found');
    } finally {
      setIsLoadingTenant(false);
    }
  };

  useEffect(() => {
    loadTenant();
  }, []);

  const value = {
    tenant,
    branding,
    isLoadingTenant,
    tenantStatus,
    refreshTenant: loadTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
