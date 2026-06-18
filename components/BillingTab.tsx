import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { useTenant } from '../contexts/TenantContext';
import { subscriptionService, TenantSubscription, TenantUsage } from '../services/subscriptionService';
import { planService, PricingPlan } from '../services/planService';
import { resolvePaymentCta } from '../utils/paymentCtaResolver';
import { CheckoutPreviewModal } from './CheckoutPreviewModal';

const BillingTab: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { tenant } = useTenant();
  const [subscription, setSubscription] = useState<TenantSubscription | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PricingPlan | null>(null);
  const [usage, setUsage] = useState<TenantUsage | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  
  const [previewPlan, setPreviewPlan] = useState<PricingPlan | null>(null);
  const [platformLedgers, setPlatformLedgers] = useState<any[]>([]);

  useEffect(() => {
    // Check for callback parameters from payment provider
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    if (urlParams.get('checkout') === 'cancelled') {
        const trLang = translations[language || 'tr']?.billing as any;
        setCheckoutError(trLang?.checkout_cancelled_msg || 'Güvenli ödeme işlemi iptal edildi.');
        window.history.replaceState(null, '', window.location.pathname + window.location.search + '#/admin?tab=abonelik');
    }
    if (urlParams.get('checkout') === 'success') {
        const trLang = translations[language || 'tr']?.billing as any;
        setCheckoutMessage(trLang?.checkout_success_msg || 'Ödeme başarıyla tamamlandı. Aboneliğiniz güncellendi.');
        window.history.replaceState(null, '', window.location.pathname + window.location.search + '#/admin?tab=abonelik');
        
        // Handle referral mapping on checkout success
        if (tenant?.id) {
          import('../services/referralProgramService').then(({ referralProgramService }) => {
            referralProgramService.markReferralTrialStarted(tenant.id);
          });
        }
    }
    if (urlParams.get('checkout_simulate') === 'true') {
        setCheckoutMessage('Ödeme başarıyla doğrulandı.');
        window.history.replaceState(null, '', window.location.pathname + window.location.search + '#/admin?tab=abonelik');
        
        // Handle referral mapping on checkout success
        if (tenant?.id) {
          import('../services/referralProgramService').then(({ referralProgramService }) => {
            referralProgramService.markReferralTrialStarted(tenant.id);
          });
        }
    }
    
    if (tenant) {
      loadBillingData();
      import('../services/referralProgramService').then(({ referralProgramService }) => {
        setPlatformLedgers(referralProgramService.listReferralRewards(tenant.id));
      });
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
        const selected = plans.find(p => p.id === planId);
        if (selected) setPreviewPlan(selected);
        return;
    }

    const testValidation = (await import('../services/paymentSandboxTestService')).paymentSandboxTestService.validatePlanReferenceCodes(planId);
    if (!testValidation.valid) {
        setCheckoutError(translations[language || 'tr']?.billing?.checkout_error_missing_ref || 'Bu paket için ödeme sağlayıcı referans kodları eksik.');
        return;
    }

    try {
      const url = await subscriptionService.startCheckout(tenant.id, planId);
      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
       console.error("Checkout failed", err);
       setCheckoutError(err.message || translations[language || 'tr']?.billing?.checkout_failed_default || 'Ödeme oturumu başlatılırken bir hata oluştu.');
    }
  };

  const handleBillingPortal = async () => {
    if (!tenant) return;
    await subscriptionService.openBillingPortal(tenant.id);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">{translations[language || 'tr']?.billing?.loading || 'Yükleniyor...'}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Current Status */}
      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t.billing.current_subscription_status}</h2>

        {checkoutError && (
          <div className="mb-6 bg-red-50 border border-red-500 p-4 rounded-md">
            <h3 className="text-red-900 font-bold">{t.billing.checkout_failed}</h3>
            <p className="text-red-800 text-sm mt-1">{checkoutError}</p>
          </div>
        )}

        {checkoutMessage && (
          <div className="mb-6 bg-green-50 border border-green-500 p-4 rounded-md">
            <h3 className="text-green-900 font-bold">{(t.billing as any).checkout_success || 'Başarılı'}</h3>
            <p className="text-green-800 text-sm mt-1">{checkoutMessage}</p>
          </div>
        )}

        {subscription?.status === 'past_due' && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
            <h3 className="text-red-800 font-medium">{t.billing.past_due_title}</h3>
            <p className="text-red-700 text-sm mt-1">{t.billing.past_due_desc}</p>
          </div>
        )}

        {subscription?.status === 'expired' && (
          <div className="mb-6 bg-red-100 border border-red-500 p-4 rounded-md">
            <h3 className="text-red-900 font-bold">{t.billing.expired_title}</h3>
            <p className="text-red-800 text-sm mt-1">{t.billing.expired_desc}</p>
          </div>
        )}

        {subscription?.status === 'cancelled' && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
            <h3 className="text-red-800 font-medium">{t.billing.cancelled_title}</h3>
            <p className="text-red-700 text-sm mt-1">{t.billing.cancelled_desc}</p>
          </div>
        )}

        {subscription?.status === 'pending_checkout' && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-md">
            <h3 className="text-yellow-800 font-medium">
              {language === 'tr' ? 'Ödeme Adımı Bekleniyor' : 'Checkout Pending'}
            </h3>
            <p className="text-yellow-700 text-sm mt-1 mb-3">
              {language === 'tr' ? '14 günlük denemeyi başlatmak için güvenli ödeme adımını tamamlayın.' : 'Complete secure checkout to start your 14-day free trial.'}
            </p>
            <div className="bg-yellow-100/50 p-3 rounded text-xs text-yellow-800 mb-3 font-mono">
              <span className="font-bold border-b border-yellow-800/20 mb-1 inline-block pb-0.5">Sistem Bildirimi (checkout_pending)</span><br />
              Denemenizi başlatmak için güvenli ödeme doğrulama adımını tamamlayın. Kart bilgileriniz LARİ tarafından alınmaz.
            </div>
            <button 
                onClick={handleBillingPortal}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
              >
                {language === 'tr' ? 'Güvenli Ödeme Adımına Devam Et' : 'Proceed to Secure Checkout'}
            </button>
          </div>
        )}

        {subscription?.status === 'trialing' && subscription?.trialEnd && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
            <h3 className="text-blue-800 font-medium">{t.billing.trialing_title}</h3>
            <p className="text-blue-700 text-sm mt-1 mb-2">{t.billing.trialing_desc?.replace('{date}', new Date(subscription.trialEnd).toLocaleDateString(language === 'en' ? 'en-US' : 'tr-TR'))}</p>
            <div className="bg-blue-100/50 p-3 rounded text-xs text-blue-800 font-mono">
              <span className="font-bold border-b border-blue-800/20 mb-1 inline-block pb-0.5">Gelen E-posta Önizlemesi (trial_started)</span><br />
              14 günlük ücretsiz denemeniz başladı. Deneme süresi boyunca ödeme alınmaz. 14 gün içinde iptal etmezseniz seçtiğiniz plan otomatik olarak başlar.
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {platformLedgers.length > 0 && (
               <div className="mb-6 bg-indigo-50 border border-indigo-200 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="bg-indigo-600 text-white p-1.5 rounded-lg">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                     </span>
                     <h3 className="font-bold text-indigo-900">{language === 'tr' ? 'Referans Ödülleri' : 'Referral Rewards'}</h3>
                  </div>
                  <p className="text-sm text-indigo-800">
                     {language === 'tr' 
                        ? `Toplam ${platformLedgers.reduce((acc, curr) => acc + curr.monthsGranted, 0)} ay ücretsiz kullanım tanımlandı. Sonraki faturanızdan düşülecektir.` 
                        : `Total of ${platformLedgers.reduce((acc, curr) => acc + curr.monthsGranted, 0)} free months granted. Will be applied to next cycle.`}
                  </p>
               </div>
            )}

            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.billing.active_plan}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{currentPlan?.name || t.billing.plan_free_trial}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.billing.status}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
                subscription?.status === 'active' ? 'bg-green-100 text-green-800' :
                subscription?.status === 'trialing' ? 'bg-blue-100 text-blue-800' :
                subscription?.status === 'pending_checkout' ? 'bg-yellow-100 text-yellow-800' :
                subscription?.status === 'past_due' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {subscription?.status === 'pending_checkout' ? (language === 'tr' ? 'Doğrulama Bekliyor' : 'Pending Auth') : (subscription ? t.billing[subscription.status] || subscription.status : t.billing.unknown)}
              </span>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.billing.monthly_amount}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">₺{currentPlan?.monthlyPrice || 0}</p>
              <p className="text-xs text-gray-500">{t.billing.setup_fee_note?.replace('{fee}', String(currentPlan?.setupFee || 0))}</p>
            </div>

            {subscription?.paymentProvider && ['offline_payment', 'complimentary', 'pilot_exception', 'manual_invoice'].includes(subscription.paymentProvider) && (
              <div className="mt-4 p-4.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">🔒 Super Admin Manuel Aktivasyon</span>
                <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                  Ödeme Türü: <strong className="uppercase font-bold text-gray-900 dark:text-white">{subscription.paymentProvider.replace('_', ' ')}</strong>
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                  Hesabınız Super Admin tarafından özel bir anlaşma, offline ödeme veya pilot program kapsamında yetkilendirilmiştir. Aboneliğiniz ve tüm paket limitleriniz işletmeniz için güvence altındadır. Herhangi bir sorunuz için satış/destek ekibimizle iletişime geçebilirsiniz.
                </p>
              </div>
            )}
            
            <div className="flex gap-4 mt-6">
              <button 
                onClick={handleBillingPortal}
                className="bg-white text-gray-700 border border-gray-300 dark:bg-slate-700 dark:text-white dark:border-slate-600 px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
              >
                {t.billing.billing_portal_btn}
              </button>
              <button 
                onClick={() => window.open(`https://wa.me/${(import.meta as any).env.VITE_SALES_WHATSAPP_NUMBER || ''}`, '_blank')}
                className="bg-white text-gray-700 border border-gray-300 dark:bg-slate-700 dark:text-white dark:border-slate-600 px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
              >
                {t.billing.talk_to_sales_btn}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t.billing.usage_limits}</h3>
             
             <div className="mb-4">
               <div className="flex justify-between text-sm mb-1">
                 <span className="text-gray-600 dark:text-gray-400">{t.billing.staff_count}</span>
                 <span className="text-gray-900 dark:text-white">{usage?.staffCount} / {currentPlan?.maxStaff === 999 ? t.billing.unlimited : currentPlan?.maxStaff}</span>
               </div>
               <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                 <div className="bg-accent h-2 rounded-full" style={{ width: `${Math.min(100, ((usage?.staffCount || 0) / (currentPlan?.maxStaff || 1)) * 100)}%` }}></div>
               </div>
             </div>

             <div className="mb-4">
               <div className="flex justify-between text-sm mb-1">
                 <span className="text-gray-600 dark:text-gray-400">{t.billing.services_count}</span>
                 <span className="text-gray-900 dark:text-white">{usage?.serviceCount} / {currentPlan?.maxServices === 999 ? t.billing.unlimited : currentPlan?.maxServices}</span>
               </div>
               <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                 <div className="bg-accent h-2 rounded-full" style={{ width: `${Math.min(100, ((usage?.serviceCount || 0) / (currentPlan?.maxServices || 1)) * 100)}%` }}></div>
               </div>
             </div>

             <div className="mb-4">
               <div className="flex justify-between text-sm mb-1">
                 <span className="text-gray-600 dark:text-gray-400">{t.billing.monthly_apts_count}</span>
                 <span className="text-gray-900 dark:text-white">{usage?.monthlyAppointmentsCount} / {currentPlan?.maxMonthlyAppointments === 99999 ? t.billing.unlimited : currentPlan?.maxMonthlyAppointments}</span>
               </div>
               <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                 <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, ((usage?.monthlyAppointmentsCount || 0) / (currentPlan?.maxMonthlyAppointments || 1)) * 100)}%` }}></div>
               </div>
             </div>

             {currentPlan?.aiRecommendationsEnabled && (
               <div className="mb-4">
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-gray-600 dark:text-gray-400">{t.billing.ai_quota}</span>
                   <span className="text-gray-900 dark:text-white">{usage?.aiUsageCount} / {currentPlan?.aiMonthlyQuota || t.billing.unlimited}</span>
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">{t.billing.upgrade_plan_title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-6 flex flex-col ${currentPlan?.id === plan.id ? 'border-accent shadow-md relative' : 'border-gray-200 dark:border-slate-700'}`}>
              
              {currentPlan?.id === plan.id && (
                 <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                   {t.billing.current_plan_badge}
                 </span>
              )}

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">₺{plan.monthlyPrice}</span>
                <span className="text-gray-500 dark:text-gray-400">{t.billing.per_month}</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">{t.billing.setup_fee_note_plain?.replace('{fee}', String(plan.setupFee))}</p>
              
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  {plan.maxStaff === 999 ? t.billing.unlimited : plan.maxStaff} {t.billing.staff_count}
                </li>
                <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  {plan.maxServices === 999 ? t.billing.unlimited : plan.maxServices} {t.billing.services_count}
                </li>
                <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  {t.billing.monthly_apts_count}: {plan.maxMonthlyAppointments === 99999 ? t.billing.unlimited : plan.maxMonthlyAppointments}
                </li>
                {plan.customDomainEnabled && (
                  <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    {t.billing.manual_domain_support}
                  </li>
                )}
                <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <svg className={`w-5 h-5 mr-2 flex-shrink-0 ${plan.aiRecommendationsEnabled ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  {t.billing.ai_analysis_support}
                </li>
              </ul>
              
              {(() => {
                const ctaConfig = resolvePaymentCta({
                  paymentMode: ((import.meta as any).env.VITE_PAYMENT_PROVIDER as any) || 'mock',
                  plan,
                  currentSubscriptionPlanId: currentPlan?.id,
                  subscriptionStatus: subscription?.status as any,
                  language: (language === 'tr' ? 'tr' : 'en')
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
      <CheckoutPreviewModal isOpen={!!previewPlan} onClose={() => setPreviewPlan(null)} plan={previewPlan} />
    </div>
  );
};

export default BillingTab;
