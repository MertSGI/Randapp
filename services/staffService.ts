import { dataProvider } from './dataProvider';
import { Staff } from '../types';

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

export const getStaffList = async (tenantId: string): Promise<Staff[]> => {
  const key = getStaffKey(tenantId);
  const existingStaff = await dataProvider.getList<Staff>(key);
  
  if (!existingStaff || existingStaff.length === 0) {
    const seededStaff = DEMO_STAFF.map(s => ({ ...s, tenantId }));
    await dataProvider.set(key, seededStaff);
    return seededStaff;
  }
  
  return existingStaff;
};

export const createStaff = async (tenantId: string, staff: Omit<Staff, 'id' | 'tenantId'>): Promise<Staff> => {
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
  const key = getStaffKey(tenantId);
  const existingStaff = await dataProvider.getList<Staff>(key);
  
  const idx = existingStaff.findIndex((s) => s.id === staffId);
  if (idx === -1) return null;
  
  const updatedStaff = { ...existingStaff[idx], ...updates };
  existingStaff[idx] = updatedStaff;
  
  await dataProvider.set(key, existingStaff);
  return updatedStaff;
};

export const deleteStaff = async (tenantId: string, staffId: string): Promise<boolean> => {
  const key = getStaffKey(tenantId);
  const existingStaff = await dataProvider.getList<Staff>(key);
  
  const idx = existingStaff.findIndex((s) => s.id === staffId);
  if (idx === -1) return false;
  
  // Prevent deletion of master designer / owner in demo
  if (existingStaff[idx].id === 'staff_1' || existingStaff[idx].isOwner) {
    return false;
  }
  
  const filtered = existingStaff.filter((s) => s.id !== staffId);
  await dataProvider.set(key, filtered);
  return true;
};
