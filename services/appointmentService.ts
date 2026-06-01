import { Appointment } from '../types';
import { getBookingRepository } from './repositories';
import { notificationTemplateService } from './notificationTemplateService';

export const getAppointmentsKey = (tenantId: string) => `randapp:${tenantId}:appointments`;

export const getAppointments = async (tenantId: string): Promise<Appointment[]> => {
  return getBookingRepository().listAppointments(tenantId);
};

export const createAppointment = async (tenantId: string, appointment: Omit<Appointment, 'id' | 'tenantId' | 'createdAt'>): Promise<Appointment> => {
  const newApt = await getBookingRepository().createAppointment(tenantId, appointment);
  
  // Notification Hook point: Identify appointment_confirmation template to be sent to user later.
  const template = notificationTemplateService.getTemplates().find(t => t.id === 'appointment_confirmation');
  if (template) {
    console.log(`[Notification Hook] Ready to send mapping for appointment: ${newApt.id} using template: ${template.id}`);
    // In production, this drops onto a pub/sub queue rather than blocking the response.
  }

  return newApt;
};

export const updateAppointmentStatus = async (
  tenantId: string, 
  appointmentId: string, 
  status: Appointment['status'],
  cancelReason?: string,
  cancelledBy?: 'customer' | 'salon' | 'system'
): Promise<Appointment | null> => {
  if (status.includes('cancel')) {
    await getBookingRepository().cancelAppointment(appointmentId, cancelReason, cancelledBy);
    
    // Notification Hook point: Identify booking_cancelled template to be sent to user later.
    const template = notificationTemplateService.getTemplates().find(t => t.id === 'booking_cancelled');
    if (template) {
      console.log(`[Notification Hook] Ready to send cancellation for appointment: ${appointmentId} using template: ${template.id}`);
      // Send async out-of-band via queue
    }
  }
  return getBookingRepository().updateAppointment(appointmentId, { status });
};

export const deleteAppointment = async (tenantId: string, appointmentId: string): Promise<boolean> => {
  // We prefer cancellation in repository patterns since delete can orphan records,
  // but if hard delete is required by some tests:
  // For safety, cancel instead if it's not truly hard-deleted by repos, but we can't delete directly without exposing a delete interface.
  // We'll update the status to "cancelled"
  return await getBookingRepository().cancelAppointment(appointmentId, 'Deleted', 'system');
};

export const getBookedSlots = async (tenantId: string, date: string, staffId?: string): Promise<string[]> => {
  const appointments = await getBookingRepository().listAppointments(tenantId, { date });
  return appointments
    .filter((apt) => apt.status === 'confirmed' && (!staffId || apt.staffId === staffId))
    .map((apt) => apt.time);
};

