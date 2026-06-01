import React, { useState, useEffect } from 'react';
import { goLiveReadinessService, ReadinessReport, ReadinessCheck } from '../../services/goLiveReadinessService';

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'passed':
       return <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">PASSED</span>;
    case 'warning':
       return <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">PENDING</span>;
    case 'failed':
       return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">ERROR</span>;
    default:
       return <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">IDLE</span>;
  }
};

const SuperAdminGoLivePage: React.FC = () => {
  const [report, setReport] = useState<ReadinessReport | null>(null);

  useEffect(() => {
    goLiveReadinessService.getReport().then(setReport);
  }, []);

  if (!report) {
    return <div className="p-8 text-center dark:text-white">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-xl border border-slate-800 text-white shadow-xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Sandbox ve Yayın Hazırlığı</h1>
          <p className="text-sm text-slate-400">Sistem deployment ve entegrasyon kontrol konsolu (INTERNAL ONLY)</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-slate-300">Last Checked</div>
          <div className="text-xs text-slate-500">{new Date(report.lastChecked).toLocaleString()}</div>
        </div>
      </div>

      {report.blockers.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-500 rounded-xl p-6">
          <h2 className="text-red-800 dark:text-red-400 font-bold text-lg mb-3 flex items-center">
             <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
             Remaining Blockers Before Go-Live
          </h2>
          <ul className="space-y-2 list-disc pl-5 text-sm text-red-700 dark:text-red-300">
            {report.blockers.map((blocker, idx) => (
              <li key={idx} className="font-medium">{blocker}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Object.entries(report.categories).map(([key, category]) => (
           <div key={key} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
             <div className="bg-slate-50 dark:bg-slate-800/80 p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-gray-900 dark:text-white">{category.title}</h3>
                {category.description && (
                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{category.description}</p>
                )}
             </div>
             <ul className="divide-y divide-slate-100 dark:divide-slate-700/50 p-2">
                {category.checks.map(check => (
                   <li key={check.id} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg transition-colors">
                      <div className="flex-1 min-w-0 pr-4">
                         <div className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate">{check.title}</div>
                         {check.hint && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">{check.hint}</div>
                         )}
                      </div>
                      <div className="flex flex-col items-end shrink-0 gap-1">
                         <StatusBadge status={check.status} />
                         {check.value && (
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono">
                               {check.value}
                            </span>
                         )}
                      </div>
                   </li>
                ))}
             </ul>
           </div>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminGoLivePage;
