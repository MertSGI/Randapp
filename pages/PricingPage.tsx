import React from 'react';
import { Link } from 'react-router-dom';

const PricingPage: React.FC = () => {
  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">Fiyatlar</h1>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: 'Starter', price: '499', features: ['1 Çalışan', '10 Hizmet', 'Randevu Sistemi'] },
          { name: 'Professional', price: '999', features: ['5 Çalışan', 'Sınırsız Hizmet', 'Özel Domain (Yakında)'] },
          { name: 'Premium', price: '1999', features: ['Sınırsız Çalışan', 'Gelişmiş Raporlar', 'API Erişimi'] },
        ].map((plan) => (
          <div key={plan.name} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
            <h3 className="text-2xl font-bold mb-4 dark:text-white">{plan.name}</h3>
            <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-6">₺{plan.price}<span className="text-lg text-gray-400 font-normal">/ay</span></div>
            <ul className="space-y-3 mb-8 text-gray-600 dark:text-gray-300">
              {plan.features.map(f => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            <Link to="/demo" className="block w-full bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-slate-600 transition">
              Başla
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
