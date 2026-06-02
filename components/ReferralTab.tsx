import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { useTenant } from '../contexts/TenantContext';
import { useDialog } from '../contexts/DialogContext';
import { entitlementService } from '../services/entitlementService';
import { referralProgramService } from '../services/referralProgramService';
import { referralService } from '../services/referralService';
import { ReferralCampaign, PlatformReferral, ReferralRewardLedger } from '../types';

const ReferralTab: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { tenant } = useTenant();
  const { alert: showAlert, confirm: showConfirm } = useDialog();
  
  const [campaigns, setCampaigns] = useState<ReferralCampaign[]>([]);
  const [platformReferrals, setPlatformReferrals] = useState<PlatformReferral[]>([]);
  const [platformLedgers, setPlatformLedgers] = useState<ReferralRewardLedger[]>([]);

  const planId = tenant?.planId || 'baslangic';
  const hasAccess = entitlementService.canUseFeature(planId, 'campaigns_referrals');

  useEffect(() => {
    if (tenant) {
      setCampaigns(referralService.getCampaigns(tenant.id));
      setPlatformReferrals(referralProgramService.listTenantReferrals(tenant.id));
      setPlatformLedgers(referralProgramService.listReferralRewards(tenant.id));
    }
  }, [tenant]);

  const referralCode = tenant?.id ? referralProgramService.createReferralCode(tenant.id) : '';
  const referralLink = `${window.location.origin}/#/register?ref=${referralCode}&planId=${planId}`;

  const program = referralProgramService.getActivePlatformReferralProgram();
  const qualifiedCount = platformReferrals.filter(r => r.status === 'qualified' || r.status === 'rewarded').length;
  const earnedMonths = platformLedgers.reduce((acc, curr) => acc + curr.monthsGranted, 0);

  return (
    <div className="space-y-10">
    
      {/* SECTION A: LARİ Referans Programı */}
      <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 shadow-lg rounded-2xl border border-indigo-800 p-8 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {language === 'tr' ? 'LARİ Referans Programı' : 'LARİ Referral Program'}
                </h2>
                <p className="text-indigo-200">
                  {language === 'tr' ? `Işletme önerin, ücretsiz kullanım kazanın. ${program.rewardPerQualifiedReferralMonths} referans = ${program.rewardPerQualifiedReferralMonths} ay hediye!` : `Refer a business, earn free months. ${program.rewardPerQualifiedReferralMonths} referral = ${program.rewardPerQualifiedReferralMonths} month free!`}
                </p>
              </div>
              <div className="bg-indigo-950/50 backdrop-blur border border-indigo-800 rounded-xl p-4 flex gap-8 items-center shrink-0">
                  <div className="text-center">
                      <p className="text-indigo-300 text-xs uppercase tracking-widest mb-1">{language === 'tr' ? 'Kalifiye' : 'Qualified'}</p>
                      <p className="text-3xl font-bold text-white leading-none">{qualifiedCount}</p>
                  </div>
                  <div className="w-px h-10 bg-indigo-800"></div>
                  <div className="text-center">
                      <p className="text-indigo-300 text-xs uppercase tracking-widest mb-1">{language === 'tr' ? 'Kazanılan (Ay)' : 'Earned (Mo)'}</p>
                      <p className="text-3xl font-bold text-green-400 leading-none">{earnedMonths}</p>
                  </div>
              </div>
            </div>
            
            <div className="bg-white/10 border border-white/20 rounded-xl p-6 relative z-10 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                   <p className="text-indigo-200 text-xs uppercase tracking-widest mb-2 font-semibold">
                      {language === 'tr' ? 'Sizin Referans Linkiniz' : 'Your Referral Link'}
                   </p>
                   <input 
                      readOnly 
                      value={referralLink} 
                      className="w-full bg-indigo-950/50 border border-indigo-500/30 text-white rounded-lg px-4 py-3 outline-none select-all"
                   />
                </div>
                <div className="shrink-0 pt-6">
                   <button 
                      onClick={() => {
                        navigator.clipboard.writeText(referralLink);
                        showAlert(language === 'tr' ? 'Link kopyalandı!' : 'Link copied!');
                      }}
                      className="w-full sm:w-auto bg-white text-indigo-900 hover:bg-indigo-50 font-bold py-3 px-6 rounded-lg transition"
                   >
                     {language === 'tr' ? 'Kopyala' : 'Copy'}
                   </button>
                </div>
            </div>
          </div>
      </div>

      {hasAccess ? (
         <div className="space-y-6">
           {/* SECTION B: Müşteri Referans Kampanyaları */}
           <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 p-6">
             <div className="flex justify-between items-start mb-6">
               <div>
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                   {language === 'tr' ? 'Müşteri Referans Kampanyaları' : 'Customer Referral Campaigns'}
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
                  {t.admin.referrals_add_btn || '+ Add Campaign'}
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
      ) : (
         <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'tr' ? 'Müşteri Kampanyaları Mevcut Paketinizde Yer Almıyor' : 'Feature not included in your current plan'}
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {language === 'tr' 
                ? 'Müşterileriniz için referans kampanyaları oluşturma özelliği Profesyonel ve üstü paketlerde kullanılabilir. İşletmeniz için yeni müşteriler kazanmak üzere paketinizi yükseltin.'
                : 'Customer campaign management is available in Professional plan and above. Upgrade your plan to win new customers.'}
            </p>
            <a href="#/admin/billing" className="bg-accent hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-md shadow transition inline-block">
              {language === 'tr' ? 'Paketleri İncele' : 'View Plans'}
            </a>
         </div>
      )}
    </div>
  );
};

export default ReferralTab;
