export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  setupFee: number;
  currency: string;
  maxStaff: number;
  maxServices: number;
  maxMonthlyAppointments: number;
  customDomainEnabled: boolean;
  aiRecommendationsEnabled: boolean;
  campaignsEnabled: boolean;
  advancedReportsEnabled: boolean;
  whatsappAutomationEnabled: boolean;
  googleCalendarEnabled: boolean;
  supportLevel: 'standard' | 'priority' | 'dedicated';
}

export const PRICING_PLANS: Record<string, PricingPlan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 2490,
    setupFee: 7500,
    currency: 'TRY',
    maxStaff: 3,
    maxServices: 10,
    maxMonthlyAppointments: 500,
    customDomainEnabled: false,
    aiRecommendationsEnabled: false,
    campaignsEnabled: false,
    advancedReportsEnabled: false,
    whatsappAutomationEnabled: true,
    googleCalendarEnabled: true,
    supportLevel: 'standard'
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 4990,
    setupFee: 10000,
    currency: 'TRY',
    maxStaff: 10,
    maxServices: 30,
    maxMonthlyAppointments: 2000,
    customDomainEnabled: true,
    aiRecommendationsEnabled: true,
    campaignsEnabled: true,
    advancedReportsEnabled: true,
    whatsappAutomationEnabled: true,
    googleCalendarEnabled: true,
    supportLevel: 'priority'
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 9990,
    setupFee: 15000,
    currency: 'TRY',
    maxStaff: 999, // Unlimited
    maxServices: 999, // Unlimited
    maxMonthlyAppointments: 99999, // Unlimited
    customDomainEnabled: true,
    aiRecommendationsEnabled: true,
    campaignsEnabled: true,
    advancedReportsEnabled: true,
    whatsappAutomationEnabled: true,
    googleCalendarEnabled: true,
    supportLevel: 'dedicated'
  }
};

export const planService = {
  getAllPlans(): PricingPlan[] {
    return Object.values(PRICING_PLANS);
  },
  getPlan(planId: string): PricingPlan | undefined {
    return PRICING_PLANS[planId];
  }
};
