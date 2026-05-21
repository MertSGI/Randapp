import React, { useEffect, useState } from 'react';
import { TenantFullData, superAdminService } from '../services/superAdminService';

const SuperAdminDashboard: React.FC = () => {
  const [data, setData] = useState<{stats: any, tenants: TenantFullData[]} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    superAdminService.getDashboardData().then(d => {
      setData(d);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8">Loading dashboard...</div>;
  if (!data) return <div className="p-8">Error loading data.</div>;

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
          { label: 'Awaiting Setup', value: data.stats.awaitingSetup, color: 'text-yellow-600' },
          { label: 'MRR (Est.)', value: `₺${data.stats.monthlyRecurringRevenue}`, color: 'text-blue-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="text-sm font-medium text-gray-500 uppercase">{stat.label}</div>
            <div className={`mt-2 text-3xl font-bold ${stat.color || 'text-gray-900 dark:text-white'}`}>{stat.value}</div>
          </div>
        ))}
      </div>

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Setup</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metrics</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {data.tenants.map((t) => (
                <tr key={t.tenant.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">{t.tenant.businessName || 'Unnamed'}</div>
                    <div className="text-sm text-gray-500">{t.tenant.ownerEmail}</div>
                    <div className="text-xs text-gray-400 mt-1">{t.tenant.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{t.planId}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded-full ${t.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {t.subscriptionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t.setupStatus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{t.monthlyAppointments} appts</div>
                    <div className="text-sm text-green-600">~₺{t.estimatedRevenue}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Manage</button>
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
