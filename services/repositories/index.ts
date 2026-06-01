import { dataSourceConfig } from '../dataSourceConfig';

// Repository Types
import { BusinessProfileRepository, CatalogRepository, BookingRepository } from './types';

// Local Implementations
import { LocalBusinessProfileRepository } from './localBusinessProfileRepository';
import { LocalCatalogRepository } from './localCatalogRepository';
import { LocalBookingRepository } from './localBookingRepository';

// Supabase Implementations
import { SupabaseBusinessProfileRepository } from './supabaseBusinessProfileRepository';
import { SupabaseCatalogRepository } from './supabaseCatalogRepository';
import { SupabaseBookingRepository } from './supabaseBookingRepository';

// Singleton instances for local providers to maintain state easily if needed
const localProviders = {
  businessProfile: new LocalBusinessProfileRepository(),
  catalog: new LocalCatalogRepository(),
  booking: new LocalBookingRepository(),
};

const supabaseProviders = {
  businessProfile: new SupabaseBusinessProfileRepository(),
  catalog: new SupabaseCatalogRepository(),
  booking: new SupabaseBookingRepository(),
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
