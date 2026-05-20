import { apiClient } from './apiClient';
import { Service, SERVICES as DEMO_SERVICES } from '../types';

const getServicesKey = (tenantId: string) => `randapp:${tenantId}:services`;

export const getServices = async (tenantId: string): Promise<Service[]> => {
  const key = getServicesKey(tenantId);
  const existingServices = await apiClient.getList<Service>(key);
  
  if (!existingServices || existingServices.length === 0) {
    // Seed with demo services if none exist for this tenant
    const seededServices = DEMO_SERVICES.map(s => ({ ...s, tenantId }));
    await apiClient.set(key, seededServices);
    return seededServices;
  }
  
  return existingServices;
};

export const createService = async (tenantId: string, service: Omit<Service, 'id' | 'tenantId'>): Promise<Service> => {
  const key = getServicesKey(tenantId);
  const existingServices = await apiClient.getList<Service>(key);
  
  const newService: Service = {
    ...service,
    id: `srv_${Date.now()}`,
    tenantId,
  };
  
  await apiClient.set(key, [...existingServices, newService]);
  return newService;
};

export const updateService = async (tenantId: string, serviceId: string, updates: Partial<Service>): Promise<Service | null> => {
  const key = getServicesKey(tenantId);
  const existingServices = await apiClient.getList<Service>(key);
  
  const serviceIndex = existingServices.findIndex((s) => s.id === serviceId);
  if (serviceIndex === -1) return null;
  
  const updatedService = { ...existingServices[serviceIndex], ...updates };
  existingServices[serviceIndex] = updatedService;
  
  await apiClient.set(key, existingServices);
  return updatedService;
};

export const deleteService = async (tenantId: string, serviceId: string): Promise<boolean> => {
  const key = getServicesKey(tenantId);
  const existingServices = await apiClient.getList<Service>(key);
  
  const filtered = existingServices.filter((s) => s.id !== serviceId);
  if (filtered.length === existingServices.length) return false;
  
  await apiClient.set(key, filtered);
  return true;
};
