import React, { useState, useEffect } from 'react';
import { subscriptionService } from '../../services/subscriptionService';
import { paymentDiagnosticsService, DiagnosticResponse } from '../../services/paymentDiagnosticsService';
import { paymentSandboxTestService } from '../../services/paymentSandboxTestService';
import { useAuth } from '../../contexts/AuthContext';

const SuperAdminPaymentTestPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  const [tenantId, setTenantId] = useState<string>('sandbox-tenant-123');
  const [planId, setPlanId] = useState<string>('starter');
  
  const [checkoutResult, setCheckoutResult] = useState<any>(null);
  const [checkoutError, setCheckoutError] = useState<any>(null);
  
  const [healthResultCheckout, setHealthResultCheckout] = useState<DiagnosticResponse | null>(null);
  const [healthResultWebhook, setHealthResultWebhook] = useState<DiagnosticResponse | null>(null);
  const [healthResultSync, setHealthResultSync] = useState<DiagnosticResponse | null>(null);

  const testCheckoutSession = async () => {
    setCheckoutResult(null);
    setCheckoutError(null);
    try {
      // Test reference codes first
      const planValidation = paymentSandboxTestService.validatePlanReferenceCodes(planId);
      if (!planValidation.valid) {
          setCheckoutError(planValidation);
          return;
      }
      
      const result = await paymentSandboxTestService.testCheckoutSession(planId, tenantId);
      if (result.success) {
          setCheckoutResult(result);
      } else {
          setCheckoutError(result);
      }
    } catch (error: any) {
      setCheckoutError({
        message: error.message,
        details: error
      });
    }
  };

  const testHealthEndpoints = async () => {
      setHealthResultCheckout(await paymentDiagnosticsService.runFunctionDiagnostic('create-checkout-session'));
      setHealthResultWebhook(await paymentDiagnosticsService.runFunctionDiagnostic('payment-webhook'));
      setHealthResultSync(await paymentDiagnosticsService.runFunctionDiagnostic('subscription-sync'));
  };

  const envInfo = paymentDiagnosticsService.getFrontendEnvironmentInfo();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Integration Readiness & Diagnostics (Phase 9)</h1>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold dark:text-white">Environment Config & Safety</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded border dark:border-slate-700">
            <span className="text-xs text-slate-500 uppercase">Provider</span>
            <div className="font-mono text-lg dark:text-white">{envInfo.paymentProvider}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded border dark:border-slate-700">
            <span className="text-xs text-slate-500 uppercase">Data Mode</span>
            <div className="font-mono text-lg dark:text-white">{envInfo.dataMode}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded border dark:border-slate-700">
            <span className="text-xs text-slate-500 uppercase">Supabase URL</span>
            <div className="font-mono text-lg dark:text-white flex items-center gap-2">
                {envInfo.supabaseUrlConfigured ? <span className="text-green-500">Configured</span> : <span className="text-red-500">Missing</span>}
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded border dark:border-slate-700">
            <span className="text-xs text-slate-500 uppercase">Frontend Secrets Check</span>
            <div className="font-mono text-lg dark:text-white">
                {envInfo.noFrontendSecretsExposed ? <span className="text-green-500">Safe (Clean)</span> : <span className="text-red-500 flex items-center">WARNING: SECRETS LEAKED!</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold dark:text-white">Edge Function Health Diagnostics</h2>
        <div className="flex items-center gap-4 border-b pb-4 dark:border-slate-700">
            <button onClick={testHealthEndpoints} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Run Function Diagnostics
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">Safely queries functions with `diagnostic: true` parameter.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Checkout */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded border dark:border-slate-700">
               <h3 className="font-semibold mb-2 dark:text-white">create-checkout-session</h3>
               {!healthResultCheckout ? <p className="text-sm text-gray-500">Not tested yet.</p> : (
                   <div className="text-xs space-y-1">
                       <p>Status: <span className={healthResultCheckout.canProceed ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{healthResultCheckout.mode}</span></p>
                       <p>Missing Env: {healthResultCheckout.missingEnvNames?.join(', ') || 'None'}</p>
                   </div>
               )}
            </div>

            {/* Webhook */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded border dark:border-slate-700">
               <h3 className="font-semibold mb-2 dark:text-white">payment-webhook</h3>
               {!healthResultWebhook ? <p className="text-sm text-gray-500">Not tested yet.</p> : (
                   <div className="text-xs space-y-1">
                       <p>Status: <span className={healthResultWebhook.canProceed ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{healthResultWebhook.mode}</span></p>
                       <p>Missing Env: {healthResultWebhook.missingEnvNames?.join(', ') || 'None'}</p>
                   </div>
               )}
            </div>

            {/* Sync */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded border dark:border-slate-700">
               <h3 className="font-semibold mb-2 dark:text-white">subscription-sync</h3>
               {!healthResultSync ? <p className="text-sm text-gray-500">Not tested yet.</p> : (
                   <div className="text-xs space-y-1">
                       <p>Status: <span className={healthResultSync.canProceed ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{healthResultSync.mode}</span></p>
                       <p>Missing Env: {healthResultSync.missingEnvNames?.join(', ') || 'None'}</p>
                   </div>
               )}
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold dark:text-white">Sandbox Checkout Test Harness</h2>
            <span className="text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300 px-2 py-1 rounded border border-gray-200 dark:border-slate-600">Simulates User CTA</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Tenant ID (Mock)</label>
            <input type="text" value={tenantId} readOnly className="w-full border p-2 rounded dark:bg-slate-900 bg-gray-100 text-gray-500 dark:border-slate-700" />
          </div>
          <div>
             <label className="block text-sm font-medium mb-1 dark:text-slate-300">Plan</label>
             <select value={planId} onChange={e => setPlanId(e.target.value)} className="w-full border p-2 rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white">
               <option value="starter">Starter</option>
               <option value="professional">Professional</option>
               <option value="premium">Premium</option>
             </select>
          </div>
        </div>

        <div className="pt-4 space-x-3">
          <button onClick={testCheckoutSession} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Test Checkout Simulation
          </button>
        </div>

        {checkoutResult && (
          <pre className="mt-4 bg-gray-100 dark:bg-slate-900 p-4 rounded overflow-auto text-sm text-green-700 dark:text-green-400">
            {JSON.stringify(checkoutResult, null, 2)}
          </pre>
        )}
        {checkoutError && (
          <pre className="mt-4 bg-red-50 dark:bg-red-900/20 p-4 rounded overflow-auto text-sm text-red-600 dark:text-red-400">
            {JSON.stringify(checkoutError, null, 2)}
          </pre>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold dark:text-white">Webhook Testing Simulator</h2>
        <p className="text-sm dark:text-slate-300">Run this to test the webhook endpoint's logic without hitting real providers.</p>
        <button onClick={() => {
           navigator.clipboard.writeText(`curl -X POST "${envInfo.edgeFunctionBase || 'http://localhost:54321/functions/v1'}/payment-webhook" \\
  -H "Content-Type: application/json" \\
  -H "x-iyzico-signature: sandbox-test" \\
  -d '{"event":"subscription.trial.created", "subscriptionReferenceCode":"MOCK_123"}'`);
           alert("Copied local curl payload to clipboard");
        }} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-mono text-sm">
          Copy Webhook Mock cURL
        </button>
      </div>
    </div>
  );
};

export default SuperAdminPaymentTestPage;
