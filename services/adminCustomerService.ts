import { CustomerProfile, Appointment, CustomerMemoryNote, CustomerMemoryPhoto } from '../types';

const getMockCustomersKey = (tenantId: string) => `mock_tenant_customers_${tenantId}`;

export const normalizeEmail = (email?: string): string => {
  if (!email) return '';
  return email.trim().toLowerCase();
};

export const normalizePhone = (phone?: string): string => {
  if (!phone) return '';
  return phone.replace(/[\s\-\(\)\+]/g, '');
};

export const adminCustomerService = {
  getCustomers(tenantId: string, appointments: Appointment[]): CustomerProfile[] {
    let mockCustomers: CustomerProfile[] = [];
    try {
      const stored = localStorage.getItem(getMockCustomersKey(tenantId));
      if (stored) {
        mockCustomers = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read mock customers from local storage.");
    }

    // Auto-create/derive customers from appointments if they don't exist
    appointments.forEach(apt => {
      const normEmail = normalizeEmail(apt.user_email);
      const normPhone = normalizePhone(apt.phone);
      
      if (normEmail || normPhone) {
        const existing = mockCustomers.find(c => {
          const cEmail = normalizeEmail(c.email);
          const cPhone = normalizePhone(c.phone);
          // Match logic: Prefer phone match if both have it. Else match email.
          if (normPhone && cPhone) {
            return normPhone === cPhone;
          }
          if (normEmail && cEmail) {
            return normEmail === cEmail;
          }
          return false;
        });
        
        if (!existing) {
          mockCustomers.push({
            id: crypto.randomUUID(),
            tenantId,
            fullName: apt.user_name,
            email: apt.user_email || '',
            phone: apt.phone || '',
            createdAt: apt.createdAt,
            firstVisitAt: apt.date,
            lastAppointmentAt: apt.date,
            totalAppointments: 1,
            internalNotes: [],
            referencePhotos: [],
            appointmentIds: [apt.id],
            preferredStaffId: apt.staffId,
            lastServiceId: apt.serviceId
          });
        } else {
          // Update derived fields
          if (!existing.appointmentIds?.includes(apt.id)) {
            existing.appointmentIds = [...(existing.appointmentIds || []), apt.id];
            existing.totalAppointments = (existing.totalAppointments || 1) + 1;
            
            // Check if newer
            if (!existing.lastAppointmentAt || apt.date > existing.lastAppointmentAt) {
              existing.lastAppointmentAt = apt.date;
              existing.preferredStaffId = apt.staffId;
              existing.lastServiceId = apt.serviceId;
            }
          }
        }
      }
    });

    try {
      localStorage.setItem(getMockCustomersKey(tenantId), JSON.stringify(mockCustomers));
    } catch(e) {}

    return mockCustomers;
  },

  updateCustomer(tenantId: string, customerId: string, updates: Partial<CustomerProfile>): CustomerProfile | null {
    let mockCustomers: CustomerProfile[] = [];
    try {
      const stored = localStorage.getItem(getMockCustomersKey(tenantId));
      if (stored) {
        mockCustomers = JSON.parse(stored);
      }
    } catch (e) {}

    const index = mockCustomers.findIndex(c => c.id === customerId);
    if (index === -1) return null;

    mockCustomers[index] = { ...mockCustomers[index], ...updates, updatedAt: new Date().toISOString() };
    
    try {
      localStorage.setItem(getMockCustomersKey(tenantId), JSON.stringify(mockCustomers));
    } catch(e) {}

    return mockCustomers[index];
  },

  addNote(tenantId: string, customerId: string, text: string, createdBy: string = 'Salon'): CustomerMemoryNote | null {
    const note: CustomerMemoryNote = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
      createdBy
    };
    
    let mockCustomers: CustomerProfile[] = [];
    try {
      const stored = localStorage.getItem(getMockCustomersKey(tenantId));
      if (stored) mockCustomers = JSON.parse(stored);
    } catch (e) {}

    const index = mockCustomers.findIndex(c => c.id === customerId);
    if (index !== -1) {
      mockCustomers[index].internalNotes = [...(mockCustomers[index].internalNotes || []), note];
      try {
        localStorage.setItem(getMockCustomersKey(tenantId), JSON.stringify(mockCustomers));
      } catch(e) {}
      return note;
    }
    return null;
  },

  deleteNote(tenantId: string, customerId: string, noteId: string): void {
     let mockCustomers: CustomerProfile[] = [];
      try {
        const stored = localStorage.getItem(getMockCustomersKey(tenantId));
        if (stored) mockCustomers = JSON.parse(stored);
      } catch (e) {}

      const index = mockCustomers.findIndex(c => c.id === customerId);
      if (index !== -1 && mockCustomers[index].internalNotes) {
        mockCustomers[index].internalNotes = mockCustomers[index].internalNotes!.filter(n => n.id !== noteId);
        try {
          localStorage.setItem(getMockCustomersKey(tenantId), JSON.stringify(mockCustomers));
        } catch(e) {}
      }
  },

  addPhoto(tenantId: string, customerId: string, url: string, caption?: string): CustomerMemoryPhoto | null {
    const photo: CustomerMemoryPhoto = {
      id: crypto.randomUUID(),
      url,
      caption,
      createdAt: new Date().toISOString()
    };
    
    let mockCustomers: CustomerProfile[] = [];
    try {
      const stored = localStorage.getItem(getMockCustomersKey(tenantId));
      if (stored) mockCustomers = JSON.parse(stored);
    } catch (e) {}

    const index = mockCustomers.findIndex(c => c.id === customerId);
    if (index !== -1) {
      mockCustomers[index].referencePhotos = [...(mockCustomers[index].referencePhotos || []), photo];
      try {
        localStorage.setItem(getMockCustomersKey(tenantId), JSON.stringify(mockCustomers));
      } catch(e) {}
      return photo;
    }
    return null;
  },
  
  deletePhoto(tenantId: string, customerId: string, photoId: string): void {
     let mockCustomers: CustomerProfile[] = [];
      try {
        const stored = localStorage.getItem(getMockCustomersKey(tenantId));
        if (stored) mockCustomers = JSON.parse(stored);
      } catch (e) {}

      const index = mockCustomers.findIndex(c => c.id === customerId);
      if (index !== -1 && mockCustomers[index].referencePhotos) {
        mockCustomers[index].referencePhotos = mockCustomers[index].referencePhotos!.filter(p => p.id !== photoId);
        try {
          localStorage.setItem(getMockCustomersKey(tenantId), JSON.stringify(mockCustomers));
        } catch(e) {}
      }
  }
};
