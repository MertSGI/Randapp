import React, { useState } from 'react';
import { manualProvisioningService } from '../../services/manualProvisioningService';
import { CheckCircle, XCircle } from 'lucide-react';

export const SuperAdminManualProvisioningPage: React.FC = () => {
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [publicSlug, setPublicSlug] = useState('');
  const [planId, setPlanId] = useState('free');
  const [billingSource, setBillingSource] = useState<'offline_payment' | 'complimentary' | 'pilot_exception' | 'self_service_checkout'>('offline_payment');
  const [publishStatus, setPublishStatus] = useState(true);
  
  const [status, setStatus] = useState<{success?: boolean; error?: string; tenantId?: string}>({});

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await manualProvisioningService.provisionTenant({
      businessName,
      ownerName,
      ownerEmail,
      ownerPhone: '',
      planId,
      billingSource,
      subscriptionStatus: 'active',
      publicSlug,
      publishStatus
    });
    setStatus(result);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Manual Offline Provisioning</h2>
      <form onSubmit={handleProvision} className="space-y-4 text-left">
        <div>
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Business Name</label>
           <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white p-2 border" />
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Public Slug (URL)</label>
           <input type="text" value={publicSlug} onChange={e => setPublicSlug(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white p-2 border" />
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Owner Name</label>
           <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white p-2 border" />
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Owner Email</label>
           <input type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white p-2 border" />
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Plan</label>
           <select value={planId} onChange={e => setPlanId(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white p-2 border">
              <option value="free">Başlangıç (Free)</option>
              <option value="standard">Standart</option>
              <option value="professional">Profesyonel</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Kurumsal</option>
           </select>
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Billing Source</label>
           <select value={billingSource} onChange={e => setBillingSource(e.target.value as any)} className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white p-2 border">
              <option value="offline_payment">Offline/EFT Payment</option>
              <option value="complimentary">Complimentary</option>
              <option value="pilot_exception">Pilot Deal Exception</option>
           </select>
        </div>
        <div className="flex items-center gap-2 mt-4">
           <input type="checkbox" checked={publishStatus} onChange={e => setPublishStatus(e.target.checked)} />
           <span className="text-sm text-slate-700 dark:text-slate-300">Publish immediately across public URLs</span>
        </div>
        
        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
          Provision Tenant
        </button>

        {status.success && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5"/> Tenant successfully provisioned: {status.tenantId}
          </div>
        )}
        {status.error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2">
            <XCircle className="w-5 h-5"/> Error: {status.error}
          </div>
        )}
      </form>
    </div>
  );
};

export default SuperAdminManualProvisioningPage;
