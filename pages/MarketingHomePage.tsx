import React from 'react';
import { Link } from 'react-router-dom';

const MarketingHomePage: React.FC = () => {
  return (
    <div className="py-20 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6">
        Salonunuzu <span className="text-blue-600 dark:text-blue-400">Geleceğe</span> Taşıyın
      </h1>
      <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
        Kendi markanızla anında online ve WhatsApp üzerinden randevu alın. 
        Randapp ile işlerinizi büyütün, komisyon ödemeyin.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <Link to="/demo" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">
          Hemen Demo Oluştur
        </Link>
        <Link to="/features" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-8 py-3 rounded-xl font-bold shadow-sm border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
          Özellikleri Keşfet
        </Link>
      </div>
    </div>
  );
};

export default MarketingHomePage;
