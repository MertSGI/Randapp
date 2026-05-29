import { dataProvider } from './dataProvider';
import { supabase } from './supabaseClient';
import { Service, SERVICES as DEMO_SERVICES } from '../types';
import { getAppointments } from './appointmentService';
import { createSuccess, createError, MutationResult } from '../utils/mutationResult';

const getServicesKey = (tenantId: string) => `randapp:${tenantId}:services`;

const isSupabaseMode = () => ((import.meta as any).env.VITE_DATA_MODE || 'mock') === 'supabase';

const dbServiceToService = (dbService: any): Service => ({
  id: dbService.id,
  tenantId: dbService.tenant_id,
  name: dbService.name,
  name_tr: dbService.name_tr || '',
  duration: dbService.duration,
  price: dbService.price,
  image: dbService.image || '',
  active: dbService.active ?? true, 
  category: dbService.category || '',
});

export const getServices = async (tenantId: string, options?: { activeOnly?: boolean }): Promise<Service[]> => {
  if (isSupabaseMode()) {
    let query = supabase
      .from('services')
      .select('*')
      .eq('tenant_id', tenantId);
      
    if (options?.activeOnly) {
      query = query.eq('active', true);
    }
      
    const { data, error } = await query;
      
    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }
    return (data || []).map(dbServiceToService);
  }

  const key = getServicesKey(tenantId);
  const existingServices = await dataProvider.getList<Service>(key);
  
  if (!existingServices || existingServices.length === 0) {
    // Seed with demo services if none exist for this tenant
    const seededServices = DEMO_SERVICES.map(s => ({ ...s, tenantId }));
    await dataProvider.set(key, seededServices);
    return options?.activeOnly ? seededServices.filter(s => s.active !== false) : seededServices;
  }
  
  return options?.activeOnly ? existingServices.filter(s => s.active !== false) : existingServices;
};

export const createService = async (tenantId: string, service: Omit<Service, 'id' | 'tenantId'>): Promise<Service> => {
  if (isSupabaseMode()) {
    const { data, error } = await supabase
      .from('services')
      .insert({
        tenant_id: tenantId,
        name: service.name,
        name_tr: service.name_tr,
        duration: service.duration,
        price: service.price,
        image: service.image || null,
        active: service.active ?? true,
        category: service.category || null,
      })
      .select()
      .single();
      
    if (error || !data) {
      console.error('Error creating service:', error);
      throw new Error(error?.message || 'Failed to create service');
    }
    return dbServiceToService(data);
  }

  const key = getServicesKey(tenantId);
  const existingServices = await dataProvider.getList<Service>(key);
  
  const newService: Service = {
    ...service,
    id: `srv_${Date.now()}`,
    tenantId,
  };
  
  await dataProvider.set(key, [...existingServices, newService]);
  return newService;
};

export const updateService = async (tenantId: string, serviceId: string, updates: Partial<Service>): Promise<Service | null> => {
  if (isSupabaseMode()) {
    const { data, error } = await supabase
      .from('services')
      .update({
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.name_tr !== undefined && { name_tr: updates.name_tr }),
        ...(updates.duration !== undefined && { duration: updates.duration }),
        ...(updates.price !== undefined && { price: updates.price }),
        ...(updates.image !== undefined && { image: updates.image }),
        ...(updates.active !== undefined && { active: updates.active }),
        ...(updates.category !== undefined && { category: updates.category }),
      })
      .eq('id', serviceId)
      .eq('tenant_id', tenantId)
      .select()
      .single();
      
    if (error || !data) {
      console.error('Error updating service:', error);
      return null;
    }
    return dbServiceToService(data);
  }

  const key = getServicesKey(tenantId);
  const existingServices = await dataProvider.getList<Service>(key);
  
  const serviceIndex = existingServices.findIndex((s) => s.id === serviceId);
  if (serviceIndex === -1) return null;
  
  const updatedService = { ...existingServices[serviceIndex], ...updates };
  existingServices[serviceIndex] = updatedService;
  
  await dataProvider.set(key, existingServices);
  return updatedService;
};

export const deleteService = async (tenantId: string, serviceId: string): Promise<MutationResult<void>> => {
  if (isSupabaseMode()) {
    // Check if appointments use this service
    const { data: apts } = await supabase.from('appointments').select('id').eq('service_id', serviceId).eq('tenant_id', tenantId).limit(1);
    
    if (apts && apts.length > 0) {
       const { error: updErr } = await supabase.from('services').update({ active: false }).eq('id', serviceId);
       if (updErr) return createError('deactivated', 'action_failed');
       return createSuccess('deactivated');
    }

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId)
      .eq('tenant_id', tenantId);
      
    if (error) {
      console.error('Error deleting service:', error);
      return createError('deleted', 'action_failed');
    }
    return createSuccess('deleted');
  }

  const key = getServicesKey(tenantId);
  const existingServices = await dataProvider.getList<Service>(key);
  
  const allAppointments = await getAppointments(tenantId);
  const hasAppointments = allAppointments.some(a => a.serviceId === serviceId);

  if (hasAppointments) {
    const newServicesList = existingServices.map(s => s.id === serviceId ? { ...s, active: false } : s);
    await dataProvider.set(key, newServicesList);
    return createSuccess('deactivated');
  }

  const filtered = existingServices.filter((s) => s.id !== serviceId);
  if (filtered.length === existingServices.length) return createError('deleted', 'action_failed');
  
  await dataProvider.set(key, filtered);
  return createSuccess('deleted');
};
