import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { planService, PricingPlan, BillingPeriod } from '../services/planService';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { resolvePaymentCta } from '../utils/paymentCtaResolver';

const PricingPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  
  const paymentMode = ((import.meta as any).env.VITE_PAYMENT_PROVIDER as 'mock' | 'sandbox' | 'production') || 'mock';

  useEffect(() => {
    // Only display active plans
    const activePlans = planService.getActivePlans();
    setPlans(activePlans);
  }, []);

  // Use the discount of the first plan generically if needed, or don't show generic discount if they differ.
  // For simplicity, we can show a placeholder or calculate based on the current plans.
  const hasAnnualDiscount = plans.some(p => p.annualDiscountPercent > 0);

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">{t.marketing.pricing.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t.marketing.pricing.subtitle}
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-full inline-flex items-center relative">
           <button 
             onClick={() => setBillingPeriod('monthly')}
             className={`relative z-10 px-6 py-2 rounded-full font-bold text-sm transition-colors ${billingPeriod === 'monthly' ? 'text-gray-900 shadow-sm bg-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
           >
             {t.marketing.pricing.monthly}
           </button>
           <button 
             onClick={() => setBillingPeriod('annual')}
             className={`relative z-10 px-6 py-2 rounded-full font-bold text-sm transition-colors ${billingPeriod === 'annual' ? 'text-gray-900 shadow-sm bg-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
           >
             {t.marketing.pricing.annual} 
             {hasAnnualDiscount && <span className="ml-1 text-green-500 font-extrabold">{t.marketing.pricing.annual_discount}</span>}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
        {plans.map((plan) => {
          const isRecommended = plan.isRecommended;
          const price = planService.calculatePlanPrice(plan.id, billingPeriod);
          // For annual, display monthly equivalent
          const displayPrice = billingPeriod === 'annual' ? (price / 12) : price;
          const trialWording = t.marketing.pricing.trial_wording_plan?.replace('{days}', plan.trialDays?.toString() || '7');

          const ctaConfig = resolvePaymentCta({
            paymentMode,
            plan,
            language
          });

          return (
          <div key={plan.id} className={`bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border ${isRecommended ? 'border-accent shadow-accent/20 shadow-xl relative transform md:-translate-y-2' : 'border-gray-200 dark:border-slate-700'} flex flex-col`}>
            {isRecommended && (
               <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                 {t.marketing.pricing.most_popular}
               </div>
            )}
            <h3 className="text-2xl font-bold mb-2 dark:text-white">{plan.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 h-10">{t.marketing.pricing.plan_desc}</p>
            <div className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2">₺{displayPrice.toLocaleString()}<span className="text-lg text-gray-400 font-normal">/{language==='tr'?'ay':'mo'}</span></div>
            
            {billingPeriod === 'annual' && (
                <div className="text-green-500 text-sm font-semibold mb-4">
                  {t.marketing.pricing.billed_annually.replace('{price}', price.toLocaleString())}
                  {plan.annualDiscountPercent > 0 && ` (%${plan.annualDiscountPercent} ${language === 'tr' ? 'indirimli' : 'off'})`}
                </div>
            )}
            {billingPeriod === 'monthly' && <div className="mb-4"></div>}
            
            <p className="text-[10px] leading-tight text-gray-400 dark:text-gray-500 italic mb-6">
              {trialWording}
            </p>

            <ul className="space-y-4 mb-8 text-gray-600 dark:text-gray-300 flex-grow">
                <li className="flex gap-3">
                   <span className="text-accent font-bold">✓</span>
                   <span className="text-sm border-b border-dashed border-gray-200 dark:border-slate-700 pb-1 w-full">{t.marketing.pricing.max_staff.replace('{count}', plan.maxStaff.toString())}</span>
                </li>
                <li className="flex gap-3">
                   <span className="text-accent font-bold">✓</span>
                   <span className="text-sm border-b border-dashed border-gray-200 dark:border-slate-700 pb-1 w-full">
                     {plan.maxServices > 900 ? t.marketing.pricing.unlimited_services : t.marketing.pricing.max_services.replace('{count}', plan.maxServices.toString())}
                   </span>
                </li>
                <li className="flex gap-3">
                   <span className="text-accent font-bold">✓</span>
                   <span className="text-sm border-b border-dashed border-gray-200 dark:border-slate-700 pb-1 w-full">{t.marketing.pricing.mini_website}</span>
                </li>
                {plan.customDomainEnabled && (
                  <li className="flex gap-3">
                     <span className="text-accent font-bold">✓</span>
                     <span className="text-sm border-b border-dashed border-gray-200 dark:border-slate-700 pb-1 w-full flex flex-col">
                         <span>{language === 'tr' ? 'Manuel özel domain desteği' : 'Manual custom domain support'}</span>
                     </span>
                  </li>
                )}
                {plan.aiRecommendationsEnabled && (
                  <li className="flex gap-3">
                     <span className="text-accent font-bold">✓</span>
                     <span className="text-sm border-b border-dashed border-gray-200 dark:border-slate-700 pb-1 w-full">
                       {t.marketing.pricing.ai_recommendation} 
                       {plan.aiMonthlyQuota > 0 && <span className="ml-1 text-xs text-gray-400">({t.marketing.pricing.ai_quota.replace('{quota}', plan.aiMonthlyQuota.toString())})</span>}
                     </span>
                  </li>
                )}
                {plan.aiVisualizationEnabled && (
                  <li className="flex gap-3">
                     <span className="text-accent font-bold">✓</span>
                     <span className="text-sm border-b border-dashed border-gray-200 dark:border-slate-700 pb-1 w-full">{t.marketing.pricing.ai_visualization}</span>
                  </li>
                )}
            </ul>
            <div className="space-y-3 mt-auto">
               {ctaConfig.safetyMessage && (
                 <p className="text-xs text-yellow-600 dark:text-yellow-500 mb-2">{ctaConfig.safetyMessage}</p>
               )}
               {ctaConfig.actionType === 'talk_to_sales' ? (
                 <a href={`https://wa.me/905555555555?text=${encodeURIComponent(t.marketing.pricing.sales_wa_text.replace('{planName}', plan.name).replace('{period}', billingPeriod === 'annual' ? t.marketing.pricing.annual : t.marketing.pricing.monthly))}`} target="_blank" rel="noreferrer" className={`block w-full text-center font-bold py-3.5 rounded-xl transition bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600`}>
                   {ctaConfig.label}
                 </a>
               ) : (
                 <Link to="/demo" className={`block w-full text-center font-bold py-3.5 rounded-xl transition ${isRecommended ? 'bg-accent text-white hover:bg-blue-600 shadow-lg' : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'}`}>
                   {ctaConfig.label}
                 </Link>
               )}
            </div>
          </div>
        )})}
      </div>
      
      <div className="mt-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 text-center max-w-3xl mx-auto">
         <h4 className="text-xl font-bold mb-2 dark:text-white">{t.marketing.pricing.setup_fee_q}</h4>
         <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">{t.marketing.pricing.setup_fee_a}</p>
         <Link to="/contact" className="text-blue-600 font-semibold hover:underline text-sm">{t.marketing.pricing.contact_corp}</Link>
      </div>
    </div>
  );
};

export default PricingPage;

