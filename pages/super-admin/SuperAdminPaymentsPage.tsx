import React from 'react';
import { Link } from 'react-router-dom';

const SuperAdminPaymentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Ödemeler (Payments)</h1>
        <Link 
          to="/super-admin/payment-test" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
        >
          Mock Ödeme Testi
        </Link>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Canlı Ödeme Kaydı Yok</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Platform şu anda Mock ortamında çalıştığı için Iyzico veya Stripe canlı ödeme logları görüntülenemiyor. Edge Functions aktivasyonu tamamlandığında ödeme kayıtları bu alana düşecektir.
          </p>
        </div>
      </div>
    </div>
  );
};
export default SuperAdminPaymentsPage;
