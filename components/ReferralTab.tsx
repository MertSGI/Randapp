import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTenant } from '../contexts/TenantContext';
import { referralService } from '../services/referralService';
import { ReferralCampaign } from '../types';

const ReferralTab: React.FC = () => {
  const { language } = useLanguage();
  const { tenant } = useTenant();
  const [campaigns, setCampaigns] = useState<ReferralCampaign[]>([]);

  useEffect(() => {
    if (tenant) {
      setCampaigns(referralService.getCampaigns(tenant.id));
    }
  }, [tenant]);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {language === 'tr' ? 'Referans & Müşteri Bağlılığı' : 'Referrals & Customer Loyalty'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {language === 'tr' ? 'Müşterilerinizin işletmenizi önermesini sağlayarak yeni ziyaretçiler kazanın. Yeni kampanyalar oluşturun ve kod kullanım durumlarını takip edin.' : 'Gain new visitors by having your customers recommend your business. Create new campaigns and track code usage.'}
        </p>

        <div className="bg-blue-50 dark:bg-slate-700/50 border border-blue-200 dark:border-slate-600 rounded-lg p-6 text-center">
            <h3 className="text-lg font-bold text-blue-900 dark:text-white mb-2">
               {language === 'tr' ? 'Yakında: Kendi Kampanyanı Yarat' : 'Coming Soon: Create Your Own Campaign'}
            </h3>
            <p className="text-sm text-blue-800 dark:text-gray-300 max-w-lg mx-auto mb-4">
                {language === 'tr' ? 'Çok yakında bu ekrandan % indirim veya ücretsiz hediye seans gibi özel müşteri referans kodları oluşturabileceksiniz.' : 'Soon you will be able to create custom customer referral codes with % discount or free gift sessions directly from this screen.'}
            </p>
            <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md shadow opacity-50 cursor-not-allowed">
               {language === 'tr' ? '+ Yeni Kampanya Ekle' : '+ Add New Campaign'}
            </button>
        </div>
      </div>
      
      {campaigns.length > 0 && (
          <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
               <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{language === 'tr' ? 'Kampanya Adı' : 'Campaign Name'}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{language === 'tr' ? 'Ödül' : 'Reward'}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{language === 'tr' ? 'Durum' : 'Status'}</th>
                  </tr>
               </thead>
               <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700 text-sm">
                  {campaigns.map(c => (
                     <tr key={c.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{c.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{c.rewardValue} {c.rewardType}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                                {c.status}
                            </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
          </div>
      )}
    </div>
  );
};

export default ReferralTab;
