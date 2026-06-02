import { Appointment } from '../types';
import { getBookingRepository } from './repositories';
import { notificationTemplateService } from './notificationTemplateService';
import { customerCampaignService } from './customerCampaignService';

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

  // Booking and referral association hook:
  try {
    const referrals = await customerCampaignService.listCustomerReferrals(tenantId);
    if (referrals && referrals.length > 0) {
      const clientPhone = appointment.phone ? appointment.phone.replace(/\s+/g, '') : '';
      const clientName = appointment.user_name ? appointment.user_name.toLowerCase().trim() : '';
      
      const matchedPendingReferral = referrals.find(r => {
        if (r.status !== 'pending') return false;
        
        const refPhone = r.referredCustomerPhone ? r.referredCustomerPhone.replace(/\s+/g, '') : '';
        if (clientPhone && refPhone && (clientPhone.includes(refPhone) || refPhone.includes(clientPhone))) {
          return true;
        }
        
        const refName = r.referredCustomerName ? r.referredCustomerName.toLowerCase().trim() : '';
        if (clientName && refName && (clientName.includes(refName) || refName.includes(clientName))) {
          return true;
        }
        return false;
      });

      if (matchedPendingReferral) {
        await customerCampaignService.attachReferralToAppointment(matchedPendingReferral.id, newApt.id);
        console.log(`Matched pending referral ${matchedPendingReferral.id} for new appointment ${newApt.id}`);
      }
    }
  } catch (err) {
    console.error('Error auto-associated referral with booking:', err);
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
  
  const updatedApt = await getBookingRepository().updateAppointment(appointmentId, { status });

  // Completion Hook for referrals and reward ledger triggers:
  if (status === 'completed' || status === 'confirmed') {
    try {
      const referrals = await customerCampaignService.listCustomerReferrals(tenantId);
      if (referrals && referrals.length > 0) {
        let matchedReferral = referrals.find(r => r.appointmentId === appointmentId);
        
        if (!matchedReferral) {
          const appointmentDetails = await getBookingRepository().getAppointmentById(appointmentId);
          if (appointmentDetails) {
            const clientPhone = appointmentDetails.phone ? appointmentDetails.phone.replace(/\s+/g, '') : '';
            const clientName = appointmentDetails.user_name ? appointmentDetails.user_name.toLowerCase().trim() : '';
            
            matchedReferral = referrals.find(r => {
              if (r.status !== 'booked') return false;
              
              const refPhone = r.referredCustomerPhone ? r.referredCustomerPhone.replace(/\s+/g, '') : '';
              if (clientPhone && refPhone && (clientPhone.includes(refPhone) || refPhone.includes(clientPhone))) {
                return true;
              }
              const refName = r.referredCustomerName ? r.referredCustomerName.toLowerCase().trim() : '';
              if (clientName && refName && (clientName.includes(refName) || refName.includes(clientName))) {
                return true;
              }
              return false;
            });
          }
        }

        if (matchedReferral && matchedReferral.status !== 'completed' && matchedReferral.status !== 'rewarded') {
          await customerCampaignService.markReferralCompleted(matchedReferral.id);
          console.log(`Automatically completed referral ${matchedReferral.id} on appointment completion ${appointmentId}`);
        }
      }
    } catch (err) {
      console.error('Error auto-completing referral upon appointment status update:', err);
    }
  }

  return updatedApt;
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

