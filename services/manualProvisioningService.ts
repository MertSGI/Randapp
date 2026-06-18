import { Tenant } from '../types';
import { tenantService } from './tenantService';
import { siteProvisioningService } from './siteProvisioningService';
import { dataProvider } from './dataProvider';

export interface ManualProvisioningPayload {
  businessName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  planId: string;
  billingSource: 'self_service_checkout' | 'manual_invoice' | 'offline_payment' | 'complimentary' | 'pilot_exception';
  subscriptionStatus: 'pending_checkout' | 'trialing' | 'active' | 'comped' | 'paused';
  freePeriodEndDate?: string;
  discountType?: 'percentage' | 'fixed_amount' | 'free_months';
  discountValue?: number;
  publicSlug: string;
  setupNotes?: string;
  publishStatus: boolean;
  branchCountOverride?: number;
}

export const manualProvisioningService = {
  async provisionTenant(payload: ManualProvisioningPayload): Promise<{ success: boolean; tenantId?: string; error?: string }> {
    try {
      const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
      
      const slugValid = await siteProvisioningService.validateTenantSlug(payload.publicSlug);
      if (!slugValid.isValid) {
        return { success: false, error: slugValid.error };
      }

      const tenantId = 'tenant-' + Date.now().toString() + '-manual';
      
      const setupComplete = payload.publishStatus;

      // In mock mode, we manually insert a tenant-like object
      const newTenant: Partial<Tenant> = {
        id: tenantId,
        name: payload.businessName,
        slug: payload.publicSlug,
        planId: payload.planId as any,
        isPublished: payload.publishStatus,
        setupComplete: setupComplete,
      };

      if (mode === 'supabase') {
         console.warn("Manual provisioning in Supabase is not fully implemented in frontend. Requires Edge function.");
         return { success: false, error: 'Supabase mode requires backend API for manual provisioning to ensure safety.' };
      }

      await tenantService.updateTenant(tenantId, newTenant);

      // Create and save proper subscription for the manually provisioned tenant
      const subscriptionRecord = {
        tenantId,
        planId: payload.planId,
        status: payload.subscriptionStatus === 'comped' ? 'active' : payload.subscriptionStatus,
        trialStart: new Date().toISOString(),
        trialEnd: payload.freePeriodEndDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: payload.freePeriodEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
        paymentProvider: payload.billingSource,
        discountType: payload.discountType,
        discountValue: payload.discountValue,
        setupNotes: payload.setupNotes
      };

      // Set in both local storage and dataProvider to ensure perfect retrieval
      localStorage.setItem(`mock_subscription_${tenantId}`, JSON.stringify(subscriptionRecord));
      await dataProvider.set(`randapp:${tenantId}:subscription`, subscriptionRecord);

      console.log(`[Manual Provisioning] Provisioned tenant ${tenantId} with plan ${payload.planId} via ${payload.billingSource}`);
      return { success: true, tenantId };

    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
};
