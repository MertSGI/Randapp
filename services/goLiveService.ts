import { supabase } from './supabaseClient';
import { dataProvider } from './dataProvider';
import { subscriptionService } from './subscriptionService';
import { provisioningService } from './provisioningService';
import { getServices } from './serviceCatalogService';
import { getStaffList } from './staffService';

export interface GoLiveReadiness {
  canGoLive: boolean;
  canAcceptBookings: boolean;
  blockingReasons: string[];
  checklist: {
    salonInfoCompleted: boolean;
    brandingCompleted: boolean;
    whatsappCompleted: boolean;
    servicesCompleted: boolean;
    staffCompleted: boolean;
    testAppointmentCompleted: boolean;
  };
}

export const goLiveService = {
  async getGoLiveReadiness(tenantId: string): Promise<GoLiveReadiness> {
    const sub = await subscriptionService.getCurrentSubscription(tenantId);
    const provStatus = await provisioningService.getProvisioningStatus(tenantId);
    const services = await getServices(tenantId, { activeOnly: true });
    const staff = await getStaffList(tenantId, { activeOnly: true });

    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
    let goLiveStatus = 'paused';
    
    // Attempt to get go_live_status
    if (mode === 'supabase') {
      const { data } = await supabase.from('tenants').select('go_live_status').eq('id', tenantId).single();
      if (data) goLiveStatus = data.go_live_status || 'paused';
    } else {
      goLiveStatus = await dataProvider.get<string>(`randapp:${tenantId}:go_live_status`) || 'paused';
    }

    const checklist = {
      salonInfoCompleted: true, // simplified for now, should ideally check tenant fields
      brandingCompleted: true,
      whatsappCompleted: true,
      servicesCompleted: services.length > 0,
      staffCompleted: staff.length > 0,
      testAppointmentCompleted: true // mock assumption
    };

    const blockingReasons: string[] = [];
    
    if (sub?.status !== 'active' && sub?.status !== 'trial') {
      blockingReasons.push('Abonelik durumu aktif değil.');
    }
    if (!checklist.servicesCompleted) {
      blockingReasons.push('En az 1 aktif hizmet eklenmesi gerekiyor.');
    }
    if (!checklist.staffCompleted) {
      blockingReasons.push('En az 1 aktif çalışan eklenmesi gerekiyor.');
    }

    const canGoLive = blockingReasons.length === 0;
    const canAcceptBookings = canGoLive && goLiveStatus === 'live';

    return {
      canGoLive,
      canAcceptBookings,
      blockingReasons,
      checklist
    };
  },

  async canTenantAcceptBookings(tenantId: string): Promise<{ allowed: boolean; reason?: string }> {
    const sub = await subscriptionService.getCurrentSubscription(tenantId);
    if (sub?.status === 'suspended' || sub?.status === 'canceled') {
      return { allowed: false, reason: 'Bu salon geçici olarak randevu kabul etmiyor.' };
    }

    const provStatus = await provisioningService.getProvisioningStatus(tenantId);
    if (provStatus === 'onboarding_required' || provStatus === 'setup_in_progress') {
       return { allowed: false, reason: 'Salon kurulumu devam ediyor.' };
    }

    const readiness = await this.getGoLiveReadiness(tenantId);
    
    if (!readiness.canAcceptBookings) {
      if (readiness.blockingReasons.length > 0) {
        return { allowed: false, reason: 'Salon hazırlık aşamasında.' };
      }
      return { allowed: false, reason: 'Online randevu sistemi henüz aktif değil.' };
    }

    return { allowed: true };
  },

  async markReadyForReview(tenantId: string): Promise<void> {
    await provisioningService.markTenantProvisioningStatus(tenantId, 'ready_for_review');
  },

  async markTenantLive(tenantId: string): Promise<void> {
    // Final approval should be server-side / Edge Function for production
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
    if (mode === 'supabase') {
      await supabase.from('tenants').update({ go_live_status: 'live' }).eq('id', tenantId);
      await provisioningService.markTenantProvisioningStatus(tenantId, 'live');
    } else {
      await dataProvider.set(`randapp:${tenantId}:go_live_status`, 'live');
      await provisioningService.markTenantProvisioningStatus(tenantId, 'live');
    }
  },

  async markTenantPaused(tenantId: string): Promise<void> {
    const mode = (import.meta as any).env.VITE_DATA_MODE || 'mock';
    if (mode === 'supabase') {
      await supabase.from('tenants').update({ go_live_status: 'paused' }).eq('id', tenantId);
    } else {
      await dataProvider.set(`randapp:${tenantId}:go_live_status`, 'paused');
    }
  },

  async getGoLiveBlockingReasons(tenantId: string): Promise<string[]> {
    const readiness = await this.getGoLiveReadiness(tenantId);
    return readiness.blockingReasons;
  }
};
