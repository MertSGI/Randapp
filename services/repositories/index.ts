import { dataSourceConfig } from '../dataSourceConfig';

// Repository Types
import { BusinessProfileRepository, CatalogRepository, BookingRepository, CampaignRepository } from './types';

// Local Implementations
import { LocalBusinessProfileRepository } from './localBusinessProfileRepository';
import { LocalCatalogRepository } from './localCatalogRepository';
import { LocalBookingRepository } from './localBookingRepository';
import { LocalCampaignRepository } from './localCampaignRepository';

// Supabase Implementations
import { SupabaseBusinessProfileRepository } from './supabaseBusinessProfileRepository';
import { SupabaseCatalogRepository } from './supabaseCatalogRepository';
import { SupabaseBookingRepository } from './supabaseBookingRepository';
import { SupabaseCampaignRepository } from './supabaseCampaignRepository';

// Singleton instances for local providers to maintain state easily if needed
const localProviders = {
  businessProfile: new LocalBusinessProfileRepository(),
  catalog: new LocalCatalogRepository(),
  booking: new LocalBookingRepository(),
  campaign: new LocalCampaignRepository(),
};

const rawSupabaseProviders = {
  businessProfile: new SupabaseBusinessProfileRepository(),
  catalog: new SupabaseCatalogRepository(),
  booking: new SupabaseBookingRepository(),
  campaign: new SupabaseCampaignRepository(),
};

// Pilot demo bypass helper proxy
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

const supabaseProviders = {
  businessProfile: createPilotBypassProxy(rawSupabaseProviders.businessProfile, localProviders.businessProfile),
  catalog: createPilotBypassProxy(rawSupabaseProviders.catalog, localProviders.catalog),
  booking: createPilotBypassProxy(rawSupabaseProviders.booking, localProviders.booking),
  campaign: createPilotBypassProxy(rawSupabaseProviders.campaign, localProviders.campaign),
};

/**
 * Returns the currently active BusinessProfileRepository based on the environment data source mode.
 */
export const getBusinessProfileRepository = (): BusinessProfileRepository => {
  if (dataSourceConfig.mode === 'supabase') {
    return supabaseProviders.businessProfile;
  }
  return localProviders.businessProfile;
};

/**
 * Returns the currently active CatalogRepository based on the environment data source mode.
 */
export const getCatalogRepository = (): CatalogRepository => {
  if (dataSourceConfig.mode === 'supabase') {
    return supabaseProviders.catalog;
  }
  return localProviders.catalog;
};

/**
 * Returns the currently active BookingRepository based on the environment data source mode.
 */
export const getBookingRepository = (): BookingRepository => {
  if (dataSourceConfig.mode === 'supabase') {
    return supabaseProviders.booking;
  }
  return localProviders.booking;
};

/**
 * Returns the currently active CampaignRepository based on the environment data source mode.
 */
export const getCampaignRepository = (): CampaignRepository => {
  if (dataSourceConfig.mode === 'supabase') {
    return supabaseProviders.campaign;
  }
  return localProviders.campaign;
};

