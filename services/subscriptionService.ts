import { supabase } from './supabaseClient';
import { dataProvider } from './dataProvider';
import { planService, PricingPlan } from './planService';

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
    let planId = sub ? sub.planId : 'starter';
    const plan = planService.getPlan(planId) || planService.getPlan('starter');
    return plan as PricingPlan;
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

  async startCheckout(tenantId: string, planId: string): Promise<string> {
    const paymentProvider = (import.meta as any).env.VITE_PAYMENT_PROVIDER || 'mock';
    
    if (paymentProvider !== 'mock') {
      try {
        console.log(`[${paymentProvider} Mode] Calling POST /functions/v1/create-checkout-session`);
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
          body: {
            tenantId,
            planId,
            successUrl: `${window.location.origin}/admin?tab=kurulum`,
            cancelUrl: `${window.location.origin}/admin?tab=abonelik`
          }
        });

        if (error) {
           // error.context usually contains the standard HTTP response body from supabase edge functions if handled
           let parsedError = error;
           try {
             if (error.context && typeof error.context.json === 'function') {
                const body = await error.context.json();
                parsedError = body;
             }
           } catch(e) {}
           
           throw {
             isSafeStructure: true,
             message: parsedError?.message || error.message || 'Ödeme oturumu oluşturulamadı. Lütfen sistem yöneticisiyle iletişime geçin.',
             errorCode: parsedError?.errorCode || 'UNKNOWN_CHECKOUT_ERROR',
             raw: parsedError
           };
        }
        
        if (data?.error) {
          throw {
             isSafeStructure: true,
             message: data.message || data.error || 'Ödeme oturumu oluşturulamadı. Lütfen sistem yöneticisiyle iletişime geçin.',
             errorCode: data.errorCode || 'UNKNOWN_CHECKOUT_ERROR',
             raw: data
          };
        }

        if (data?.checkoutUrl) {
          return data.checkoutUrl;
        } else {
          throw {
            isSafeStructure: true,
            message: 'Ödeme oturumu URL döndürmedi. Lütfen sistem yöneticisiyle iletişime geçin.',
            errorCode: 'MISSING_CHECKOUT_URL'
          };
        }
      } catch (err: any) {
        console.error("Checkout session error:", err);
        if (err.isSafeStructure) {
          throw err;
        }
        throw {
          isSafeStructure: true,
          message: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
          errorCode: 'UNEXPECTED_ERROR',
          raw: err
        };
      }
    }

    // Mock Mode
    console.log(`[Mock Mode] Starting checkout for ${tenantId} -> ${planId}`);
    return `https://mock-checkout-url.com/pay/${planId}?tenant=${tenantId}`;
  },

  async openBillingPortal(tenantId: string): Promise<void> {
    const paymentProvider = (import.meta as any).env.VITE_PAYMENT_PROVIDER || 'mock';
    
    if (paymentProvider !== 'mock') {
      try {
        console.log(`[${paymentProvider} Mode] Calling POST /functions/v1/create-billing-portal-session`);
        const { data, error } = await supabase.functions.invoke('create-billing-portal-session', {
          body: {
            tenantId,
            returnUrl: window.location.origin
          }
        });

        if (error) throw error;
        
        if (data?.portalUrl) {
          // Sometimes it might just be the same page with a notification
          if (data.note) alert(data.note);
          if (data.portalUrl.startsWith('http') || data.portalUrl.startsWith('/')) {
              window.location.href = data.portalUrl;
          }
        } else {
          alert('Portal olusturulamadi.');
        }
      } catch (err: any) {
        console.error("Billing portal error:", err);
        alert('Portal başlatılırken bir hata oluştu: ' + err.message);
      }
      return;
    }

    // Mock Mode
    console.log(`[Mock Mode] Opening billing portal for ${tenantId}`);
    alert(`[Demo] Fatura portalı açılıyor. Geçmiş faturalarınız listelenebilir.`);
  }
};
