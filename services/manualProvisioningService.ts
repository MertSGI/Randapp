import { Tenant } from '../types';
import { tenantService } from './tenantService';
import { siteProvisioningService } from './siteProvisioningService';

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

      console.log(`[Manual Provisioning] Provisioned tenant ${tenantId} via manual offline process`);
      return { success: true, tenantId };

    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
};
