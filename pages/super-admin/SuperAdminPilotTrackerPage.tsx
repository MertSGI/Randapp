import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-6" id="first-pilot-checklist-card">
          <h2 className="text-slate-800 dark:text-slate-200 font-semibold mb-3 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold">✓</span>
            First Pilot Checklist & Next Actions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Follow this operational pipeline for managing early-adopter manual pilot salons.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-1 text-slate-400">1.</span>
              <div>
                <strong className="block font-medium text-slate-900 dark:text-slate-100">Create Tenant Manually</strong>
                <Link to="/super-admin/provisioning" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold block mt-1">
                  Go to Manual Provisioning Portal →
                </Link>
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-1 text-slate-400">2.</span>
              <div>
                <strong className="block font-medium text-slate-900 dark:text-slate-100">Configure Salon Setup</strong>
                <span className="text-xs text-slate-500">Add services, staff, working hours, & branch data in workspace.</span>
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-1 text-slate-400">3.</span>
              <div>
                <strong className="block font-medium text-slate-900 dark:text-slate-100">Test Booking & Outbox Flows</strong>
                <span className="text-xs text-slate-500">Run a test booking to verify it appears in admin schedule and communication outbox.</span>
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-1 text-slate-400">4.</span>
              <div>
                <strong className="block font-medium text-slate-900 dark:text-slate-100">Export Workspace Snapshot</strong>
                <span className="text-xs text-slate-500">Download a secure JSON backup schema before leaving the salon.</span>
              </div>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-1 text-slate-400">5.</span>
              <div>
                <strong className="block font-medium text-slate-900 dark:text-slate-100">Collect Structured Feedback</strong>
                <span className="text-xs text-slate-500">Score performance, log objection nuances, and plan the 24h follow-up.</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900/50 border border-indigo-100 dark:border-indigo-900/30 rounded-xl p-6 shadow-sm">
          <h2 className="text-indigo-900 dark:text-indigo-400 font-semibold mb-3 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold">⚙</span>
            End-to-End Pilot Rehearsal Console
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Verify the entire founder-led pilot workflow in our local safe pre-live sandbox.
          </p>
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Step 1-4: Onboarding & Provisioning</span>
              <div className="mt-1 flex flex-col gap-1.5">
                <Link to="/super-admin/provisioning" className="text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded font-medium transition flex justify-between items-center">
                  <span>1. Provision Pilot Tenant</span>
                  <span>→</span>
                </Link>
                <div className="text-[11px] text-slate-500 px-1">
                  Create kurgusal salon IDs (e.g. `melis-guzellik`) with 14-day trials.
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Step 5-14: Booking & Operations</span>
              <div className="mt-1 flex flex-col gap-1.5">
                <Link to="/pilot/customer" className="text-xs px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 rounded font-medium transition flex justify-between items-center">
                  <span>2. Run Booking Simulation</span>
                  <span>→</span>
                </Link>
                <div className="text-[11px] text-slate-500 px-1">
                  Take a test booking as customer, verify outbox logs, test self-service cancellation.
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Step 15-19: Sweeps & Audit Diagnostics</span>
              <div className="mt-1 flex flex-col gap-1.5">
                <div className="flex gap-2">
                  <Link to="/super-admin/scheduler" className="flex-1 text-center text-xs px-2 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded font-medium transition">
                    Scheduler Sweep
                  </Link>
                  <Link to="/super-admin/observability" className="flex-1 text-center text-xs px-2 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition">
                    Observability Log
                  </Link>
                </div>
                <div className="text-[11px] text-slate-500 px-1">
                  Run trial expires, verify zero PII leaks, check correlation trace timelines.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h2 className="text-blue-800 dark:text-blue-400 font-semibold mb-2">Sales & Success Resources</h2>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">You can consult the internal documentation for standardized pilot onboarding materials.</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-blue-700 dark:text-blue-300">
            <li>docs/FIRST_REAL_SALON_END_TO_END_REHEARSAL.md</li>
            <li>docs/FIRST_PILOT_ACCEPTANCE_CRITERIA.md</li>
            <li>docs/FOUNDER_PILOT_REHEARSAL_CHECKLIST.md</li>
            <li>docs/FIRST_PILOT_FIXTURE_DATA_PLAN.md</li>
            <li>docs/FIRST_MANUAL_PILOT_OPERATING_PACK.md</li>
            <li>docs/PILOT_SALON_INTAKE_FORM.md</li>
            <li>docs/MANUAL_PILOT_SETUP_CHECKLIST.md</li>
            <li>docs/FIRST_REAL_SALON_DEMO_SCRIPT.md</li>
            <li>docs/FIRST_MANUAL_PILOT_FEEDBACK_SCORECARD.md</li>
            <li>docs/SUPPORT_RESPONSE_TEMPLATES.md</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-6" id="live-pilot-execution-card">
        <h2 className="text-amber-900 dark:text-amber-400 font-bold mb-3 flex items-center gap-2 text-lg">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-sm font-bold">🚀</span>
          First Live Pilot Execution Hub
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Operational Links</h3>
            <div className="flex flex-col gap-2">
              <Link to="/super-admin/provisioning" className="text-xs px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded font-medium transition block">
                👥 Manual Provisioning Portal
              </Link>
              <Link to="/super-admin/pilots" className="text-xs px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded font-medium transition block">
                📊 Onboarding & Pilot Tracker
              </Link>
              <Link to="/super-admin/scheduler" className="text-xs px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded font-medium transition block">
                ⏰ Background Jobs Scheduler
              </Link>
              <Link to="/super-admin/observability" className="text-xs px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded font-medium transition block">
                🔍 System Observability Logs
              </Link>
              <Link to="/super-admin/legal" className="text-xs px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded font-medium transition block">
                ⚖️ Legal Consent & Policy Ledger
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-3">Live Pilot Step-by-Step Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <input type="checkbox" readOnly checked className="rounded text-amber-600 focus:ring-amber-500" />
                <span>Contact potential salon using outreach pack</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" readOnly checked className="rounded text-amber-600 focus:ring-amber-500" />
                <span>Qualify salon criteria and tech-readiness</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" readOnly checked className="rounded text-amber-600 focus:ring-amber-500" />
                <span>Complete intake questionnaire / salon data</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" readOnly checked className="rounded text-amber-600 focus:ring-amber-500" />
                <span>Provision pilot tenant in Super Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" readOnly checked className="rounded text-amber-600 focus:ring-amber-500" />
                <span>Configure public page (services, staff, hours)</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" readOnly checked className="rounded text-amber-600 focus:ring-amber-500" />
                <span>Run first dummy booking validation</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" readOnly checked className="rounded text-amber-600 focus:ring-amber-500" />
                <span>Check Outbox log for communication simulation</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" readOnly checked className="rounded text-amber-600 focus:ring-amber-500" />
                <span>Test self-service customer portal link</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" readOnly checked className="rounded text-amber-600 focus:ring-amber-500" />
                <span>Run scheduler daily sweep simulations</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" readOnly checked className="rounded text-amber-600 focus:ring-amber-500" />
                <span>Review system audit trials and logs</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 mt-1">
                <input type="checkbox" readOnly checked className="rounded text-amber-600 focus:ring-amber-500" />
                <span className="font-semibold text-amber-900 dark:text-amber-400">Complete day 7 scorecard and convert / extend / terminate</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-950/40 rounded border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
              <span className="text-sm">⚠️</span>
              <div>
                <strong>Güvenli Ödeme Uyarısı:</strong> Ücretli manuel pilot için şirket, fatura ve hukuki/mali inceleme tamamlanmalıdır. Sanal POS entegrasyonu tamamen devreye alınana kadar otomatik kart çekimleri aktif edilemez.
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SuperAdminPilotTrackerPage;
