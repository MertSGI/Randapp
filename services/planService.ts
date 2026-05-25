export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  annualDiscountPercent: number;
  setupFee: number;
  currency: string;
  maxStaff: number;
  maxServices: number;
  maxMonthlyAppointments: number;
  customDomainEnabled: boolean;
  includedSubdomain: boolean;
  customComDomainIncluded: boolean;
  aiRecommendationsEnabled: boolean;
  campaignsEnabled: boolean;
  advancedReportsEnabled: boolean;
  whatsappAutomationEnabled: boolean;
  googleCalendarEnabled: boolean;
  supportLevel: 'standard' | 'priority' | 'dedicated';
  referralEligible: boolean;
}

export type BillingPeriod = 'monthly' | 'annual';

export const DEFAULT_PLANS: Record<string, PricingPlan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 2490,
    annualPrice: 2490 * 12 * 0.8, // 20% discount
    annualDiscountPercent: 20,
    setupFee: 7500,
    currency: 'TRY',
    maxStaff: 3,
    maxServices: 10,
    maxMonthlyAppointments: 500,
    customDomainEnabled: false,
    includedSubdomain: true,
    customComDomainIncluded: false,
    aiRecommendationsEnabled: false,
    campaignsEnabled: false,
    advancedReportsEnabled: false,
    whatsappAutomationEnabled: true,
    googleCalendarEnabled: true,
    supportLevel: 'standard',
    referralEligible: false
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 4990,
    annualPrice: 4990 * 12 * 0.8, // 20% discount
    annualDiscountPercent: 20,
    setupFee: 10000,
    currency: 'TRY',
    maxStaff: 10,
    maxServices: 30,
    maxMonthlyAppointments: 2000,
    customDomainEnabled: true,
    includedSubdomain: true,
    customComDomainIncluded: true,
    aiRecommendationsEnabled: true,
    campaignsEnabled: true,
    advancedReportsEnabled: true,
    whatsappAutomationEnabled: true,
    googleCalendarEnabled: true,
    supportLevel: 'priority',
    referralEligible: true
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 9990,
    annualPrice: 9990 * 12 * 0.8, // 20% discount
    annualDiscountPercent: 20,
    setupFee: 15000,
    currency: 'TRY',
    maxStaff: 999, // Unlimited
    maxServices: 999, // Unlimited
    maxMonthlyAppointments: 99999, // Unlimited
    customDomainEnabled: true,
    includedSubdomain: true,
    customComDomainIncluded: true,
    aiRecommendationsEnabled: true,
    campaignsEnabled: true,
    advancedReportsEnabled: true,
    whatsappAutomationEnabled: true,
    googleCalendarEnabled: true,
    supportLevel: 'dedicated',
    referralEligible: true
  }
};

export const planService = {
  getStoredPlans(): Record<string, PricingPlan> {
    const raw = localStorage.getItem('randapp_plans');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch(e) {}
    }
    return DEFAULT_PLANS;
  },
  savePlanInfos(plans: Record<string, PricingPlan>) {
    localStorage.setItem('randapp_plans', JSON.stringify(plans));
  },
  getAllPlans(): PricingPlan[] {
    return Object.values(this.getStoredPlans());
  },
  getPlan(planId: string): PricingPlan | undefined {
    return this.getStoredPlans()[planId];
  },
  updatePlan(planId: string, updates: Partial<PricingPlan>): Promise<void> {
    return new Promise((resolve) => {
      const plans = this.getStoredPlans();
      if(plans[planId]) {
         plans[planId] = { ...plans[planId], ...updates };
         this.savePlanInfos(plans);
      }
      resolve();
    });
  },
  calculatePlanPrice(planId: string, billingPeriod: BillingPeriod): number {
    const plan = this.getPlan(planId);
    if (!plan) return 0;
    return billingPeriod === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  }
};
