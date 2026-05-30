import { dataProvider } from './dataProvider';
import { supabase } from './supabaseClient';
import { Appointment } from '../types';

export const getAppointmentsKey = (tenantId: string) => `randapp:${tenantId}:appointments`;

const isSupabaseMode = () => { try { return (import.meta as any).env?.VITE_DATA_MODE === 'supabase'; } catch(e) { return false; } };

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
  
  const key = getAppointmentsKey(tenantId);
  const existingRecords = await dataProvider.getList<Appointment>(key);
  
  if (!existingRecords || existingRecords.length === 0) {
    const isSeeded = localStorage.getItem(`randapp:${tenantId}:appointments_seeded`) === 'true';
    if (!isSeeded) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const toISODate = (d: Date) => d.toISOString().split('T')[0];

      const seededAppointments: Appointment[] = [
        {
          id: 'apt_demo_1', tenantId, customerId: 'cust_demo_1', user_name: 'Ahmet Yılmaz', user_email: 'ahmet@example.com', phone: '+90 555 123 4567',
          serviceId: 'srv_1', staffId: 'staff_1', date: toISODate(today), time: '10:00', status: 'confirmed', createdAt: yesterday.toISOString(), syncedToGoogle: false
        },
        {
          id: 'apt_demo_2', tenantId, customerId: 'cust_demo_2', user_name: 'Mehmet Demir', user_email: 'mehmet@example.com', phone: '+90 555 987 6543',
          serviceId: 'srv_2', staffId: 'staff_2', date: toISODate(today), time: '14:30', status: 'confirmed', createdAt: yesterday.toISOString(), syncedToGoogle: false
        },
        {
          id: 'apt_demo_3', tenantId, customerId: 'cust_demo_3', user_name: 'Ayşe Kaya', user_email: 'ayse@example.com', phone: '+90 555 333 2211',
          serviceId: 'srv_3', staffId: 'staff_1', date: toISODate(tomorrow), time: '11:00', status: 'confirmed', createdAt: today.toISOString(), syncedToGoogle: false
        },
        {
          id: 'apt_demo_4', tenantId, customerId: 'cust_demo_4', user_name: 'Fatma Çelik', user_email: 'fatma@example.com', phone: '+90 555 444 5566',
          serviceId: 'srv_5', staffId: 'staff_1', date: toISODate(yesterday), time: '15:00', status: 'completed', createdAt: today.toISOString(), syncedToGoogle: false
        },
         {
          id: 'apt_demo_5', tenantId, customerId: 'cust_demo_5', user_name: 'Ali Vefa', user_email: 'ali@example.com', phone: '+90 555 111 2222',
          serviceId: 'srv_4', staffId: 'staff_3', date: toISODate(tomorrow), time: '16:00', status: 'cancelled_by_customer', cancelReason: 'İşim çıktı', cancelledAt: today.toISOString(), cancelledBy: 'customer', createdAt: yesterday.toISOString(), syncedToGoogle: false
        }
      ];
      await dataProvider.set(key, seededAppointments);
      localStorage.setItem(`randapp:${tenantId}:appointments_seeded`, 'true');
      return seededAppointments;
    }
  }

  return existingRecords || [];
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
