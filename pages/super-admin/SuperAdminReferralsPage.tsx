import React, { useState, useEffect } from 'react';
import { ReferralCampaign } from '../../types';
import { referralService } from '../../services/referralService';
import { useDialog } from '../../contexts/DialogContext';

const SuperAdminReferralsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<ReferralCampaign[]>([]);
  const { alert: showAlert, confirm: showConfirm } = useDialog();

  useEffect(() => {
    setCampaigns(referralService.getAllCampaignsForSuperAdmin());
  }, []);

  const toggleStatus = (id: string, currentStatus: boolean) => {
    const updated = campaigns.map(c => {
      if (c.id === id) {
        c.active = !currentStatus;
        referralService.saveCampaign(c);
      }
      return c;
    });
    setCampaigns([...updated]);
  };

  const addMockCampaign = () => {
    const newCamp: ReferralCampaign = {
        id: `campaign_mock_${Date.now()}`,
        tenantId: 'global',
        campaignType: 'business_referral',
        title: 'Platform Önerisi (Mock)',
        description: 'Arkadaşını getir, bedava ay kazan.',
        rewardType: 'free_month',
        rewardValue: '1',
        active: true,
        createdBy: 'super_admin',
        startDate: new Date().toISOString()
    };
    referralService.saveCampaign(newCamp);
    setCampaigns(referralService.getAllCampaignsForSuperAdmin());
    alert('Mock kampanya başarıyla eklendi.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Referans & Kampanya Yönetimi (MVP Mock)</h1>
          <p className="text-sm text-gray-500 mt-1">Platform geneli (Business-to-Platform) kampanyaları yönetin.</p>
        </div>
        <button onClick={addMockCampaign} className="bg-accent text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-600 transition">
          + Yeni Kampanya (Mock)
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kampanya Adı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tip</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ödül</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">İşlem</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700 text-sm">
            {campaigns.map(c => (
              <tr key={c.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {c.title}
                  {c.tenantId !== 'global' && <span className="ml-2 text-xs text-blue-500">Müşteri Kampanyası (Tenant: {c.tenantId})</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                  {c.campaignType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    c.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {c.active ? 'Active' : 'Paused'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                  {c.rewardValue} {c.rewardType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                  <button 
                    onClick={() => toggleStatus(c.id, c.active)}
                    className={`${c.active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                  >
                    {c.active ? 'Durdur' : 'Başlat'}
                  </button>
                  <button 
                    onClick={async () => {
                        const confirmed = await showConfirm({ message: `'${c.title}' kampanyasını silmek istediğinizden emin misiniz?` });
                        if (confirmed) {
                            const res = referralService.deleteCampaign(c.id);
                            if(res.ok) {
                                if(res.action === 'deactivated') {
                                    await showAlert(`'${c.title}' kullanımda olduğu için inaktif yapıldı.`);
                                } else {
                                    await showAlert(`'${c.title}' başarıyla silindi.`);
                                }
                                setCampaigns(referralService.getAllCampaignsForSuperAdmin());
                            } else {
                                await showAlert('İşlem başarısız.');
                            }
                        }
                    }}
                    className="text-gray-400 hover:text-red-600 transition"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                 <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Henüz kampanya yok.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminReferralsPage;
