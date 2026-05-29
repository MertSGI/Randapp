import { dataProvider } from './dataProvider';
import { supabase } from './supabaseClient';
import { Staff } from '../types';
import { getAppointments } from './appointmentService';
import { createSuccess, createError, MutationResult } from '../utils/mutationResult';

const getStaffKey = (tenantId: string) => `randapp:${tenantId}:staff`;

// Initial staff provided for backward compatibility / demo purposes
const DEMO_STAFF: Staff[] = [
  {
    id: 'staff_1',
    name: 'Mustafa Ali Yılmaz',
    title: 'Master Designer',
    image: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=200',
    isOwner: true,
  }
];

const isSupabaseMode = () => ((import.meta as any).env.VITE_DATA_MODE || 'mock') === 'supabase';

const dbStaffToStaff = (dbStaff: any): Staff => ({
  id: dbStaff.id,
  tenantId: dbStaff.tenant_id,
  name: dbStaff.name,
  title: dbStaff.title || '',
  image: dbStaff.image || '',
  isOwner: dbStaff.is_owner || false,
  phone: dbStaff.phone || '',
  calendarEmail: dbStaff.calendar_email || '',
  active: dbStaff.active ?? true,
});

export const getStaffList = async (tenantId: string, options?: { activeOnly?: boolean }): Promise<Staff[]> => {
  if (isSupabaseMode()) {
    let query = supabase
      .from('staff')
      .select('*')
      .eq('tenant_id', tenantId);
      
    if (options?.activeOnly) {
      query = query.eq('active', true);
    }
      
    const { data, error } = await query;
      
    if (error) {
      console.error('Error fetching staff list:', error);
      return [];
    }
    return (data || []).map(dbStaffToStaff);
  }

  const key = getStaffKey(tenantId);
  const existingStaff = await dataProvider.getList<Staff>(key);
  
  if (!existingStaff || existingStaff.length === 0) {
    const isSeeded = localStorage.getItem(`randapp:${tenantId}:is_seeded`) === 'true';
    if (isSeeded) {
      return [];
    }
    const seededStaff = DEMO_STAFF.map(s => ({ ...s, tenantId }));
    await dataProvider.set(key, seededStaff);
    localStorage.setItem(`randapp:${tenantId}:is_seeded`, 'true');
    return options?.activeOnly ? seededStaff.filter(s => s.active !== false) : seededStaff;
  }
  
  return options?.activeOnly ? existingStaff.filter(s => s.active !== false) : existingStaff;
};

export const createStaff = async (tenantId: string, staff: Omit<Staff, 'id' | 'tenantId'>): Promise<Staff> => {
  if (isSupabaseMode()) {
    const { data, error } = await supabase
      .from('staff')
      .insert({
        tenant_id: tenantId,
        name: staff.name,
        title: staff.title,
        image: staff.image,
        is_owner: staff.isOwner || false,
        phone: staff.phone || null,
        calendar_email: staff.calendarEmail || null,
      })
      .select()
      .single();
      
    if (error || !data) {
      console.error('Error creating staff:', error);
      throw new Error(error?.message || 'Failed to create staff');
    }
    return dbStaffToStaff(data);
  }

  const key = getStaffKey(tenantId);
  const existingStaff = await dataProvider.getList<Staff>(key);
  
  const newStaff: Staff = {
    ...staff,
    id: `staff_${Date.now()}`,
    tenantId,
  };
  
  await dataProvider.set(key, [...existingStaff, newStaff]);
  return newStaff;
};

export const updateStaff = async (tenantId: string, staffId: string, updates: Partial<Staff>): Promise<Staff | null> => {
  if (isSupabaseMode()) {
    const { data, error } = await supabase
      .from('staff')
      .update({
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.image !== undefined && { image: updates.image }),
        ...(updates.isOwner !== undefined && { is_owner: updates.isOwner }),
        ...(updates.phone !== undefined && { phone: updates.phone }),
        ...(updates.calendarEmail !== undefined && { calendar_email: updates.calendarEmail }),
        ...(updates.active !== undefined && { active: updates.active }),
      })
      .eq('id', staffId)
      .eq('tenant_id', tenantId)
      .select()
      .single();
      
    if (error || !data) {
      console.error('Error updating staff:', error);
      return null;
    }
    return dbStaffToStaff(data);
  }

  const key = getStaffKey(tenantId);
  const existingStaff = await dataProvider.getList<Staff>(key);
  
  const idx = existingStaff.findIndex((s) => s.id === staffId);
  if (idx === -1) return null;
  
  const updatedStaff = { ...existingStaff[idx], ...updates };
  existingStaff[idx] = updatedStaff;
  
  await dataProvider.set(key, existingStaff);
  return updatedStaff;
};

export const deleteStaff = async (tenantId: string, staffId: string): Promise<MutationResult<void>> => {
  if (isSupabaseMode()) {
    // Quick check to prevent owner deletion if that logic is strictly enforced in API
    const { data } = await supabase.from('staff').select('is_owner').eq('id', staffId).single();
    if (data?.is_owner) return createError('deleted', 'owner_cannot_be_deleted');
    
    // Check if staff has appointments
    const { data: apts } = await supabase.from('appointments').select('id').eq('staff_id', staffId).eq('tenant_id', tenantId).limit(1);
    if (apts && apts.length > 0) {
       // Deactivate instead
       const { error: updErr } = await supabase.from('staff').update({ active: false }).eq('id', staffId);
       if (updErr) return createError('deactivated', 'action_failed');
       return createSuccess('deactivated');
    }

    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', staffId)
      .eq('tenant_id', tenantId);
      
    if (error) {
      console.error('Error deleting staff:', error);
      return createError('deleted', 'action_failed');
    }
    return createSuccess('deleted');
  }

  const key = getStaffKey(tenantId);
  const existingStaff = await dataProvider.getList<Staff>(key);
  
  const idx = existingStaff.findIndex((s) => s.id === staffId);
  if (idx === -1) return createError('deleted', 'action_failed');
  
  // Prevent deletion of master designer / owner in demo
  if (existingStaff[idx].id === 'staff_1' || existingStaff[idx].isOwner) {
    return createError('deleted', 'owner_cannot_be_deleted');
  }
  
  const allAppointments = await getAppointments(tenantId);
  const hasAppointments = allAppointments.some(a => a.staffId === staffId);

  if (hasAppointments) {
    // Deactivate instead
    // Note: We need a deep clone if we modify
    const newStaffList = existingStaff.map(s => s.id === staffId ? { ...s, active: false } : s);
    await dataProvider.set(key, newStaffList);
    return createSuccess('deactivated');
  }

  const filtered = existingStaff.filter((s) => s.id !== staffId);
  await dataProvider.set(key, filtered);
  return createSuccess('deleted');
};
