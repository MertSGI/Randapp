import { launchModeService, LaunchMode } from './launchModeService';

export interface ReadinessGateResult {
  mode: LaunchMode;
  canLaunch: boolean;
  hardBlockers: string[];
  warnings: string[];
  requiredInfra: string[];
  mustNotClaim: string[];
}

export const productionReadinessGateService = {
  getEnvState() {
    const env = (import.meta as any).env || {};
    
    // Check if persistent database parameters are present and data mode is not local
    const dataMode = env.VITE_DATA_MODE || 'local';
    const hasPersistentDb = 
      (dataMode === 'supabase_staging' || dataMode === 'supabase_production') &&
      !!env.VITE_SUPABASE_URL && 
      !!env.VITE_SUPABASE_ANON_KEY;

    // Check if domain and SSL are ready (requires https and a valid custom production url in VITE_APP_BASE_URL)
    const baseUrl = env.VITE_APP_BASE_URL || '';
    const hasDnsSsl = baseUrl.startsWith('https://') && baseUrl.includes(env.VITE_PUBLIC_BASE_DOMAIN || 'randevulari.com');

    // Check payment mode and secrets
    const paymentMode = env.VITE_PAYMENT_MODE || 'disabled';
    const hasIyzico = paymentMode !== 'disabled';

    // Check communication mode
    const commMode = env.VITE_COMMUNICATION_MODE || 'local_outbox_only';
    const hasSms = commMode === 'sms_provider_ready' || commMode === 'whatsapp_provider_ready';

    return {
      hasPersistentDb,
      hasDnsSsl,
      hasIyzico,
      hasSms
    };
  },

  listHardBlockers(mode: LaunchMode): string[] {
    const envState = this.getEnvState();
    
    // Add logic checks for various modes
    const blockers: string[] = [];

    if (mode === 'paymentless_limited_production' || mode === 'full_live_online_payment') {
      if (!envState.hasPersistentDb) {
        blockers.push('Kalıcı (persistent) veritabanı aktif değil. VITE_DATA_MODE "supabase_staging" veya "supabase_production" olmalı ve geçerli VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY bulunmalıdır. Üretim ortamında localStorage kullanılamaz.');
      }
      if (!envState.hasDnsSsl) {
        blockers.push('SSL sertifikası veya canlı DNS tanımlanmamış. VITE_APP_BASE_URL, "https://" ile başlamalı ve "randevulari.com" içermelidir.');
      }
    }

    if (mode === 'full_live_online_payment') {
      if (!envState.hasIyzico) {
        blockers.push('iyzico sanal POS canlı API ayarları ve ödeme entegrasyonu aktif değil (VITE_PAYMENT_MODE disabled veya eksik).');
      }
    }

    return blockers;
  },

  listWarnings(mode: LaunchMode): string[] {
    const envState = this.getEnvState();
    const warnings: string[] = [];

    if (mode === 'paymentless_limited_production') {
      warnings.push('Online ödemeler (kredi kartı tahsilatları) bu modda tamamen devre dışıdır. Kiracılar yalnızca manuel olarak aktifleştirilebilir.');
      if (!envState.hasSms) {
        warnings.push('Canlı SMS/WhatsApp entegrasyonu kapalıdır. Bildirim kutusu (outbox-only) yerel olarak simüle edilir.');
      }
    }

    if (mode === 'limited_live_manual_billing' || mode === 'unpaid_manual_pilot') {
      warnings.push('Bu mod bir test veya pilot sürümüdür. Üretim seviyesinde (production-grade) kalıcı canlı veritabanı koruması veya SLA sunmaz.');
    }

    return warnings;
  },

  getRequiredInfraForMode(mode: LaunchMode): string[] {
    switch (mode) {
      case 'local_pre_live':
      case 'internal_demo':
        return ['Web Browser', 'Vite Local Port 3000'];
      case 'unpaid_manual_pilot':
      case 'limited_live_manual_billing':
        return ['Cloud Hosting (Cloud Run / VPS)', 'Temporary Domain / SSL', 'Mock/Local Database or Staging DB'];
      case 'paymentless_limited_production':
        return [
          'Cloud Hosting (Production Container/VPS)',
          'randevulari.com Main Domain & Wildcard DNS SSL Certificate (HTTPS)',
          'Persistent Production Supabase Postgres Database',
          'Row Level Security (RLS) policies enabled',
          'Super Admin Dashboard for Manual Activation',
          'Weekly Backup System'
        ];
      case 'full_live_online_payment':
        return [
          'Production Hosting (Cloud Run)',
          'randevulari.com Domain & Wildcard SSL Certificate (HTTPS)',
          'Persistent Postgres Production DB (Supabase)',
          'iyzico Corporate Seller Account & API Keys',
          'Secure Webhooks Callback (idempotency, security check)',
          'Live SMS Gateway API & Verification Service'
        ];
      default:
        return [];
    }
  },

  getMustNotClaimForMode(mode: LaunchMode): string[] {
    return launchModeService.getMustNotClaimListForLaunchMode(mode);
  },

  getProductionReadinessGate(mode: LaunchMode): ReadinessGateResult {
    const hardBlockers = this.listHardBlockers(mode);
    const warnings = this.listWarnings(mode);
    const requiredInfra = this.getRequiredInfraForMode(mode);
    const mustNotClaim = this.getMustNotClaimForMode(mode);

    return {
      mode,
      canLaunch: hardBlockers.length === 0,
      hardBlockers,
      warnings,
      requiredInfra,
      mustNotClaim
    };
  },

  canStartInternalDemo(): boolean {
    return this.getProductionReadinessGate('internal_demo').canLaunch;
  },

  canStartUnpaidManualPilot(): boolean {
    return this.getProductionReadinessGate('unpaid_manual_pilot').canLaunch;
  },

  canStartPaymentlessLimitedProduction(): boolean {
    return this.getProductionReadinessGate('paymentless_limited_production').canLaunch;
  },

  canStartFullLiveOnlinePayment(): boolean {
    return this.getProductionReadinessGate('full_live_online_payment').canLaunch;
  }
};
