import React, { useState, useEffect } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { subscriptionService, TenantSubscription, TenantUsage } from '../services/subscriptionService';
import { planService, PricingPlan } from '../services/planService';
import { resolvePaymentCta } from '../utils/paymentCtaResolver';

const BillingTab: React.FC = () => {
  const { tenant } = useTenant();
  const [subscription, setSubscription] = useState<TenantSubscription | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PricingPlan | null>(null);
  const [usage, setUsage] = useState<TenantUsage | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (tenant) {
      loadBillingData();
    }
  }, [tenant]);

  const loadBillingData = async () => {
    if (!tenant) return;
    setLoading(true);
    
    const sub = await subscriptionService.getCurrentSubscription(tenant.id);
    setSubscription(sub);
    
    const plan = await subscriptionService.getPlanForTenant(tenant.id);
    setCurrentPlan(plan);
    
    const currentUsage = await subscriptionService.getTenantUsage(tenant.id);
    setUsage(currentUsage);
    
    setPlans(planService.getActivePlans());
    
    setLoading(false);
  };

  const handleCheckout = async (planId: string) => {
    if (!tenant) return;
    setCheckoutError(null);

    const isMock = (import.meta as any).env.VITE_PAYMENT_PROVIDER === 'mock' || !(import.meta as any).env.VITE_PAYMENT_PROVIDER;

    // Presentation mode block
    if (isMock) {
        window.alert('Ödeme entegrasyonu henüz yapılandırılmadı. iyzico ve Supabase Edge Functions aktif edildiğinde bu buton güvenli ödeme akışını başlatacaktır.');
        return;
    }

    const testValidation = (await import('../services/paymentSandboxTestService')).paymentSandboxTestService.validatePlanReferenceCodes(planId);
    if (!testValidation.valid) {
        setCheckoutError('Bu paket için ödeme sağlayıcı referans kodları eksik.');
        return;
    }

    try {
      const url = await subscriptionService.startCheckout(tenant.id, planId);
      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
       console.error("Checkout failed", err);
       setCheckoutError(err.message || 'Ödeme oturumu başlatılırken bir hata oluştu.');
    }
  };

  const handleBillingPortal = async () => {
    if (!tenant) return;
    await subscriptionService.openBillingPortal(tenant.id);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Dev Only Status Control */}
      {(import.meta as any).env.VITE_DATA_MODE !== 'supabase' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center justify-between">
          <div className="text-purple-800 text-sm font-medium">
             [Dev Only] Test Mock Subscription Status
          </div>
          <select 
            value={subscription?.status || 'active'}
            onChange={(e) => setSubscription(prev => prev ? {...prev, status: e.target.value as any} : null)}
            className="text-sm bg-white border border-purple-300 rounded px-2 py-1 outline-none text-gray-800"
          >
            <option value="trialing">Trialing</option>
            <option value="active">Active</option>
            <option value="past_due">Past Due</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
            <option value="none">None</option>
          </select>
        </div>
      )}

      {/* Current Status */}
      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Mevcut Abonelik Durumu</h2>
        
        {(import.meta as any).env.VITE_PAYMENT_PROVIDER === 'mock' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-500 text-yellow-800 p-4 rounded-md text-sm">
            <strong>Bilgi:</strong> Ödeme altyapısı test modundadır. Canlı ödeme henüz aktif değildir. Kart bilgisi alınmaz.
          </div>
        )}

        {checkoutError && (
          <div className="mb-6 bg-red-50 border border-red-500 p-4 rounded-md">
            <h3 className="text-red-900 font-bold">İşlem Başarısız</h3>
            <p className="text-red-800 text-sm mt-1">{checkoutError}</p>
          </div>
        )}

        {subscription?.status === 'past_due' && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
            <h3 className="text-red-800 font-medium">Ödeme Gecikmesi</h3>
            <p className="text-red-700 text-sm mt-1">Son ödemeniz gerçekleştirilemedi. Hizmetinizin kesintiye uğramaması için lütfen ödeme bilgilerinizi güncelleyin.</p>
          </div>
        )}

        {subscription?.status === 'expired' && (
          <div className="mb-6 bg-red-100 border border-red-500 p-4 rounded-md">
            <h3 className="text-red-900 font-bold">Abonelik Süresi Doldu</h3>
            <p className="text-red-800 text-sm mt-1">Süreniz dolduğu için hesabınız askıya alınmıştır. Hizmetinize devam etmek için yeni bir plan seçin.</p>
          </div>
        )}

        {subscription?.status === 'cancelled' && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
            <h3 className="text-red-800 font-medium">Abonelik İptal Edildi</h3>
            <p className="text-red-700 text-sm mt-1">Aboneliğiniz sonlandırılmıştır. Sistem erişiminiz kısıtlanmıştır, hizmetinize devam etmek için lütfen yeni bir plan seçin.</p>
          </div>
        )}

        {subscription?.status === 'trialing' && subscription?.trialEnd && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
            <h3 className="text-blue-800 font-medium">Deneme Süresi Aktif</h3>
            <p className="text-blue-700 text-sm mt-1">{new Date(subscription.trialEnd).toLocaleDateString('tr-TR')} tarihine kadar ücretsiz deneme süreniz devam etmektedir.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Aktif Plan</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{currentPlan?.name || 'Ücretsiz / Deneme'}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Durum</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
                subscription?.status === 'active' ? 'bg-green-100 text-green-800' :
                subscription?.status === 'trialing' ? 'bg-blue-100 text-blue-800' :
                subscription?.status === 'past_due' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {subscription?.status || 'Bilinmiyor'}
              </span>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Aylık Tutar</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">₺{currentPlan?.monthlyPrice || 0}</p>
              <p className="text-xs text-gray-500">Kurulum ücreti ({currentPlan?.setupFee} ₺) tek seferliktir.</p>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button 
                onClick={handleBillingPortal}
                className="bg-white text-gray-700 border border-gray-300 dark:bg-slate-700 dark:text-white dark:border-slate-600 px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
              >
                Fatura / Ödeme Yönetimi
              </button>
              <button 
                onClick={() => window.open(`https://wa.me/${(import.meta as any).env.VITE_SALES_WHATSAPP_NUMBER || ''}`, '_blank')}
                className="bg-white text-gray-700 border border-gray-300 dark:bg-slate-700 dark:text-white dark:border-slate-600 px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
              >
                Satış Ekibiyle Görüş
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Kullanım Limitleri</h3>
             
             <div className="mb-4">
               <div className="flex justify-between text-sm mb-1">
                 <span className="text-gray-600 dark:text-gray-400">Çalışanlar</span>
                 <span className="text-gray-900 dark:text-white">{usage?.staffCount} / {currentPlan?.maxStaff}</span>
               </div>
               <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                 <div className="bg-accent h-2 rounded-full" style={{ width: `${Math.min(100, ((usage?.staffCount || 0) / (currentPlan?.maxStaff || 1)) * 100)}%` }}></div>
               </div>
             </div>

             <div className="mb-4">
               <div className="flex justify-between text-sm mb-1">
                 <span className="text-gray-600 dark:text-gray-400">Hizmetler</span>
                 <span className="text-gray-900 dark:text-white">{usage?.serviceCount} / {currentPlan?.maxServices}</span>
               </div>
               <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                 <div className="bg-accent h-2 rounded-full" style={{ width: `${Math.min(100, ((usage?.serviceCount || 0) / (currentPlan?.maxServices || 1)) * 100)}%` }}></div>
               </div>
             </div>

             <div className="mb-4">
               <div className="flex justify-between text-sm mb-1">
                 <span className="text-gray-600 dark:text-gray-400">Aylık Randevu (Bu Ay)</span>
                 <span className="text-gray-900 dark:text-white">{usage?.monthlyAppointmentsCount} / {currentPlan?.maxMonthlyAppointments}</span>
               </div>
               <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                 <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, ((usage?.monthlyAppointmentsCount || 0) / (currentPlan?.maxMonthlyAppointments || 1)) * 100)}%` }}></div>
               </div>
             </div>

             {currentPlan?.aiRecommendationsEnabled && (
               <div className="mb-4">
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-gray-600 dark:text-gray-400">AI İstek Kotası</span>
                   <span className="text-gray-900 dark:text-white">{usage?.aiUsageCount} / {currentPlan?.aiMonthlyQuota || 'Sınırsız'}</span>
                 </div>
                 <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                   <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${currentPlan?.aiMonthlyQuota ? Math.min(100, ((usage?.aiUsageCount || 0) / currentPlan.aiMonthlyQuota) * 100) : 0}%` }}></div>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Planınızı Yükseltin</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-6 flex flex-col ${currentPlan?.id === plan.id ? 'border-accent shadow-md relative' : 'border-gray-200 dark:border-slate-700'}`}>
              
              {currentPlan?.id === plan.id && (
                 <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                   Mevcut Plan
                 </span>
              )}

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">₺{plan.monthlyPrice}</span>
                <span className="text-gray-500 dark:text-gray-400">/ay</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">+{plan.setupFee} ₺ Kurulum Ücreti (Tek Seferlik)</p>
              
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  {plan.maxStaff === 999 ? 'Sınırsız' : plan.maxStaff} Uzman / Çalışan
                </li>
                <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  {plan.maxServices === 999 ? 'Sınırsız' : plan.maxServices} Hizmet
                </li>
                <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  Aylık {plan.maxMonthlyAppointments === 99999 ? 'Sınırsız' : plan.maxMonthlyAppointments} Randevu
                </li>
                {plan.customDomainEnabled && (
                  <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    Manuel özel domain desteği
                  </li>
                )}
                <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <svg className={`w-5 h-5 mr-2 flex-shrink-0 ${plan.aiRecommendationsEnabled ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  Yapay Zeka Analizleri
                </li>
              </ul>
              
              {(() => {
                const ctaConfig = resolvePaymentCta({
                  paymentMode: ((import.meta as any).env.VITE_PAYMENT_PROVIDER as any) || 'mock',
                  plan,
                  currentSubscriptionPlanId: currentPlan?.id,
                  subscriptionStatus: subscription?.status as any,
                  language: 'tr'
                });

                return (
                  <div className="mt-auto space-y-3">
                    {ctaConfig.safetyMessage && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-500 text-center">{ctaConfig.safetyMessage}</p>
                    )}
                    <button 
                      onClick={
                        ctaConfig.actionType === 'talk_to_sales' 
                          ? () => window.open(`https://wa.me/${(import.meta as any).env.VITE_SALES_WHATSAPP_NUMBER || ''}?text=Merhaba, ${plan.name} planına geçmek / abonelik başlatmak istiyorum.`, '_blank')
                          : () => handleCheckout(plan.id)
                      }
                      disabled={ctaConfig.disabled}
                      className={`w-full py-3 px-4 rounded-md font-bold text-center transition-colors ${
                        ctaConfig.disabled
                          ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed' 
                          : 'bg-accent text-white hover:bg-blue-600'
                      }`}
                    >
                      {ctaConfig.label}
                    </button>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingTab;
