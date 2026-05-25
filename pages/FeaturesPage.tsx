import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

const FeaturesPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="py-12">
      <div className="text-center mb-16 max-w-3xl mx-auto px-4">
         <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">{t.marketing.features.page_title}</h1>
         <p className="text-xl text-gray-600 dark:text-gray-400">{t.marketing.features.page_subtitle}</p>
      </div>
      
      <div className="max-w-6xl mx-auto space-y-12 px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
           <div>
              <h3 className="text-3xl font-bold mb-4 dark:text-white">{t.marketing.features.feat1_title}</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{t.marketing.features.feat1_desc}</p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                 <li className="flex items-center gap-2"><span>✅</span> {t.marketing.features.feat1_1}</li>
                 <li className="flex items-center gap-2"><span>✅</span> {t.marketing.features.feat1_2}</li>
                 <li className="flex items-center gap-2"><span>✅</span> {t.marketing.features.feat1_3}</li>
              </ul>
           </div>
           <div className="bg-blue-50 dark:bg-slate-800 rounded-2xl p-8 aspect-video flex items-center justify-center border border-blue-100 dark:border-slate-700">
              <span className="text-blue-500 font-bold text-xl">✨ {t.marketing.features.feat1_img}</span>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
           <div className="bg-indigo-50 dark:bg-slate-800 rounded-2xl p-8 aspect-video flex items-center justify-center border border-indigo-100 dark:border-slate-700 md:order-1 order-2">
              <span className="text-indigo-500 font-bold text-xl">📅 {t.marketing.features.feat2_img}</span>
           </div>
           <div className="md:order-2 order-1">
              <h3 className="text-3xl font-bold mb-4 dark:text-white">{t.marketing.features.feat2_title}</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{t.marketing.features.feat2_desc}</p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                 <li className="flex items-center gap-2"><span>✅</span> {t.marketing.features.feat2_1}</li>
                 <li className="flex items-center gap-2"><span>✅</span> {t.marketing.features.feat2_2}</li>
                 <li className="flex items-center gap-2"><span>✅</span> {t.marketing.features.feat2_3}</li>
              </ul>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
           <div>
              <h3 className="text-3xl font-bold mb-4 dark:text-white">{t.marketing.features.feat3_title}</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{t.marketing.features.feat3_desc}</p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                 <li className="flex items-center gap-2"><span>✅</span> {t.marketing.features.feat3_1}</li>
                 <li className="flex items-center gap-2"><span>✅</span> {t.marketing.features.feat3_2}</li>
                 <li className="flex items-center gap-2"><span>✅</span> {t.marketing.features.feat3_3}</li>
              </ul>
           </div>
           <div className="bg-purple-50 dark:bg-slate-800 rounded-2xl p-8 aspect-video flex items-center justify-center border border-purple-100 dark:border-slate-700">
              <span className="text-purple-500 font-bold text-xl">🤖 {t.marketing.features.feat3_img}</span>
           </div>
        </div>
      </div>

      <div className="mt-20 text-center px-4">
         <h2 className="text-3xl font-bold mb-8 dark:text-white">{t.marketing.features.ready_title}</h2>
         <div className="flex flex-col sm:flex-row justify-center gap-4">
           <Link to="/demo" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">{t.marketing.home.btn_preview}</Link>
           <Link to="/pricing" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold shadow-sm border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">{t.marketing.home.btn_pricing}</Link>
         </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
