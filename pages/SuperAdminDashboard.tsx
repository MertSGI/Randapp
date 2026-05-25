import React, { useEffect, useState } from 'react';
import { TenantFullData, superAdminService } from '../services/superAdminService';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

const SuperAdminDashboard: React.FC = () => {
  const [data, setData] = useState<{stats: any, tenants: TenantFullData[]} | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const trl = translations[language];

  const [selectedTenant, setSelectedTenant] = useState<TenantFullData | null>(null);

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
    if (window.confirm(trl.super_admin?.approve_prompt || 'Approve this salon for live bookings?')) {
        await superAdminService.approveGoLive(tenantId);
        alert(trl.super_admin?.approve_success || 'Salon is live.');
        loadData();
    }
  };

  const handleSendBack = async (tenantId: string) => {
    const note = window.prompt(trl.super_admin?.send_back_prompt || 'Enter note (optional):');
    if (note !== null) {
        await superAdminService.sendBackToSetup(tenantId, note);
        alert(trl.super_admin?.send_back_success || 'Salon sent back.');
        loadData();
    }
  };

  const handlePause = async (tenantId: string) => {
    if (window.confirm(trl.super_admin?.pause_prompt || 'Pause bookings for this salon?')) {
        await superAdminService.pauseBookings(tenantId);
        alert(trl.super_admin?.pause_success || 'Action completed.');
        loadData();
    }
  };

  const handleContact = (tenant: TenantFullData) => {
    // Attempt to contact via phone/whatsapp
    const phone = tenant.businessProfile?.whatsapp_number;
    if (phone) {
       window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank');
    } else {
       alert(`Müşteri telefonu kayıtlı değil. Email: ${tenant.tenant.ownerEmail}`);
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
                         <a href={`/#/super-admin/tenant-preview/${t.tenant.id}`} target="_blank" rel="noopener noreferrer" className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition-colors flex items-center gap-1">
                           Siteyi Önizle
                         </a>
                         <button onClick={() => handleApprove(t.tenant.id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition-colors">{trl.super_admin?.approve || 'Approve Go-Live'}</button>
                         <button onClick={() => handleSendBack(t.tenant.id)} className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition-colors">{trl.super_admin?.send_back || 'Send Back'}</button>
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
                    {(import.meta as any).env.VITE_DATA_MODE === 'mock' && (
                      <button onClick={async () => {
                          const newStatus = t.subscriptionStatus === 'active' ? 'past_due' : 'active';
                          if (window.confirm(`Force mock subscription status to ${newStatus}?`)) {
                              await superAdminService.forceSubscriptionStatus(t.tenant.id, newStatus);
                              loadData();
                          }
                      }} className="text-purple-600 hover:text-purple-900 inline-flex flex-col items-center leading-none" title="Mock Development Tool">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Mock</span>
                        <span>Toggle Sub</span>
                      </button>
                    )}
                    <button onClick={() => handleContact(t)} className="text-green-600 hover:text-green-900">{trl.super_admin?.contact || 'Contact'}</button>
                    <button onClick={() => setSelectedTenant(t)} className="text-blue-600 hover:text-blue-900">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Manage Tenant Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-xl font-bold dark:text-white">Manage Tenant: {selectedTenant.tenant.businessName}</h3>
                <button onClick={() => setSelectedTenant(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-2xl leading-none">&times;</button>
             </div>
             <div className="p-6 space-y-4">
                <div>
                  <strong className="block text-gray-700 dark:text-gray-300">Tenant ID:</strong>
                  <span className="dark:text-white">{selectedTenant.tenant.id}</span>
                </div>
                <div>
                  <strong className="block text-gray-700 dark:text-gray-300">Owner Email:</strong>
                  <span className="dark:text-white">{selectedTenant.tenant.ownerEmail}</span>
                </div>
                <div>
                  <strong className="block text-gray-700 dark:text-gray-300">Plan:</strong>
                  <span className="dark:text-white">{selectedTenant.planId} ({selectedTenant.subscriptionStatus})</span>
                </div>
                <div>
                  <strong className="block text-gray-700 dark:text-gray-300">Setup Status:</strong>
                  <span className="dark:text-white">{selectedTenant.setupStatus}</span>
                </div>
                <div>
                  <strong className="block text-gray-700 dark:text-gray-300">Monthly Appointments:</strong>
                  <span className="dark:text-white">{selectedTenant.monthlyAppointments} / {selectedTenant.estimatedRevenue} ₺ estimated</span>
                </div>
             </div>
             <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end space-x-3">
                <a href={`/#/super-admin/tenant-preview/${selectedTenant.tenant.id}`} target="_blank" rel="noopener noreferrer" className="bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white px-4 py-2 rounded-md font-medium">
                  Site Önizle
                </a>
                <button onClick={() => setSelectedTenant(null)} className="bg-accent text-white px-4 py-2 rounded-md font-medium">
                  Kapat
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
