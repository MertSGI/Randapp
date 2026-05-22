import React, { useEffect, useState } from 'react';
import { TenantFullData, superAdminService } from '../services/superAdminService';

const SuperAdminDashboard: React.FC = () => {
  const [data, setData] = useState<{stats: any, tenants: TenantFullData[]} | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    superAdminService.getDashboardData().then(d => {
      setData(d);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (tenantId: string) => {
    if (window.confirm("Bu salonu yayına almak istiyor musunuz? Müşteri randevu alabilecek.")) {
        await superAdminService.approveGoLive(tenantId);
        alert("Salon başarıyla yayına alındı.");
        loadData();
    }
  };

  const handleSendBack = async (tenantId: string) => {
    const note = window.prompt("Eksiklikleri belirtmek için bir not girin (opsiyonel):");
    if (note !== null) {
        await superAdminService.sendBackToSetup(tenantId, note);
        alert("Salon kuruluma geri gönderildi.");
        loadData();
    }
  };

  const handlePause = async (tenantId: string) => {
    if (window.confirm("Bu salonun randevu alımını durdurmak istiyor musunuz?")) {
        await superAdminService.pauseBookings(tenantId);
        alert("Aksiyon tamamlandı.");
        loadData();
    }
  };

  if (loading) return <div className="p-8 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-white"></div></div>;
  if (!data) return <div className="p-8">Error loading data.</div>;

  const reviewTenants = data.tenants.filter(t => t.setupStatus === 'ready_for_review');
  const otherTenants = data.tenants.filter(t => t.setupStatus !== 'ready_for_review');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Overview</h1>
        <p className="text-gray-500">Super Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Salons', value: data.stats.totalSalons },
          { label: 'Active (Live)', value: data.stats.liveSalons, color: 'text-green-600' },
          { label: 'Ready for Review', value: data.stats.awaitingSetup - (otherTenants.filter(t => t.setupStatus === 'setup_in_progress').length), color: 'text-yellow-600' },
          { label: 'MRR (Est.)', value: `₺${data.stats.monthlyRecurringRevenue}`, color: 'text-blue-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="text-sm font-medium text-gray-500 uppercase">{stat.label}</div>
            <div className={`mt-2 text-3xl font-bold ${stat.color || 'text-gray-900 dark:text-white'}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {reviewTenants.length > 0 && (
         <div className="bg-yellow-50 dark:bg-yellow-900/20 shadow-sm rounded-xl border border-yellow-200 dark:border-yellow-700 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-yellow-200 dark:border-yellow-700">
            <h2 className="text-lg font-bold text-yellow-900 dark:text-yellow-100">Ready for Review ({reviewTenants.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-yellow-200 dark:divide-yellow-700/50">
               <thead className="bg-yellow-100/50 dark:bg-yellow-900/30">
                 <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 dark:text-yellow-300 uppercase tracking-wider">Salon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 dark:text-yellow-300 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-800 dark:text-yellow-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-yellow-800 dark:text-yellow-300 uppercase tracking-wider">Actions</th>
                 </tr>
               </thead>
               <tbody className="bg-white/50 dark:bg-slate-800/50 divide-y divide-yellow-200 dark:divide-yellow-700/50">
                 {reviewTenants.map((t) => (
                    <tr key={t.tenant.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{t.tenant.businessName || 'Unnamed'}</div>
                        <div className="text-sm text-gray-500">{t.tenant.ownerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{t.planId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Needs Approval</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm flex justify-end gap-3 flex-wrap">
                         <a href={`/#/book?preview=true`} target="_blank" rel="noopener noreferrer" className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition-colors flex items-center gap-1">
                           Siteyi Önizle
                         </a>
                         <button onClick={() => handleApprove(t.tenant.id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition-colors">Approve Go-Live</button>
                         <button onClick={() => handleSendBack(t.tenant.id)} className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition-colors">Send Back</button>
                      </td>
                    </tr>
                 ))}
               </tbody>
            </table>
          </div>
         </div>
      )}

      <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Tenants</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Setup Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Web Profile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metrics</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {otherTenants.map((t) => (
                <tr key={t.tenant.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">{t.tenant.businessName || 'Unnamed'}</div>
                    <div className="text-sm text-gray-500">{t.tenant.ownerEmail}</div>
                    <div className="text-xs text-gray-400 mt-1 truncate max-w-[150px]">{t.tenant.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{t.planId}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded-full ${t.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {t.subscriptionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded-full ${t.setupStatus === 'live' ? 'bg-green-100 text-green-800' : t.setupStatus === 'setup_in_progress' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>
                      {t.setupStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {t.hasProfile ? (
                      <span className="inline-flex items-center text-green-600 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-gray-400 text-sm border border-gray-200 px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{t.monthlyAppointments} appts</div>
                    <div className="text-sm text-green-600">~₺{t.estimatedRevenue}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    {t.setupStatus === 'live' && (
                       <button onClick={() => handlePause(t.tenant.id)} className="text-yellow-600 hover:text-yellow-900">Pause</button>
                    )}
                    <button onClick={() => alert('Tenant detay yönetimi sonraki fazda eklenecek.')} className="text-blue-600 hover:text-blue-900">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
