import { dataSourceConfig } from '../dataSourceConfig';

// Repository Types
import { BusinessProfileRepository, CatalogRepository } from './types';

// Local Implementations
import { LocalBusinessProfileRepository } from './localBusinessProfileRepository';
import { LocalCatalogRepository } from './localCatalogRepository';

// Supabase Implementations
import { SupabaseBusinessProfileRepository } from './supabaseBusinessProfileRepository';
import { SupabaseCatalogRepository } from './supabaseCatalogRepository';

// Singleton instances for local providers to maintain state easily if needed
const localProviders = {
  businessProfile: new LocalBusinessProfileRepository(),
  catalog: new LocalCatalogRepository(),
};

const supabaseProviders = {
  businessProfile: new SupabaseBusinessProfileRepository(),
  catalog: new SupabaseCatalogRepository(),
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

// As more services are migrated, add their factories here:
// export const getTenantRepository = (): TenantRepository => { ... }
