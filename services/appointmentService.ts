import { dataProvider } from './dataProvider';
import { supabase } from './supabaseClient';
import { Appointment } from '../types';

const getAppointmentsKey = (tenantId: string) => `randapp:${tenantId}:appointments`;

const isSupabaseMode = () => ((import.meta as any).env.VITE_DATA_MODE || 'mock') === 'supabase';

const dbAppointmentToAppointment = (dbAppt: any): Appointment => {
  return {
    id: dbAppt.id,
    tenantId: dbAppt.tenant_id,
    customerId: dbAppt.customer_id,
    user_name: dbAppt.user_name,
    user_email: dbAppt.user_email,
    phone: dbAppt.phone || '',
    notes: dbAppt.notes || '',
    serviceId: dbAppt.service_id || '',
    staffId: dbAppt.staff_id || '',
    date: dbAppt.appointment_date,
    time: dbAppt.appointment_time,
    status: dbAppt.status,
    syncedToGoogle: dbAppt.synced_to_google,
    createdAt: dbAppt.created_at,
  };
};

export const getAppointments = async (tenantId: string): Promise<Appointment[]> => {
  if (isSupabaseMode()) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
    return (data || []).map(dbAppointmentToAppointment);
  }
  return dataProvider.getList<Appointment>(getAppointmentsKey(tenantId));
};

export const createAppointment = async (tenantId: string, appointment: Omit<Appointment, 'id' | 'tenantId' | 'createdAt'>): Promise<Appointment> => {
  if (isSupabaseMode()) {
    const dbAppt = {
      tenant_id: tenantId,
      customer_id: appointment.customerId || null,
      staff_id: appointment.staffId || null,
      service_id: appointment.serviceId || null,
      user_name: appointment.user_name,
      user_email: appointment.user_email,
      phone: appointment.phone || null,
      notes: appointment.notes || null,
      appointment_date: appointment.date,
      appointment_time: appointment.time,
      status: appointment.status,
      synced_to_google: appointment.syncedToGoogle || false,
    };
    
    const { data, error } = await supabase
      .from('appointments')
      .insert(dbAppt)
      .select()
      .single();
      
    if (error || !data) {
      console.error('Error creating appointment:', error);
      throw new Error(error?.message || 'Failed to create appointment');
    }
    
    return dbAppointmentToAppointment(data);
  }

  const key = getAppointmentsKey(tenantId);
  const existing = await dataProvider.getList<Appointment>(key);
  
  const newAppointment: Appointment = {
    ...appointment,
    id: `apt_${Date.now()}`,
    tenantId,
    createdAt: new Date().toISOString(),
  };
  
  await dataProvider.set(key, [...existing, newAppointment]);
  return newAppointment;
};

export const updateAppointmentStatus = async (
  tenantId: string, 
  appointmentId: string, 
  status: Appointment['status'],
  cancelReason?: string,
  cancelledBy?: 'customer' | 'salon' | 'system'
): Promise<Appointment | null> => {
  if (isSupabaseMode()) {
    const updatePayload: any = { status };
    if (status.includes('cancel')) {
      updatePayload.cancelled_at = new Date().toISOString();
      if (cancelReason) updatePayload.cancel_reason = cancelReason;
      if (cancelledBy) updatePayload.cancelled_by = cancelledBy;
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updatePayload)
      .eq('id', appointmentId)
      .eq('tenant_id', tenantId)
      .select()
      .single();
      
    if (error || !data) {
      console.error('Error updating appointment:', error);
      return null;
    }
    return dbAppointmentToAppointment(data);
  }

  const key = getAppointmentsKey(tenantId);
  const existing = await dataProvider.getList<Appointment>(key);
  
  const idx = existing.findIndex(a => a.id === appointmentId);
  if (idx === -1) return null;
  
  existing[idx].status = status;
  if (status.includes('cancel')) {
    existing[idx].cancelledAt = new Date().toISOString();
    if (cancelReason) existing[idx].cancelReason = cancelReason;
    if (cancelledBy) existing[idx].cancelledBy = cancelledBy;
  }
  
  await dataProvider.set(key, existing);
  return existing[idx];
};

export const deleteAppointment = async (tenantId: string, appointmentId: string): Promise<boolean> => {
  if (isSupabaseMode()) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId)
      .eq('tenant_id', tenantId);
      
    if (error) {
      console.error('Error deleting appointment:', error);
      return false;
    }
    return true;
  }

  const key = getAppointmentsKey(tenantId);
  const existing = await dataProvider.getList<Appointment>(key);
  
  const filtered = existing.filter(a => a.id !== appointmentId);
  if (filtered.length === existing.length) return false;
  
  await dataProvider.set(key, filtered);
  return true;
};

export const getBookedSlots = async (tenantId: string, date: string, staffId?: string): Promise<string[]> => {
  const appointments = await getAppointments(tenantId);
  return appointments
    .filter((apt) => apt.date === date && apt.status === 'confirmed' && (!staffId || apt.staffId === staffId))
    .map((apt) => apt.time);
};
