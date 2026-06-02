import React, { useState, useEffect } from 'react';
import { pilotCustomerOnboardingService, PilotCustomer, PilotStage } from '../../services/pilotCustomerOnboardingService';

const SuperAdminPilotTrackerPage: React.FC = () => {
  const [pilots, setPilots] = useState<PilotCustomer[]>([]);
  const stages = pilotCustomerOnboardingService.getPilotStages();

  useEffect(() => {
    setPilots(pilotCustomerOnboardingService.getAllPilots());
  }, []);

  const handleStageChange = (tenantId: string, stage: string) => {
    const updated = pilotCustomerOnboardingService.updatePilotStage(tenantId, stage as PilotStage);
    if (updated) {
      setPilots(pilotCustomerOnboardingService.getAllPilots());
    }
  };

  const handleRegisterNewPilot = () => {
    const tenantId = prompt('Enter Tenant ID to track as Pilot:');
    if (tenantId) {
      pilotCustomerOnboardingService.registerPilotActivity(tenantId, 'New Business (' + tenantId + ')');
      setPilots(pilotCustomerOnboardingService.getAllPilots());
    }
  };

  return (
    <div className="p-6">
      <div className="flexjustify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Pilot Customer Onboarding Tracker</h1>
        <button 
          onClick={handleRegisterNewPilot}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Register New Pilot
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tenant ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Success Metrics</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {pilots.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No pilot customers registered yet. Begin tracking early adopters here.
                  </td>
                </tr>
              )}
              {pilots.map(p => (
                <tr key={p.tenantId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{p.businessName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-slate-500 dark:text-slate-400">{p.tenantId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select 
                      value={p.stage}
                      onChange={(e) => handleStageChange(p.tenantId, e.target.value)}
                      className="text-sm border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                    >
                      {stages.map(s => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1">
                       <span title="Setup Completed" className={`w-3 h-3 rounded-full ${p.metrics.setupCompleted ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                       <span title="Link Shared" className={`w-3 h-3 rounded-full ${p.metrics.publicLinkShared ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                       <span title="First Booking" className={`w-3 h-3 rounded-full ${p.metrics.firstBookingCreated ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                       <span title="Customer Memory" className={`w-3 h-3 rounded-full ${p.metrics.customerMemoryRecordCreated ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
         <h2 className="text-blue-800 dark:text-blue-400 font-semibold mb-2">Sales & Success Resources</h2>
         <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">You can consult the internal documentation for standardized pilot onboarding materials.</p>
         <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700 dark:text-blue-300">
            <li>docs/PILOT_CUSTOMER_INTAKE_FORM.md</li>
            <li>docs/FIRST_SALES_DEMO_SCRIPT.md</li>
            <li>docs/PILOT_ONBOARDING_CALL_SCRIPT.md</li>
            <li>docs/FIRST_WEEK_FOLLOW_UP_SCRIPT.md</li>
            <li>docs/SUPPORT_RESPONSE_TEMPLATES.md</li>
         </ul>
      </div>

    </div>
  );
};

export default SuperAdminPilotTrackerPage;
