import React, { useState } from 'react';
import { subscriptionService } from '../../services/subscriptionService';
import { useAuth } from '../../contexts/AuthContext';

const SuperAdminPaymentTestPage: React.FC = () => {
  const { user } = useAuth();
  
  const [tenantId, setTenantId] = useState<string>('sandbox-tenant-123');
  const [planId, setPlanId] = useState<string>('starter');
  
  const [checkoutResult, setCheckoutResult] = useState<any>(null);
  const [checkoutError, setCheckoutError] = useState<any>(null);
  
  const [healthResult, setHealthResult] = useState<any>(null);
  const [healthError, setHealthError] = useState<any>(null);

  const testCheckoutSession = async () => {
    setCheckoutResult(null);
    setCheckoutError(null);
    try {
      // In subscriptionService, we have startCheckout
      const checkoutUrl = await subscriptionService.startCheckout(tenantId, planId);
      setCheckoutResult({ url: checkoutUrl, note: "Redirect success from service layer" });
    } catch (error: any) {
      setCheckoutError({
        message: error.message,
        details: error
      });
    }
  };

  const testHealthEndpoint = async () => {
    setHealthResult(null);
    setHealthError(null);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl) throw new Error("VITE_SUPABASE_URL undefined");
      
      const res = await fetch(`${supabaseUrl}/functions/v1/payment-health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      setHealthResult(data);
    } catch (error: any) {
      setHealthError({
        message: error.message
      });
    }
  };

  const paymentProvider = import.meta.env.VITE_PAYMENT_PROVIDER || 'mock';
  const dataMode = import.meta.env.VITE_DATA_MODE || 'mock';

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Payment Test Diagnostics</h1>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold dark:text-white">Environment Config</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded border dark:border-slate-700">
            <span className="text-sm text-slate-500 uppercase">Provider</span>
            <div className="font-mono text-lg dark:text-white">{paymentProvider}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded border dark:border-slate-700">
            <span className="text-sm text-slate-500 uppercase">Data Mode</span>
            <div className="font-mono text-lg dark:text-white">{dataMode}</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold dark:text-white">Edge Function Health</h2>
        <button onClick={testHealthEndpoint} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Run Health Check
        </button>
        {healthResult && (
          <pre className="bg-gray-100 dark:bg-slate-900 p-4 rounded overflow-auto text-sm text-green-700 dark:text-green-400">
            {JSON.stringify(healthResult, null, 2)}
          </pre>
        )}
        {healthError && (
          <pre className="bg-red-50 dark:bg-red-900/20 p-4 rounded overflow-auto text-sm text-red-600 dark:text-red-400">
            {JSON.stringify(healthError, null, 2)}
          </pre>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold dark:text-white">Checkout Configuration</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Tenant ID</label>
            <input type="text" value={tenantId} onChange={e => setTenantId(e.target.value)} className="w-full border p-2 rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
          </div>
          <div>
             <label className="block text-sm font-medium mb-1 dark:text-slate-300">Plan</label>
             <select value={planId} onChange={e => setPlanId(e.target.value)} className="w-full border p-2 rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white">
               <option value="starter">Starter</option>
               <option value="professional">Professional</option>
               <option value="premium">Premium</option>
               <option value="invalid_plan">Invalid Plan (Test Error)</option>
             </select>
          </div>
        </div>

        <div className="pt-4 space-x-3">
          <button onClick={testCheckoutSession} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Test Checkout Session Oluştur
          </button>
        </div>

        {checkoutResult && (
          <pre className="bg-gray-100 dark:bg-slate-900 p-4 rounded overflow-auto text-sm text-green-700 dark:text-green-400">
            {JSON.stringify(checkoutResult, null, 2)}
          </pre>
        )}
        {checkoutError && (
          <pre className="bg-red-50 dark:bg-red-900/20 p-4 rounded overflow-auto text-sm text-red-600 dark:text-red-400">
            {JSON.stringify(checkoutError, null, 2)}
          </pre>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold dark:text-white">Webhook Testing</h2>
        <p className="text-sm dark:text-slate-300">To test the webhook, use the curl payload from the documentation.</p>
        <button onClick={() => {
           navigator.clipboard.writeText(`curl -X POST "http://127.0.0.1:54321/functions/v1/payment-webhook" \\
  -H "Content-Type: application/json" \\
  -H "x-iyzico-signature: sandbox-test" \\
  -d '{"event":"subscription.trial.created", "subscriptionReferenceCode":"MOCK_123"}'`);
           alert("Copied local curl payload to clipboard");
        }} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
          Copy Local Mock Webhook Payload
        </button>
      </div>
    </div>
  );
};

export default SuperAdminPaymentTestPage;
