import { supabase } from './supabaseClient';

export interface TenantInfo {
  id: string;
  businessName: string | null;
  ownerEmail: string | null;
  domain: string | null;
  created_at: string;
}

export interface TenantFullData {
  tenant: TenantInfo;
  subscriptionStatus: string;
  planId: string;
  setupStatus: string;
  monthlyAppointments: number;
  estimatedRevenue: number;
}

export const superAdminService = {
  async getDashboardData(): Promise<{
    stats: {
      totalSalons: number;
      activeSalons: number;
      trialSalons: number;
      pastDueSalons: number;
      suspendedSalons: number;
      monthlyRecurringRevenue: number;
      setupFees: number;
      awaitingSetup: number;
      liveSalons: number;
    },
    tenants: TenantFullData[]
  }> {
    
    // In a real environment with RLS, the super_admin user must have permissions
    // Here we assume service role or RLS policies permit super_admin to read all.
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';

    if (mode === 'mock') {
      const { dataProvider } = await import('./dataProvider');
      const provStatus1 = await dataProvider.get<string>(`randapp:mock_tenant_1:provisioning_status`) || 'live';
      const provStatus2 = await dataProvider.get<string>(`randapp:tenant_demo:provisioning_status`) || 'setup_in_progress';
      
      const tenants = [
          {
            tenant: {
              id: 'mock_tenant_1',
              businessName: 'Vibes Hair Studio',
              ownerEmail: 'owner@vibes.com',
              domain: 'vibes.randapp.com',
              created_at: new Date().toISOString()
            },
            subscriptionStatus: 'active',
            planId: 'professional',
            setupStatus: provStatus1,
            monthlyAppointments: 145,
            estimatedRevenue: 45000
          },
          {
            tenant: {
              id: 'tenant_demo',
              businessName: 'Sandbox Salon',
              ownerEmail: 'admin@randapp.com',
              domain: null,
              created_at: new Date().toISOString()
            },
            subscriptionStatus: 'active',
            planId: 'starter',
            setupStatus: provStatus2,
            monthlyAppointments: 12,
            estimatedRevenue: 1200
          }
        ];
        
      return {
        stats: {
          totalSalons: 15,
          activeSalons: 10,
          trialSalons: 3,
          pastDueSalons: 1,
          suspendedSalons: 1,
          monthlyRecurringRevenue: 12500,
          setupFees: 4500,
          awaitingSetup: tenants.filter(t => t.setupStatus !== 'live').length,
          liveSalons: tenants.filter(t => t.setupStatus === 'live').length
        },
        tenants
      };
    }

    // In 'supabase' mode, pull real data (Simplified for MVP, would normally be an Edge Function or complex View)
    // 1. Get tenants
    const { data: tenants, error: tErr } = await supabase.from('tenants').select('*');
    // 2. Get subscriptions
    const { data: subs, error: sErr } = await supabase.from('subscriptions').select('*');
    
    if (tErr || sErr) {
      console.error("Error fetching super admin data", tErr, sErr);
      throw new Error("Veri çekilemedi.");
    }

    const tenantList: TenantFullData[] = (tenants || []).map(t => {
      const sub = subs?.find(s => s.tenant_id === t.id);
      return {
        tenant: {
          id: t.id,
          businessName: t.business_name,
          ownerEmail: t.user_id, // we might need to join auth.users locally or via function
          domain: t.custom_domain,
          created_at: t.created_at
        },
        subscriptionStatus: sub?.status || 'none',
        planId: sub?.plan_id || 'none',
        setupStatus: t.provisioning_status || 'unknown',
        monthlyAppointments: 0, // Requires appointment count aggregation
        estimatedRevenue: 0     // Requires appointment price aggregation
      }
    });

    return {
      stats: {
         totalSalons: tenantList.length,
         activeSalons: tenantList.filter(t => t.subscriptionStatus === 'active').length,
         trialSalons: tenantList.filter(t => t.subscriptionStatus === 'trialing').length,
         pastDueSalons: tenantList.filter(t => t.subscriptionStatus === 'past_due').length,
         suspendedSalons: tenantList.filter(t => t.subscriptionStatus === 'suspended').length,
         monthlyRecurringRevenue: tenantList.filter(t => t.subscriptionStatus === 'active').length * 499, // naive
         setupFees: 0,
         awaitingSetup: tenantList.filter(t => t.setupStatus !== 'live').length,
         liveSalons: tenantList.filter(t => t.setupStatus === 'live').length
      },
      tenants: tenantList
    };
  },

  async approveGoLive(tenantId: string): Promise<boolean> {
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
    if (mode === 'mock') {
       const { dataProvider } = await import('./dataProvider');
       await dataProvider.set(`randapp:${tenantId}:go_live_status`, 'live');
       await dataProvider.set(`randapp:${tenantId}:provisioning_status`, 'live');
       return new Promise(resolve => setTimeout(() => resolve(true), 500));
    }
    const { error } = await supabase.from('tenants').update({ 
      provisioning_status: 'live',
      go_live_status: 'live' // if column exists
    }).eq('id', tenantId);
    if (error) {
       console.error("Super admin live approval failed", error);
       throw error;
    }
    return true;
  },

  async sendBackToSetup(tenantId: string, internalNote: string): Promise<boolean> {
     const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
     if (mode === 'mock') {
       const { dataProvider } = await import('./dataProvider');
       await dataProvider.set(`randapp:${tenantId}:go_live_status`, 'needs_changes');
       await dataProvider.set(`randapp:${tenantId}:provisioning_status`, 'setup_in_progress');
       return new Promise(resolve => setTimeout(() => resolve(true), 500));
     }
     const { error } = await supabase.from('tenants').update({ 
       provisioning_status: 'setup_in_progress',
       go_live_status: 'needs_changes'
     }).eq('id', tenantId);
     if (error) throw error;
     return true;
  },

  async pauseBookings(tenantId: string): Promise<boolean> {
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
     if (mode === 'mock') {
       const { dataProvider } = await import('./dataProvider');
       await dataProvider.set(`randapp:${tenantId}:go_live_status`, 'paused');
       return new Promise(resolve => setTimeout(() => resolve(true), 500));
     }
     const { error } = await supabase.from('tenants').update({ 
       go_live_status: 'paused'
     }).eq('id', tenantId);
     if (error) throw error;
     return true;
  }
};
