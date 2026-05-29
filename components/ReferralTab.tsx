import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { useTenant } from '../contexts/TenantContext';
import { useDialog } from '../contexts/DialogContext';
import { referralService } from '../services/referralService';
import { ReferralCampaign } from '../types';

const ReferralTab: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { tenant } = useTenant();
  const { alert: showAlert, confirm: showConfirm } = useDialog();
  const [campaigns, setCampaigns] = useState<ReferralCampaign[]>([]);

  useEffect(() => {
    if (tenant) {
      setCampaigns(referralService.getCampaigns(tenant.id));
    }
  }, [tenant]);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t.admin.referrals_title || 'Referrals & Points'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t.admin.referrals_subtitle || 'Manage customer referral programs.'}
            </p>
          </div>
          <button 
            onClick={() => {
              if (tenant) {
                 const newCampaign: ReferralCampaign = {
                    id: `campaign_${Date.now()}`,
                    tenantId: tenant.id,
                    campaignType: 'customer_referral',
                    title: language === 'tr' ? 'Yeni Müşteri Kampanyası' : 'New Customer Campaign',
                    description: language === 'tr' ? 'Arkadaşını getirene %10 indirim' : '10% off for friend referral',
                    rewardType: 'discount',
                    rewardValue: '10',
                    active: true,
                    createdBy: 'salon_owner',
                    startDate: new Date().toISOString()
                 };
                 referralService.saveCampaign(newCampaign);
                 setCampaigns(referralService.getCampaigns(tenant.id));
              }
            }}
            className="bg-accent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow transition"
          >
             {t.admin.referrals_add_btn || '+ Add Campaign (Mock)'}
          </button>
        </div>
      </div>
      
      {campaigns.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg border border-gray-200 dark:border-slate-700 text-center">
             <p className="text-gray-500">{t.admin.empty || 'Henüz kayıt bulunamadı.'}</p>
          </div>
      ) : (
          <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
               <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.admin.referrals_campaign_name || 'Campaign Name'}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.admin.referrals_reward || 'Reward'}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.admin.referrals_status || 'Status'}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.admin.delete || 'Delete'}</th>
                  </tr>
               </thead>
               <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700 text-sm">
                  {campaigns.map(c => (
                     <tr key={c.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{c.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{c.rewardValue} {c.rewardType}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                c.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                                {c.active ? (language === 'tr' ? 'Aktif' : 'Active') : (t.admin.inactive || 'Inactive')}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                            <button 
                              onClick={async () => {
                                 const confirmed = await showConfirm({
                                   message: language === 'tr' ? `'${c.title}' kampanyasını silmek istediğinize emin misiniz?` : `Are you sure you want to delete the '${c.title}' campaign?`
                                 });
                                 if(confirmed) {
                                     const res = referralService.deleteCampaign(c.id);
                                     if(res.ok) {
                                         if(res.action === 'deactivated') {
                                           await showAlert(language === 'tr' ? `'${c.title}' kod oluşturulduğu için inaktif yapıldı.` : `'${c.title}' is in use, deactivated instead.`);
                                         } else {
                                           await showAlert(language === 'tr' ? `'${c.title}' başarıyla silindi.` : `'${c.title}' was successfully deleted.`);
                                         }
                                         if(tenant) setCampaigns(referralService.getCampaigns(tenant.id));
                                     } else {
                                         await showAlert(language === 'tr' ? 'İşlem başarısız.' : 'Action failed.');
                                     }
                                 }
                              }}
                              className="text-red-500 hover:text-red-700 font-medium px-3 py-1 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200"
                            >
                                {t.admin.delete || 'Delete'}
                            </button>
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
