import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { planService, PricingPlan, BillingPeriod } from '../services/planService';

const PricingPage: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [plans, setPlans] = useState<PricingPlan[]>([]);

  useEffect(() => {
    setPlans(planService.getAllPlans());
  }, []);

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">Fiyatlar</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Gizli ücret ve randevu başı komisyon yok. Salonunuzun büyüklüğüne uygun paketi seçin, işinizi dijitale taşıyın.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-full inline-flex items-center relative">
           <button 
             onClick={() => setBillingPeriod('monthly')}
             className={`relative z-10 px-6 py-2 rounded-full font-bold text-sm transition-colors ${billingPeriod === 'monthly' ? 'text-gray-900 shadow-sm bg-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
           >
             Aylık
           </button>
           <button 
             onClick={() => setBillingPeriod('annual')}
             className={`relative z-10 px-6 py-2 rounded-full font-bold text-sm transition-colors ${billingPeriod === 'annual' ? 'text-gray-900 shadow-sm bg-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
           >
             Yıllık <span className="ml-1 text-green-500 font-extrabold">%20 İndirim</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isRecommended = plan.id === 'professional';
          const price = planService.calculatePlanPrice(plan.id, billingPeriod);
          // For annual, display monthly equivalent
          const displayPrice = billingPeriod === 'annual' ? (price / 12) : price;

          return (
          <div key={plan.name} className={`bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border ${isRecommended ? 'border-accent shadow-accent/20 shadow-xl relative transform md:-translate-y-2' : 'border-gray-200 dark:border-slate-700'} flex flex-col`}>
            {isRecommended && (
               <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                 En Popüler
               </div>
            )}
            <h3 className="text-2xl font-bold mb-2 dark:text-white">{plan.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 h-10">İşinizi dijitale taşımanız için her şey.</p>
            <div className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2">₺{displayPrice.toLocaleString()}<span className="text-lg text-gray-400 font-normal">/ay</span></div>
            {billingPeriod === 'annual' && (
                <div className="text-green-500 text-sm font-semibold mb-4">Yıllık ₺{price.toLocaleString()} faturalandırılır</div>
            )}
            {billingPeriod === 'monthly' && <div className="mb-4"></div>}
            
            <ul className="space-y-4 mb-8 text-gray-600 dark:text-gray-300 flex-grow">
                <li className="flex gap-3">
                   <span className="text-accent font-bold">✓</span>
                   <span className="text-sm border-b border-dashed border-gray-200 dark:border-slate-700 pb-1 w-full">Maksimum {plan.maxStaff} Çalışan</span>
                </li>
                <li className="flex gap-3">
                   <span className="text-accent font-bold">✓</span>
                   <span className="text-sm border-b border-dashed border-gray-200 dark:border-slate-700 pb-1 w-full">
                     {plan.maxServices > 900 ? 'Sınırsız Hizmet' : `Maksimum ${plan.maxServices} Hizmet`}
                   </span>
                </li>
                <li className="flex gap-3">
                   <span className="text-accent font-bold">✓</span>
                   <span className="text-sm border-b border-dashed border-gray-200 dark:border-slate-700 pb-1 w-full">Mini Web Sitesi & Randevu Sistemi</span>
                </li>
                {plan.customDomainEnabled && (
                  <li className="flex gap-3">
                     <span className="text-accent font-bold">✓</span>
                     <span className="text-sm border-b border-dashed border-gray-200 dark:border-slate-700 pb-1 w-full flex flex-col">
                         <span>Özel Domain Desteği</span>
                         {billingPeriod === 'annual' && plan.customComDomainIncluded && (
                             <span className="text-xs text-green-500 font-bold mt-1">Yıllık planda ücretsiz .com dahil!</span>
                         )}
                     </span>
                  </li>
                )}
            </ul>
            <div className="space-y-3 mt-auto">
               <Link to="/demo" className={`block w-full text-center font-bold py-3.5 rounded-xl transition ${isRecommended ? 'bg-accent text-white hover:bg-blue-600 shadow-lg' : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'}`}>
                 Kendi Salonumu Önizle
               </Link>
               <a href={`https://wa.me/905555555555?text=Merhaba, Randapp ${plan.name} (${billingPeriod === 'annual' ? 'Yıllık' : 'Aylık'}) planı hakkında bilgi almak istiyorum.`} target="_blank" rel="noreferrer" className="block w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-white py-2">
                 Satış Ekibiyle Görüş
               </a>
            </div>
          </div>
        )})}
      </div>
      
      <div className="mt-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 text-center max-w-3xl mx-auto">
         <h4 className="text-xl font-bold mb-2 dark:text-white">Kurulum Ücreti Nedir?</h4>
         <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">İlk kayıt olduğunuzda, randevu sisteminizin yapılandırılması, çalışan ve hizmet bilgilerinizin sisteme aktarılması ve salon web sitenizin yayına hazır hale getirilmesi için tek seferlik bir kurulum ücreti alınır. Sonrasında sadece seçtiğiniz paketin aylık ücretini ödersiniz.</p>
         <Link to="/contact" className="text-blue-600 font-semibold hover:underline text-sm">Kurumsal anlaşmalar için bizimle iletişime geçin.</Link>
      </div>
    </div>
  );
};

export default PricingPage;
