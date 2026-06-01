import { createSuccess, createError, MutationResult } from '../utils/mutationResult';
import { TRIAL_CONFIG } from './trialConfigService';

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
  aiVisualizationEnabled: boolean;
  aiMonthlyQuota: number;
  campaignsEnabled: boolean;
  advancedReportsEnabled: boolean;
  whatsappAutomationEnabled: boolean;
  googleCalendarEnabled: boolean;
  supportLevel: 'standard' | 'priority' | 'dedicated';
  referralEligible: boolean;
  isActive: boolean;
  isRecommended: boolean;
  trialDays: number;
  iyzicoProductReferenceCode?: string;
  iyzicoPlanReferenceCodeMonthly?: string;
  iyzicoPlanReferenceCodeAnnual?: string;
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
    aiVisualizationEnabled: false,
    aiMonthlyQuota: 0,
    campaignsEnabled: false,
    advancedReportsEnabled: false,
    whatsappAutomationEnabled: true,
    googleCalendarEnabled: true,
    supportLevel: 'standard',
    referralEligible: false,
    isActive: true,
    isRecommended: false,
    trialDays: TRIAL_CONFIG.trialDayCount,
    iyzicoProductReferenceCode: 'test_product_1',
    iyzicoPlanReferenceCodeMonthly: 'test_plan_monthly_1',
    iyzicoPlanReferenceCodeAnnual: 'test_plan_annual_1'
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
    aiVisualizationEnabled: false,
    aiMonthlyQuota: 50,
    campaignsEnabled: true,
    advancedReportsEnabled: true,
    whatsappAutomationEnabled: true,
    googleCalendarEnabled: true,
    supportLevel: 'priority',
    referralEligible: true,
    isActive: true,
    isRecommended: true,
    trialDays: TRIAL_CONFIG.trialDayCount,
    iyzicoProductReferenceCode: 'test_product_2',
    iyzicoPlanReferenceCodeMonthly: 'test_plan_monthly_2',
    iyzicoPlanReferenceCodeAnnual: 'test_plan_annual_2'
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
    aiVisualizationEnabled: true,
    aiMonthlyQuota: 500,
    campaignsEnabled: true,
    advancedReportsEnabled: true,
    whatsappAutomationEnabled: true,
    googleCalendarEnabled: true,
    supportLevel: 'dedicated',
    referralEligible: true,
    isActive: true,
    isRecommended: false,
    trialDays: TRIAL_CONFIG.trialDayCount,
    iyzicoProductReferenceCode: 'test_product_3',
    iyzicoPlanReferenceCodeMonthly: 'test_plan_monthly_3',
    iyzicoPlanReferenceCodeAnnual: 'test_plan_annual_3'
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
    return JSON.parse(JSON.stringify(DEFAULT_PLANS));
  },
  savePlanInfos(plans: Record<string, PricingPlan>) {
    localStorage.setItem('randapp_plans', JSON.stringify(plans));
  },
  getAllPlans(): PricingPlan[] {
    return Object.values(this.getStoredPlans());
  },
  getActivePlans(): PricingPlan[] {
    return this.getAllPlans().filter(p => p.isActive !== false);
  },
  getPlan(planId: string): PricingPlan | undefined {
    return this.getStoredPlans()[planId];
  },
  updatePlan(planId: string, updates: Partial<PricingPlan>): Promise<MutationResult<void>> {
    return new Promise((resolve) => {
      const plans = this.getStoredPlans();
      if(plans[planId]) {
         plans[planId] = { ...plans[planId], ...updates };
         this.savePlanInfos(plans);
         resolve(createSuccess('updated'));
      } else {
         resolve(createError('updated', 'action_failed'));
      }
    });
  },
  addPlan(plan: PricingPlan): Promise<MutationResult<void>> {
    return new Promise((resolve) => {
      const plans = this.getStoredPlans();
      plans[plan.id] = plan;
      this.savePlanInfos(plans);
      resolve(createSuccess('created'));
    });
  },
  deletePlan(planId: string): Promise<MutationResult<void>> {
    return new Promise((resolve) => {
      const plans = this.getStoredPlans();
      
      if (!plans[planId]) {
         return resolve(createError('deleted', 'action_failed'));
      }
      
      // Default plans shouldn't be hard-deleted as they may break mock dependencies
      if (['starter', 'professional', 'premium'].includes(planId)) {
        plans[planId].isActive = false;
        this.savePlanInfos(plans);
        return resolve(createSuccess('deactivated'));
      }

      delete plans[planId];
      this.savePlanInfos(plans);
      resolve(createSuccess('deleted'));
    });
  },
  calculatePlanPrice(planId: string, billingPeriod: BillingPeriod): number {
    const plan = this.getPlan(planId);
    if (!plan) return 0;
    return billingPeriod === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  }
};
