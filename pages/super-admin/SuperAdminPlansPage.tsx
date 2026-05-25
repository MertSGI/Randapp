import React, { useState, useEffect } from 'react';
import { planService, PricingPlan } from '../../services/planService';

const SuperAdminPlansPage: React.FC = () => {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setPlans(planService.getAllPlans());
    }, []);

    const handleUpdate = (planId: string, updates: Partial<PricingPlan>) => {
        planService.updatePlan(planId, updates);
        setPlans(planService.getAllPlans());
    };

    const handleSave = () => {
        // Technically updatePlan already saves to localStorage in mock mode,
        // but let's just trigger a feedback
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Planlar ve Fiyatlandırma Yönetimi</h2>
                <button onClick={handleSave} className="bg-accent text-white px-6 py-2 rounded-md font-medium">Bütün Değişiklikleri Kaydet</button>
            </div>
            
            <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md mb-6 border border-yellow-200">
                Not: Mock modunda bu değişiklikler tüm platformda anında yansır. Üretim ortamında, güncellediğiniz fiyatların canlı ödeme sağlayıcısında (Iyzico/Stripe vb.) ayrıca senkronize edilmesi gerektiğini unutmayın.
            </p>

            {saved && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm mb-4">Ayarlar başarıyla kaydedildi ve tüm platformda güncellendi.</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div key={plan.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                        
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Aylık Fiyat (₺)</label>
                            <input 
                               type="number" 
                               value={plan.monthlyPrice} 
                               onChange={e => handleUpdate(plan.id, { monthlyPrice: Number(e.target.value) })}
                               className="w-full border-gray-300 dark:border-slate-600 rounded-md p-2 text-sm bg-gray-50 dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Yıllık Toplam Fiyat (₺)</label>
                            <input 
                               type="number" 
                               value={plan.annualPrice} 
                               onChange={e => handleUpdate(plan.id, { annualPrice: Number(e.target.value) })}
                               className="w-full border-gray-300 dark:border-slate-600 rounded-md p-2 text-sm bg-gray-50 dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Maksimum Uzman</label>
                            <input 
                               type="number" 
                               value={plan.maxStaff} 
                               onChange={e => handleUpdate(plan.id, { maxStaff: Number(e.target.value) })}
                               className="w-full border-gray-300 dark:border-slate-600 rounded-md p-2 text-sm bg-white dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Maksimum Hizmet</label>
                            <input 
                               type="number" 
                               value={plan.maxServices} 
                               onChange={e => handleUpdate(plan.id, { maxServices: Number(e.target.value) })}
                               className="w-full border-gray-300 dark:border-slate-600 rounded-md p-2 text-sm bg-white dark:bg-slate-700 dark:text-white"
                            />
                        </div>

                        <div className="pt-2">
                           <label className="flex items-center space-x-2">
                               <input type="checkbox" checked={plan.aiRecommendationsEnabled} onChange={e => handleUpdate(plan.id, { aiRecommendationsEnabled: e.target.checked })} className="rounded text-accent focus:ring-accent" />
                               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Yapay Zeka Aktif</span>
                           </label>
                        </div>
                        <div className="pt-1">
                           <label className="flex items-center space-x-2">
                               <input type="checkbox" checked={plan.customDomainEnabled} onChange={e => handleUpdate(plan.id, { customDomainEnabled: e.target.checked })} className="rounded text-accent focus:ring-accent" />
                               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Özel Domain Desteği</span>
                           </label>
                        </div>
                        <div className="pt-1">
                           <label className="flex items-center space-x-2">
                               <input type="checkbox" checked={plan.customComDomainIncluded} onChange={e => handleUpdate(plan.id, { customComDomainIncluded: e.target.checked })} className="rounded text-accent focus:ring-accent" />
                               <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Manuel özel domain desteği (Yıllık mod)</span>
                           </label>
                        </div>
                        <div className="pt-1">
                           <label className="flex items-center space-x-2">
                               <input type="checkbox" checked={plan.whatsappAutomationEnabled} onChange={e => handleUpdate(plan.id, { whatsappAutomationEnabled: e.target.checked })} className="rounded text-accent focus:ring-accent" />
                               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">WhatsApp Bildirimleri Aktif</span>
                           </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuperAdminPlansPage;
