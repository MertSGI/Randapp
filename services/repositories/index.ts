import { dataSourceConfig } from '../dataSourceConfig';

// Repository Types
import { BusinessProfileRepository } from './types';

// Local Implementations
import { LocalBusinessProfileRepository } from './localBusinessProfileRepository';

// Supabase Implementations
import { SupabaseBusinessProfileRepository } from './supabaseBusinessProfileRepository';

// Singleton instances for local providers to maintain state easily if needed
const localProviders = {
  businessProfile: new LocalBusinessProfileRepository(),
};

const supabaseProviders = {
  businessProfile: new SupabaseBusinessProfileRepository(),
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

// As more services are migrated, add their factories here:
// export const getTenantRepository = (): TenantRepository => { ... }
// export const getCatalogRepository = (): CatalogRepository => { ... }
