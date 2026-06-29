import { launchModeService } from './launchModeService';
import { getDataSourceMode } from './dataSourceConfig';
import { 
  BusinessProfileRepository, 
  CatalogRepository, 
  BookingRepository, 
  CampaignRepository 
} from './repositories/types';
import { LocalBusinessProfileRepository } from './repositories/localBusinessProfileRepository';
import { LocalCatalogRepository } from './repositories/localCatalogRepository';
import { LocalBookingRepository } from './repositories/localBookingRepository';
import { LocalCampaignRepository } from './repositories/localCampaignRepository';
import { SupabaseBusinessProfileRepository } from './repositories/supabaseBusinessProfileRepository';
import { SupabaseCatalogRepository } from './repositories/supabaseCatalogRepository';
import { SupabaseBookingRepository } from './repositories/supabaseBookingRepository';
import { SupabaseCampaignRepository } from './repositories/supabaseCampaignRepository';

// Singletons
const localBusinessProfile = new LocalBusinessProfileRepository();
const localCatalog = new LocalCatalogRepository();
const localBooking = new LocalBookingRepository();
const localCampaign = new LocalCampaignRepository();

const supabaseBusinessProfile = new SupabaseBusinessProfileRepository();
const supabaseCatalog = new SupabaseCatalogRepository();
const supabaseBooking = new SupabaseBookingRepository();
const supabaseCampaign = new SupabaseCampaignRepository();

// Proxy helper for pilot demo bypass
const createPilotBypassProxy = <T extends object>(supabaseImpl: T, localImpl: T): T => {
  return new Proxy(supabaseImpl, {
    get(target, prop, receiver) {
      const originalMethod = Reflect.get(target, prop, receiver);
      if (typeof originalMethod === 'function') {
        return function(this: any, ...args: any[]) {
          let isPilot = false;
          try {
            const activeTenantId = localStorage.getItem('lari_active_tenant_id');
            const inPilotDemo = localStorage.getItem('lari_in_pilot_demo') === 'true';
            const hashPilot = window.location.hash.includes('tenant_pilot_demo') || window.location.hash.includes('pilot/customer');
            const pathPilot = window.location.pathname.includes('tenant_pilot_demo') || window.location.pathname.includes('pilot/customer');
            
            isPilot = activeTenantId === 'tenant_pilot_demo' || 
                      inPilotDemo || 
                      hashPilot || 
                      pathPilot || 
                      args.includes('tenant_pilot_demo');
          } catch (e) {
            // safe fallback
          }
          if (isPilot) {
            const localMethod = Reflect.get(localImpl, prop);
            if (typeof localMethod === 'function') {
              return localMethod.apply(localImpl, args);
            }
          }
          return originalMethod.apply(this, args);
        };
      }
      return originalMethod;
    }
  });
};

const proxiedSupabaseBusinessProfile = createPilotBypassProxy(supabaseBusinessProfile, localBusinessProfile);
const proxiedSupabaseCatalog = createPilotBypassProxy(supabaseCatalog, localCatalog);
const proxiedSupabaseBooking = createPilotBypassProxy(supabaseBooking, localBooking);
const proxiedSupabaseCampaign = createPilotBypassProxy(supabaseCampaign, localCampaign);

export const repositoryFactory = {
  getBusinessProfileRepository(): BusinessProfileRepository {
    const launchMode = launchModeService.getCurrentLaunchMode();
    const dataMode = getDataSourceMode();

    if (launchModeService.requiresPersistentDatabase(launchMode) || dataMode === 'supabase') {
      if (dataMode !== 'supabase') {
        throw new Error('Supabase repository required for paymentless production: businessProfile');
      }
      return proxiedSupabaseBusinessProfile;
    }
    return localBusinessProfile;
  },

  getCatalogRepository(): CatalogRepository {
    const launchMode = launchModeService.getCurrentLaunchMode();
    const dataMode = getDataSourceMode();

    if (launchModeService.requiresPersistentDatabase(launchMode) || dataMode === 'supabase') {
      if (dataMode !== 'supabase') {
        throw new Error('Supabase repository required for paymentless production: catalog');
      }
      return proxiedSupabaseCatalog;
    }
    return localCatalog;
  },

  getBookingRepository(): BookingRepository {
    const launchMode = launchModeService.getCurrentLaunchMode();
    const dataMode = getDataSourceMode();

    if (launchModeService.requiresPersistentDatabase(launchMode) || dataMode === 'supabase') {
      if (dataMode !== 'supabase') {
        throw new Error('Supabase repository required for paymentless production: booking');
      }
      return proxiedSupabaseBooking;
    }
    return localBooking;
  },

  getCampaignRepository(): CampaignRepository {
    const launchMode = launchModeService.getCurrentLaunchMode();
    const dataMode = getDataSourceMode();

    if (launchModeService.requiresPersistentDatabase(launchMode) || dataMode === 'supabase') {
      if (dataMode !== 'supabase') {
        throw new Error('Supabase repository required for paymentless production: campaign');
      }
      return proxiedSupabaseCampaign;
    }
    return localCampaign;
  }
};
