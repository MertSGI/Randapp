// LARI Launch Mode Service
// Bu servis, platformun farklı yayılım (deployment) ve canlılık modlarını tanımlar.

export type LaunchMode = 
  | 'local_pre_live' 
  | 'internal_demo' 
  | 'unpaid_manual_pilot' 
  | 'limited_live_manual_billing' 
  | 'full_live_online_payment';

export interface LaunchModeSummary {
  mode: LaunchMode;
  name: string;
  onlinePaymentEnabled: boolean;
  manualBillingEnabled: boolean;
  isPreLiveMode: boolean;
  description: string;
  allowedBillingSources: string[];
  mustNotClaim: string[];
}

export const launchModeService = {
  getCurrentLaunchMode(): LaunchMode {
    // VITE_LAUNCH_MODE çevre değişkeni üzerinden dinamik ayar yapılabilir.
    // Varsayılan mod 'local_pre_live' olarak başlar.
    const mode = ((import.meta as any).env.VITE_LAUNCH_MODE as LaunchMode) || 'local_pre_live';
    return mode;
  },

  isOnlinePaymentEnabled(): boolean {
    const mode = this.getCurrentLaunchMode();
    return mode === 'full_live_online_payment';
  },

  isManualBillingEnabled(): boolean {
    const mode = this.getCurrentLaunchMode();
    return mode === 'limited_live_manual_billing' || mode === 'unpaid_manual_pilot' || mode === 'local_pre_live';
  },

  isLiveProviderRequired(feature: 'sms' | 'whatsapp' | 'email' | 'storage' | 'dns' | 'payment'): boolean {
    const mode = this.getCurrentLaunchMode();
    if (mode === 'full_live_online_payment') {
      return true;
    }
    if (mode === 'limited_live_manual_billing') {
      // Sadece depolama ve DNS canlı gerekebilir, ödeme ve iletişim ise çevrimdışı/manuel devam edebilir.
      return feature === 'storage' || feature === 'dns';
    }
    return false;
  },

  getAllowedBillingSourcesForLaunchMode(mode: LaunchMode): string[] {
    switch (mode) {
      case 'local_pre_live':
      case 'internal_demo':
        return ['complimentary', 'pilot_exception'];
      case 'unpaid_manual_pilot':
        return ['complimentary', 'pilot_exception'];
      case 'limited_live_manual_billing':
        return ['bank_transfer', 'cash', 'physical_pos', 'complimentary', 'pilot_exception'];
      case 'full_live_online_payment':
        return ['credit_card', 'bank_transfer', 'cash'];
      default:
        return ['complimentary'];
    }
  },

  getMustNotClaimListForLaunchMode(mode: LaunchMode): string[] {
    const base = [
      'Resmi hukuki ve mevzuatsal uyumluluk onayı (avukat incelemesi dış sorumluluktur)',
      'Otomatik kredi kartı tahsilatı (Online POS aktifleşene kadar)'
    ];

    if (mode !== 'full_live_online_payment') {
      base.push('Otomatik kredi kartı ile abonelik çekimi');
      base.push('Canlı iyzico entegrasyonu');
      base.push('Otomatik e-Fatura kesimi');
    }
    if (mode === 'local_pre_live' || mode === 'internal_demo') {
      base.push('Gerçek zamanlı SMS/WhatsApp onayı');
      base.push('Gerçek zamanlı özel .com alan adı yönlendirmesi');
    }
    return base;
  },

  getLaunchModeReadinessSummary(): LaunchModeSummary {
    const currentMode = this.getCurrentLaunchMode();
    
    const summaries: Record<LaunchMode, { name: string; desc: string }> = {
      local_pre_live: {
        name: 'Yerel Hazırlık Sürümü (Pre-live)',
        desc: 'Tüm sistem yerel bellek ve tarayıcı üzerinde simüle edilir. Çevrimdışı ve çevrimiçi tüm ödemeler simülatördür.'
      },
      internal_demo: {
        name: 'Dahili Kurucu Demosu',
        desc: 'Kurucu ekibin sunumlarında ve yatırımcı görüşmelerinde kullanılmak üzere optimize edilmiş kontrollü ortam.'
      },
      unpaid_manual_pilot: {
        name: 'Ücretsiz Manuel Pilot',
        desc: 'Dost salonlara sunulan, gerçek rezervasyon alan fakat herhangi bir ücret tahsil edilmeyen ilk test aşaması.'
      },
      limited_live_manual_billing: {
        name: 'Kısıtlı Canlı / Çevrimdışı Ödeme Modu',
        desc: 'Online ödeme kapalıdır. Salonlar manuel satılır, tahsilat elden veya havale ile yapılır, aktivasyon süper admin panelinden bizzat tamamlanır.'
      },
      full_live_online_payment: {
        name: 'Tam Ölçekli Canlı Bulut SaaS',
        desc: 'Kredi kartı ile anında kayıt, otomatik iyzico çekimleri ve tam SMS/DNS altyapısı devrededir.'
      }
    };

    const details = summaries[currentMode];

    return {
      mode: currentMode,
      name: details.name,
      onlinePaymentEnabled: this.isOnlinePaymentEnabled(),
      manualBillingEnabled: this.isManualBillingEnabled(),
      isPreLiveMode: currentMode !== 'full_live_online_payment' && currentMode !== 'limited_live_manual_billing',
      description: details.desc,
      allowedBillingSources: this.getAllowedBillingSourcesForLaunchMode(currentMode),
      mustNotClaim: this.getMustNotClaimListForLaunchMode(currentMode)
    };
  }
};
