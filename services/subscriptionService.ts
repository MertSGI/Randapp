import { supabase } from './supabaseClient';
import { dataProvider } from './dataProvider';
import { PRICING_PLANS, PricingPlan } from './planService';

export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled' | 'suspended';

export interface TenantSubscription {
  tenantId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface TenantUsage {
  staffCount: number;
  serviceCount: number;
  monthlyAppointmentsCount: number;
}

export const subscriptionService = {
  async getCurrentSubscription(tenantId: string): Promise<TenantSubscription | null> {
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
    
    if (mode === 'supabase') {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('tenant_id', tenantId)
        .maybeSingle();
      if (error) {
        console.error("Error fetching subscription:", error);
        return null; // fallback or handle error
      }
      if (data) {
        return {
          tenantId: data.tenant_id,
          planId: data.plan_id,
          status: data.status,
          currentPeriodEnd: data.current_period_end,
          cancelAtPeriodEnd: data.cancel_at_period_end
        };
      }
      return null;
    }

    // Mock Mode
    return {
      tenantId,
      planId: 'professional',
      status: 'active',
      currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      cancelAtPeriodEnd: false
    };
  },

  async getPlanForTenant(tenantId: string): Promise<PricingPlan | null> {
    const sub = await this.getCurrentSubscription(tenantId);
    if (!sub) return PRICING_PLANS['starter']; // Default fallback
    return PRICING_PLANS[sub.planId] || PRICING_PLANS['starter'];
  },

  async getTenantUsage(tenantId: string): Promise<TenantUsage> {
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';

    if (mode === 'supabase') {
      // In a real app, you might do a `count` query on staff, services, and appointments for current month
      // Here we will just provide dummy values to emulate usage in Supabase for now until usage tracking logic is implemented
      return {
        staffCount: 2,
        serviceCount: 5,
        monthlyAppointmentsCount: 120
      };
    }

    // Mock Mode
    const staffList = (await dataProvider.get<any[]>(`randapp:${tenantId}:staff`)) || [];
    const servicesList = (await dataProvider.get<any[]>(`randapp:${tenantId}:services`)) || [];
    
    return {
      staffCount: staffList.length,
      serviceCount: servicesList.length,
      monthlyAppointmentsCount: 45 // Dummy value for mock
    };
  },

  async canAddStaff(tenantId: string): Promise<boolean> {
    const plan = await this.getPlanForTenant(tenantId);
    const usage = await this.getTenantUsage(tenantId);
    if (!plan) return false;
    // Final enforcement MUST be server-side / RLS / Edge function in production!
    return usage.staffCount < plan.maxStaff;
  },

  async canAddService(tenantId: string): Promise<boolean> {
    const plan = await this.getPlanForTenant(tenantId);
    const usage = await this.getTenantUsage(tenantId);
    if (!plan) return false;
    // Final enforcement MUST be server-side!
    return usage.serviceCount < plan.maxServices;
  },

  async canCreateAppointment(tenantId: string): Promise<boolean> {
    const plan = await this.getPlanForTenant(tenantId);
    const usage = await this.getTenantUsage(tenantId);
    if (!plan) return false;
    // Final enforcement MUST be server-side!
    return usage.monthlyAppointmentsCount < plan.maxMonthlyAppointments;
  },

  async isFeatureEnabled(tenantId: string, featureKey: keyof PricingPlan): Promise<boolean> {
    const plan = await this.getPlanForTenant(tenantId);
    if (!plan) return false;
    return Boolean(plan[featureKey]);
  },

  async startCheckout(tenantId: string, planId: string): Promise<void> {
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
    
    if (mode === 'supabase') {
      // Should call a future Edge Function placeholder
      console.log(`[Supabase Mode] Calling POST /functions/v1/create-checkout-session for tenant ${tenantId}, plan ${planId}`);
      alert(`[Demo] Checkout session yaratma isteği sunucuya iletiliyor. (Edge Function) Plan: ${planId}`);
      return;
    }

    // Mock Mode
    console.log(`[Mock Mode] Starting checkout for ${tenantId} -> ${planId}`);
    alert(`[Demo] Ödeme simülasyonu: ${planId} planı için ödeme sayfasına yönlendiriliyorsunuz. (Test Modu)`);
  },

  async openBillingPortal(tenantId: string): Promise<void> {
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
    
    if (mode === 'supabase') {
      // Should call Edge Function
      console.log(`[Supabase Mode] Calling POST /functions/v1/create-billing-portal-session for tenant ${tenantId}`);
      alert(`[Demo] Fatura portalı isteği sunucuya iletiliyor.`);
      return;
    }

    // Mock Mode
    console.log(`[Mock Mode] Opening billing portal for ${tenantId}`);
    alert(`[Demo] Fatura portalı açılıyor. Geçmiş faturalarınız listelenebilir.`);
  }
};
