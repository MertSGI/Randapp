import { 
  Appointment, 
  AppointmentAccessToken, 
  AppointmentChangeRequest, 
  BookingPolicy 
 } from '../types';
import { getBookingRepository } from './repositories';
import { communicationEventService } from './communicationEventService';
import { tenantService } from './tenantService';
import { auditLogService } from './auditLogService';

const TOKENS_STORAGE_KEY = 'lari_appointment_tokens';
const REQUESTS_STORAGE_KEY = 'lari_appointment_change_requests';
const POLICY_STORAGE_KEY = 'lari_tenant_booking_policies';

// Default booking policy per Part 5
export const DEFAULT_BOOKING_POLICY: BookingPolicy = {
  cancellationWindowHours: 24,
  allowCustomerCancellation: true,
  allowCustomerRescheduleRequest: true,
  requireOwnerApprovalForReschedule: true,
  maxAdvanceBookingDays: 30,
  minNoticeHours: 2,
  spamProtectionEnabled: true,
  maxBookingsPerPhonePerDay: 3,
  maxBookingsPerIpPerDay: 5,
  blockRepeatedNoShowPhone: true,
  noShowThreshold: 2,
  requireContactConsent: true
};

export const appointmentSelfServiceService = {
  // Helper to load all tokens from localStorage
  getAllTokens(): AppointmentAccessToken[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(TOKENS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse appointment self-service tokens', e);
      return [];
    }
  },

  // Helper to save all tokens to localStorage
  saveAllTokens(tokens: AppointmentAccessToken[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokens));
    }
  },

  // Helper to load all change requests from localStorage
  getAllChangeRequests(): AppointmentChangeRequest[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(REQUESTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse appointment change requests', e);
      return [];
    }
  },

  // Helper to save all change requests to localStorage
  saveAllChangeRequests(requests: AppointmentChangeRequest[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
    }
  },

  // Helper to load booking policy for a tenant
  getBookingPolicy(tenantId: string): BookingPolicy {
    if (typeof window === 'undefined') return DEFAULT_BOOKING_POLICY;
    try {
      const stored = localStorage.getItem(`${POLICY_STORAGE_KEY}_${tenantId}`);
      if (stored) {
        return { ...DEFAULT_BOOKING_POLICY, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to parse booking policy for tenant ' + tenantId, e);
    }
    return DEFAULT_BOOKING_POLICY;
  },

  // Helper to save booking policy for a tenant
  saveBookingPolicy(tenantId: string, policy: Partial<BookingPolicy>): BookingPolicy {
    const current = this.getBookingPolicy(tenantId);
    const updated = { ...current, ...policy };
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${POLICY_STORAGE_KEY}_${tenantId}`, JSON.stringify(updated));
    }
    return updated;
  },

  // Part 3: createAppointmentAccessToken
  createAppointmentAccessToken(
    tenantId: string, 
    appointmentId: string, 
    purpose: AppointmentAccessToken['purpose']
  ): string {
    const tokens = this.getAllTokens();
    
    // Generate secure simulated plain token
    const token = `apt_tok_${Math.random().toString(36).substring(2, 9)}${Math.random().toString(36).substring(2, 9)}`;
    const id = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // 7 days expiration default
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const newToken: AppointmentAccessToken = {
      id,
      tenantId,
      appointmentId,
      tokenHash: token, // local pre-live mode uses plain mapping as tokenHash
      purpose,
      status: 'active',
      expiresAt,
      createdAt: new Date().toISOString()
    };

    tokens.push(newToken);
    this.saveAllTokens(tokens);

    try {
      auditLogService.logAuditEvent({
        tenantId,
        actorType: 'system',
        category: 'customer_self_service',
        severity: 'info',
        action: 'self_service_token_created',
        entityType: 'AppointmentAccessToken',
        entityId: id,
        summary: `Hizmet erişim bağlantı belirteci oluşturuldu: [Amaç: ${purpose}]`,
        safeDetails: {
          tokenId: id,
          appointmentId,
          purpose,
          expiresAt
        }
      });
    } catch (e) {
      console.error('Audit logging for token creation failed:', e);
    }

    return token;
  },

  // Part 3: validateAppointmentAccessToken
  validateAppointmentAccessToken(token: string): boolean {
    const tokens = this.getAllTokens();
    const tokenObj = tokens.find(t => t.tokenHash === token);
    
    if (!tokenObj) return false;
    if (tokenObj.status !== 'active') return false;
    
    const expired = new Date(tokenObj.expiresAt).getTime() < Date.now();
    if (expired) {
      tokenObj.status = 'expired';
      this.saveAllTokens(tokens);
      return false;
    }
    
    return true;
  },

  // Part 3: getAppointmentByAccessToken
  async getAppointmentByAccessToken(token: string): Promise<{ appointment: Appointment; tokenObj: AppointmentAccessToken } | null> {
    if (!this.validateAppointmentAccessToken(token)) return null;
    
    const tokens = this.getAllTokens();
    const tokenObj = tokens.find(t => t.tokenHash === token);
    if (!tokenObj) return null;

    try {
      const appointment = await getBookingRepository().getAppointmentById(tokenObj.appointmentId);
      if (!appointment || appointment.tenantId !== tokenObj.tenantId) return null;
      return { appointment, tokenObj };
    } catch (e) {
      console.error('Error fetching appointment by access token', e);
      return null;
    }
  },

  // Part 3: revokeAppointmentAccessToken
  revokeAppointmentAccessToken(tokenId: string): boolean {
    const tokens = this.getAllTokens();
    const tIndex = tokens.findIndex(t => t.id === tokenId);
    if (tIndex > -1) {
      tokens[tIndex].status = 'revoked';
      this.saveAllTokens(tokens);
      return true;
    }
    return false;
  },

  // Part 3: expireAppointmentAccessTokens
  expireAppointmentAccessTokens(): void {
    const tokens = this.getAllTokens();
    let updated = false;
    tokens.forEach(t => {
      if (t.status === 'active' && new Date(t.expiresAt).getTime() < Date.now()) {
        t.status = 'expired';
        updated = true;
      }
    });
    if (updated) {
      this.saveAllTokens(tokens);
    }
  },

  // Helpers to calculate timing
  getAppointmentDateDetails(aptDate: string, aptTime: string): Date {
    // aptDate comes as YYYY-MM-DD, aptTime as HH:mm
    return new Date(`${aptDate}T${aptTime}:00`);
  },

  isCancellationLate(appointment: Appointment, policy: BookingPolicy): boolean {
    const aptTime = this.getAppointmentDateDetails(appointment.date, appointment.time).getTime();
    const cancelDeadline = aptTime - (policy.cancellationWindowHours * 60 * 60 * 1000);
    return Date.now() > cancelDeadline;
  },

  // Part 3: requestAppointmentCancellation
  async requestAppointmentCancellation(token: string, reason: string): Promise<{ changeRequest?: AppointmentChangeRequest; success: boolean; autoApplied: boolean; message: string }> {
    const validation = await this.getAppointmentByAccessToken(token);
    if (!validation) {
      return { success: false, autoApplied: false, message: 'Geçersiz veya süresi dolmuş bağlantı.' };
    }

    const { appointment, tokenObj } = validation;
    const policy = this.getBookingPolicy(tokenObj.tenantId);

    if (!policy.allowCustomerCancellation) {
      return { success: false, autoApplied: false, message: 'Bu işletme için müşteri iptali devre dışı bırakılmıştır.' };
    }

    const isLate = this.isCancellationLate(appointment, policy);
    
    // Create change request
    const requests = this.getAllChangeRequests();
    const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const newRequest: AppointmentChangeRequest = {
      id,
      tenantId: tokenObj.tenantId,
      appointmentId: appointment.id,
      customerId: appointment.customerId,
      type: 'cancellation',
      status: 'requested',
      reason,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let autoApplied = false;
    let finalMessage = 'İptal talebiniz onay için işletmeye iletilmiştir.';

    // If cancellation is within the free window (not late), we can auto-apply if the tenant settings allow 
    // or auto-apply by default for non-late cancellations.
    if (!isLate) {
      autoApplied = true;
      newRequest.status = 'applied';
      newRequest.reviewedAt = new Date().toISOString();
      newRequest.reviewedBy = 'system';
      
      // Update appointment status in repository
      await getBookingRepository().cancelAppointment(appointment.id, reason, 'customer');
      await getBookingRepository().updateAppointment(appointment.id, { 
        status: 'cancelled_by_customer',
        cancelReason: reason,
        cancelledAt: new Date().toISOString(),
        cancelledBy: 'customer'
      });
      
      // Mark token as used
      tokenObj.status = 'used';
      tokenObj.usedAt = new Date().toISOString();
      
      const tokens = this.getAllTokens();
      const updatedTokens = tokens.map(t => t.id === tokenObj.id ? tokenObj : t);
      this.saveAllTokens(updatedTokens);
      
      finalMessage = 'Randevunuz iptal edilmiştir.';
    } else {
      // Late cancellation is requested for owner review
      finalMessage = 'Randevunuza 24 saatten az süre kaldığı için iptal talebiniz salon onayına gönderilmiştir.';
    }

    requests.push(newRequest);
    this.saveAllChangeRequests(requests);

    try {
      auditLogService.logAuditEvent({
        tenantId: tokenObj.tenantId,
        actorType: 'customer',
        category: 'customer_self_service',
        severity: autoApplied ? 'warning' : 'notice',
        action: autoApplied ? 'appointment_cancelled' : 'appointment_cancellation_requested',
        entityType: 'AppointmentChangeRequest',
        entityId: id,
        summary: autoApplied 
          ? `Müşteri randevuyu kendi iptal etti (${appointment.user_name || 'Müşteri'})`
          : `Müşteri randevu iptal talebi oluşturdu (${appointment.user_name || 'Müşteri'})`,
        safeDetails: {
          requestId: id,
          appointmentId: appointment.id,
          reason,
          autoApplied
        }
      });
    } catch (e) {
      console.error('Audit logging for cancellation request failed:', e);
    }

    // Queue communications outbox events
    try {
      const tenant = await tenantService.getTenantById(tokenObj.tenantId);
      const bizName = tenant?.branding?.businessName || tenant?.name || 'Güzellik Salonu';
      
      communicationEventService.queueCommunicationEvent({
        tenantId: tokenObj.tenantId,
        customerId: appointment.id, // fallback mapping
        appointmentId: appointment.id,
        audience: 'customer',
        channel: 'whatsapp',
        type: autoApplied ? 'booking_cancelled' : 'cancellation_request_created' as any,
        contextArgs: {
          customerName: appointment.user_name || 'Müşteri',
          businessName: bizName,
          serviceName: 'Hizmet',
          date: appointment.date,
          time: appointment.time,
          reason: reason
        }
      });
    } catch (e) {
      console.error('Failed to queue cancellation comms', e);
    }

    return { 
      changeRequest: newRequest, 
      success: true, 
      autoApplied, 
      message: finalMessage 
    };
  },

  // Part 3: requestAppointmentReschedule
  async requestAppointmentReschedule(token: string, requestedDateTime: string, note: string): Promise<{ changeRequest?: AppointmentChangeRequest; success: boolean; message: string }> {
    const validation = await this.getAppointmentByAccessToken(token);
    if (!validation) {
      return { success: false, message: 'Geçersiz veya süresi dolmuş bağlantı.' };
    }

    const { appointment, tokenObj } = validation;
    const policy = this.getBookingPolicy(tokenObj.tenantId);

    if (!policy.allowCustomerRescheduleRequest) {
      return { success: false, message: 'Bu işletme için randevu erteleme/değişiklik talebi devre dışı bırakılmıştır.' };
    }

    const requests = this.getAllChangeRequests();
    const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const newRequest: AppointmentChangeRequest = {
      id,
      tenantId: tokenObj.tenantId,
      appointmentId: appointment.id,
      customerId: appointment.customerId,
      type: 'reschedule',
      status: 'requested',
      requestedDateTime, // Should be "YYYY-MM-DD HH:mm"
      customerNote: note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    requests.push(newRequest);
    this.saveAllChangeRequests(requests);

    try {
      auditLogService.logAuditEvent({
        tenantId: tokenObj.tenantId,
        actorType: 'customer',
        category: 'customer_self_service',
        severity: 'notice',
        action: 'appointment_reschedule_requested',
        entityType: 'AppointmentChangeRequest',
        entityId: id,
        summary: `Müşteri randevu erteleme talebi oluşturdu (${appointment.user_name || 'Müşteri'})`,
        safeDetails: {
          requestId: id,
          appointmentId: appointment.id,
          requestedDateTime,
          note
        }
      });
    } catch (e) {
      console.error('Audit logging for reschedule request failed:', e);
    }

    // Queue communications outbox
    try {
      const tenant = await tenantService.getTenantById(tokenObj.tenantId);
      const bizName = tenant?.branding?.businessName || tenant?.name || 'Güzellik Salonu';
      
      communicationEventService.queueCommunicationEvent({
        tenantId: tokenObj.tenantId,
        customerId: appointment.id,
        appointmentId: appointment.id,
        audience: 'customer',
        channel: 'whatsapp',
        type: 'reschedule_request_created' as any,
        contextArgs: {
          customerName: appointment.user_name || 'Müşteri',
          businessName: bizName,
          date: appointment.date,
          time: appointment.time,
          newDate: requestedDateTime.split(' ')[0],
          newTime: requestedDateTime.split(' ')[1] || '',
          notes: note
        }
      });
    } catch (e) {
      console.error('Failed to queue reschedule request comms', e);
    }

    return {
      changeRequest: newRequest,
      success: true,
      message: 'Randevu değişiklik talebiniz salon onayına iletilmiştir.'
    };
  },

  // Part 3: confirmAppointmentByToken
  async confirmAppointmentByToken(token: string): Promise<boolean> {
    const validation = await this.getAppointmentByAccessToken(token);
    if (!validation) return false;

    const { appointment, tokenObj } = validation;

    try {
      // Confirm the appointment status
      await getBookingRepository().updateAppointment(appointment.id, { 
        status: 'confirmed' 
      });

      // Mark token as used
      tokenObj.status = 'used';
      tokenObj.usedAt = new Date().toISOString();
      const tokens = this.getAllTokens();
      const updatedTokens = tokens.map(t => t.id === tokenObj.id ? tokenObj : t);
      this.saveAllTokens(updatedTokens);

      try {
        auditLogService.logAuditEvent({
          tenantId: tokenObj.tenantId,
          actorType: 'customer',
          category: 'customer_self_service',
          severity: 'info',
          action: 'appointment_confirmed_by_customer',
          entityType: 'Appointment',
          entityId: appointment.id,
          summary: `Randevu müşteri tarafından bağlantı uyarısıyla onaylandı: (${appointment.user_name || 'Müşteri'})`,
          safeDetails: {
            appointmentId: appointment.id,
            tokenId: tokenObj.id
          }
        });
      } catch (ae) {
        console.error('Audit logging for customer confirm failed:', ae);
      }

      const tenant = await tenantService.getTenantById(tokenObj.tenantId);
      const bizName = tenant?.branding?.businessName || tenant?.name || 'Güzellik Salonu';

      // Queue outbox event
      communicationEventService.queueCommunicationEvent({
        tenantId: tokenObj.tenantId,
        customerId: appointment.id,
        appointmentId: appointment.id,
        audience: 'customer',
        channel: 'whatsapp',
        type: 'appointment_confirmed_by_customer' as any,
        contextArgs: {
          customerName: appointment.user_name || 'Müşteri',
          businessName: bizName,
          date: appointment.date,
          time: appointment.time
        }
      });

      return true;
    } catch (e) {
      console.error('Error confirming appointment by token', e);
      return false;
    }
  },

  // Part 3: getSelfServiceReadinessSummary
  getSelfServiceReadinessSummary(tenantId: string) {
    const tokens = this.getAllTokens().filter(t => t.tenantId === tenantId);
    const requests = this.getAllChangeRequests().filter(r => r.tenantId === tenantId);

    return {
      totalTokensGenerated: tokens.length,
      activeTokensCount: tokens.filter(t => t.status === 'active').length,
      totalRequestsCount: requests.length,
      pendingCancellations: requests.filter(r => r.type === 'cancellation' && r.status === 'requested').length,
      pendingReschedules: requests.filter(r => r.type === 'reschedule' && r.status === 'requested').length
    };
  },

  // Admin Actions to review change requests
  async reviewChangeRequest(
    tenantId: string, 
    requestId: string, 
    status: 'approved' | 'rejected', 
    ownerNote?: string
  ): Promise<boolean> {
    const requests = this.getAllChangeRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId && r.tenantId === tenantId);
    if (reqIndex === -1) return false;

    const req = requests[reqIndex];
    if (req.status !== 'requested') return false;

    try {
      const appointment = await getBookingRepository().getAppointmentById(req.appointmentId);
      if (!appointment) return false;

      req.status = status === 'approved' ? 'approved' : 'rejected';
      req.ownerNote = ownerNote;
      req.reviewedAt = new Date().toISOString();
      req.reviewedBy = 'salon_owner';

      const tenant = await tenantService.getTenantById(tenantId);
      const bizName = tenant?.branding?.businessName || tenant?.name || 'Güzellik Salonu';

      if (status === 'approved') {
        if (req.type === 'cancellation') {
          // Cancel appointment
          await getBookingRepository().cancelAppointment(appointment.id, req.reason || 'Müşteri iptal talebi', 'customer');
          await getBookingRepository().updateAppointment(appointment.id, {
            status: 'cancelled_by_customer',
            cancelReason: req.reason || 'Müşteri iptal talebi',
            cancelledAt: new Date().toISOString(),
            cancelledBy: 'customer'
          });
          req.status = 'applied';

          // Queue outbox approval event
          communicationEventService.queueCommunicationEvent({
            tenantId,
            customerId: appointment.id,
            appointmentId: appointment.id,
            audience: 'customer',
            channel: 'whatsapp',
            type: 'cancellation_request_approved' as any,
            contextArgs: {
              customerName: appointment.user_name || 'Müşteri',
              businessName: bizName,
              date: appointment.date,
              time: appointment.time,
              notes: ownerNote || ''
            }
          });
        } else if (req.type === 'reschedule' && req.requestedDateTime) {
          // Apply reschedule
          const [newDate, newTime] = req.requestedDateTime.split(' ');
          await getBookingRepository().updateAppointment(appointment.id, {
            date: newDate,
            time: newTime
          });
          req.status = 'applied';

          // Queue outbox approval event
          communicationEventService.queueCommunicationEvent({
            tenantId,
            customerId: appointment.id,
            appointmentId: appointment.id,
            audience: 'customer',
            channel: 'whatsapp',
            type: 'reschedule_request_approved' as any,
            contextArgs: {
              customerName: appointment.user_name || 'Müşteri',
              businessName: bizName,
              oldDate: appointment.date,
              oldTime: appointment.time,
              date: newDate,
              time: newTime,
              notes: ownerNote || ''
            }
          });
        }
      } else {
        // Rejected
        communicationEventService.queueCommunicationEvent({
          tenantId,
          customerId: appointment.id,
          appointmentId: appointment.id,
          audience: 'customer',
          channel: 'whatsapp',
          type: req.type === 'cancellation' ? 'cancellation_request_rejected' as any : 'reschedule_request_rejected' as any,
          contextArgs: {
            customerName: appointment.user_name || 'Müşteri',
            businessName: bizName,
            date: appointment.date,
            time: appointment.time,
            notes: ownerNote || ''
          }
        });
      }

      this.saveAllChangeRequests(requests);
      return true;
    } catch (e) {
      console.error('Error reviewing change request', e);
      return false;
    }
  }
};
