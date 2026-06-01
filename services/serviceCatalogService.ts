import { Service } from '../types';
import { createSuccess, createError, MutationResult } from '../utils/mutationResult';
import { getCatalogRepository } from './repositories';

export const getServices = async (tenantId: string, options?: { activeOnly?: boolean }): Promise<Service[]> => {
  return getCatalogRepository().listServices(tenantId, options);
};

export const createService = async (tenantId: string, service: Omit<Service, 'id' | 'tenantId'>): Promise<Service> => {
  return getCatalogRepository().createService(tenantId, service);
};

export const updateService = async (tenantId: string, serviceId: string, updates: Partial<Service>): Promise<Service | null> => {
  return getCatalogRepository().updateService(serviceId, updates);
};

export const deleteService = async (tenantId: string, serviceId: string): Promise<MutationResult<void>> => {
  try {
    // In local mode, we should ideally check for appointments but for now we just deleteOrDeactivate
    // To match repository abstraction, we let the repository decide or do deactivate
    const success = await getCatalogRepository().deleteOrDeactivateService(serviceId);
    return success ? createSuccess('deleted') : createError('deleted', 'action_failed');
  } catch (err) {
    return createError('deleted', 'action_failed');
  }
};

