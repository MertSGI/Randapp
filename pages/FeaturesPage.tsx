import React from 'react';

const FeaturesPage: React.FC = () => {
  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">Özellikler</h1>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-2xl font-semibold mb-2 dark:text-white">Gerçek Zamanlı Randevu</h3>
          <p className="text-gray-600 dark:text-gray-400">Müşterileriniz 7/24 randevu alabilir. Sistem müsaitlik durumunu otomatik yönetir.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-2xl font-semibold mb-2 dark:text-white">Size Özel Tasarım</h3>
          <p className="text-gray-600 dark:text-gray-400">Kendi logonuz, kendi renkleriniz. Müşterileriniz markanızı deneyimlesin.</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-2xl font-semibold mb-2 dark:text-white">Komisyon Yok</h3>
          <p className="text-gray-600 dark:text-gray-400">Pazaryerlerinin aksine her randevudan komisyon ödemezsiniz.</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
