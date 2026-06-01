import { supabase } from './supabaseClient';
import { dataProvider } from './dataProvider';
import { planService, PricingPlan } from './planService';

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'cancelled' | 'expired' | 'none';

export interface TenantSubscription {
  tenantId: string;
  planId: string;
  status: SubscriptionStatus;
  trialStart?: string;
  trialEnd?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  paymentProvider?: string;
  providerSubscriptionId?: string;
  lastPaymentStatus?: string;
}

export interface TenantUsage {
  staffCount: number;
  serviceCount: number;
  monthlyAppointmentsCount: number;
  aiUsageCount: number;
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
        return null;
      }
      if (data) {
        return {
          tenantId: data.tenant_id,
          planId: data.plan_id,
          status: data.status,
          trialStart: data.trial_start,
          trialEnd: data.trial_end,
          currentPeriodStart: data.current_period_start,
          currentPeriodEnd: data.current_period_end,
          cancelAtPeriodEnd: data.cancel_at_period_end,
          paymentProvider: data.provider,
          providerSubscriptionId: data.provider_subscription_id
        };
      }
      return null;
    }

    // Mock Mode
    const saved = localStorage.getItem(`mock_subscription_${tenantId}`);
    if (saved) {
      return JSON.parse(saved);
    }
    const dataProvSaved = await dataProvider.get<any>(`randapp:${tenantId}:subscription`);
    if (dataProvSaved) {
       return dataProvSaved;
    }
    
    return {
      tenantId,
      planId: 'professional',
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      cancelAtPeriodEnd: false,
      paymentProvider: 'mock'
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
      return {
        staffCount: 2,
        serviceCount: 5,
        monthlyAppointmentsCount: 120,
        aiUsageCount: 42
      };
    }

    // Mock Mode
    const staffList = (await dataProvider.get<any[]>(`randapp:${tenantId}:staff`)) || [];
    const servicesList = (await dataProvider.get<any[]>(`randapp:${tenantId}:services`)) || [];
    const aiUsage = parseInt(localStorage.getItem('mock_ai_usage') || '0', 10);
    
    return {
      staffCount: staffList.length,
      serviceCount: servicesList.length,
      monthlyAppointmentsCount: 45,
      aiUsageCount: aiUsage
    };
  },

  async canAddStaff(tenantId: string): Promise<boolean> {
    const plan = await this.getPlanForTenant(tenantId);
    const usage = await this.getTenantUsage(tenantId);
    if (!plan) return false;
    return usage.staffCount < plan.maxStaff;
  },

  async canAddService(tenantId: string): Promise<boolean> {
    const plan = await this.getPlanForTenant(tenantId);
    const usage = await this.getTenantUsage(tenantId);
    if (!plan) return false;
    return usage.serviceCount < plan.maxServices;
  },

  async canCreateAppointment(tenantId: string): Promise<boolean> {
    const plan = await this.getPlanForTenant(tenantId);
    const usage = await this.getTenantUsage(tenantId);
    if (!plan) return false;
    return usage.monthlyAppointmentsCount < plan.maxMonthlyAppointments;
  },

  async isFeatureEnabled(tenantId: string, featureKey: keyof PricingPlan): Promise<boolean> {
    const plan = await this.getPlanForTenant(tenantId);
    if (!plan) return false;
    return Boolean(plan[featureKey]);
  },

  async startCheckout(tenantId: string, planId: string, customer?: any): Promise<string> {
    const { paymentRunModeService } = await import('./paymentRunModeService');
    const runModeStatus = paymentRunModeService.getStatus();
    
    if (runModeStatus.mode === 'local_dry_run') {
        const simUrl = paymentRunModeService.simulateCheckoutHandoff(tenantId, planId, '');
        
        // Before returning the URL, let's also seed the mock state appropriately if no UI action is taken
        const plan = planService.getPlan(planId);
        if (plan) {
            const mockSub: TenantSubscription = {
                tenantId,
                planId,
                status: 'trialing',
                trialStart: new Date().toISOString(),
                trialEnd: plan.trialDays ? new Date(new Date().setDate(new Date().getDate() + plan.trialDays)).toISOString() : new Date().toISOString(),
                currentPeriodStart: new Date().toISOString(),
                currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
                cancelAtPeriodEnd: false,
                paymentProvider: 'local_dry_run'
            };
            localStorage.setItem(`mock_subscription_${tenantId}`, JSON.stringify(mockSub));
            await dataProvider.set(`randapp:${tenantId}:subscription`, mockSub);
        }
        
        return simUrl;
    }

    if (runModeStatus.mode === 'sandbox_live' || runModeStatus.mode === 'production_live') {
      if (runModeStatus.mode === 'sandbox_live' && !runModeStatus.canRunCheckout) {
          throw {
              isSafeStructure: true,
              message: 'Sistem sandbox testine hazır değil (eksik yapılandırmalar var). Lütfen Super Admin panelini kontrol edin.',
              errorCode: 'SANDBOX_NOT_CONFIGURED',
              raw: { blockers: runModeStatus.missingBlockers }
          };
      }

      try {
        console.log(`[${runModeStatus.mode}] Calling POST /functions/v1/create-checkout-session`);
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
          body: {
            tenantId,
            planId,
            billingCycle: customer?.billingPeriod || 'monthly', // default
            successUrl: `${window.location.origin}/#/admin?tab=kurulum&checkout=success`,
            cancelUrl: `${window.location.origin}/#/admin?tab=abonelik&checkout=cancelled`,
            customer
          }
        });

        if (error) {
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

        if (data?.mode === 'sandbox_not_configured') {
           throw {
             isSafeStructure: true,
             message: data.message || 'Payment provider sandbox is not configured.',
             errorCode: 'SANDBOX_NOT_CONFIGURED',
             raw: data
           };
        }

        if (data?.checkoutUrl) {
          return data.checkoutUrl;
        } else {
          throw {
            isSafeStructure: true,
            message: 'Ödeme oturumu URL döndürmedi. Lütfen sistem yöneticisiyle iletişime geçin.',
            errorCode: 'MISSING_CHECKOUT_URL',
            raw: data
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
    
    return '';
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
