import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

const MarketingHomePage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const phrases = t.marketing.rotating_phrases || [];

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [phrases.length]);

  const currentPhrase = phrases[phraseIndex] || '';

  return (
    <div className="flex flex-col space-y-16 md:space-y-24 py-8 md:py-12">
      {/* Hero Section */}
      <section className="text-center px-4 max-w-5xl mx-auto">
        <div className="inline-block bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold px-5 py-2 rounded-full text-xs md:text-sm mb-8 border border-blue-100 dark:border-slate-700">
          {t.marketing.home.badge}
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.15]">
          {t.marketing.home.title}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300 mx-auto leading-relaxed max-w-3xl">
          {t.marketing.home.subtitle}
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/demo" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition transform hover:-translate-y-1 block w-full sm:w-auto text-center md:min-w-[200px]">
            {t.marketing.home.btn_preview}
          </Link>
          <Link to="/pricing" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-bold shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition block w-full sm:w-auto text-center md:min-w-[200px]">
            {t.marketing.home.btn_pricing}
          </Link>
        </div>

        {/* Trust Chips */}
        <div className="mt-12 flex flex-wrap justify-center gap-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
           <div className="flex items-center gap-1.5"><span className="text-green-500">✓</span> 7 gün ücretsiz demo</div>
           <div className="flex items-center gap-1.5 hidden sm:flex"><span className="text-green-500">✓</span> Bu demoda satış/kredi kartı kapalı</div>
           <div className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Web sitesi + online randevu</div>
           <div className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Müşteri hafızası</div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-slate-50 dark:bg-slate-800/20 py-20 px-4 mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{t.marketing.home.problem_title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-3xl">🌐</div>
              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t.marketing.home.problem_1_title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{t.marketing.home.problem_1_desc}</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition">
              <div className="w-14 h-14 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mb-6 text-3xl">📅</div>
              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t.marketing.home.problem_3_title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{t.marketing.home.problem_3_desc}</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition md:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 text-3xl">🧠</div>
              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t.marketing.home.problem_2_title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{t.marketing.home.problem_2_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust and Workflow */}
      <section className="px-4 py-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{t.marketing.home.how_it_works_title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
             <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl font-black text-slate-400 mb-6">1</div>
             <h4 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">{t.marketing.home.step_1_title}</h4>
             <p className="text-sm text-slate-600 dark:text-slate-400">{t.marketing.home.step_1_desc}</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
             <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-2xl font-black text-blue-400 mb-6">2</div>
             <h4 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">{t.marketing.home.step_2_title}</h4>
             <p className="text-sm text-slate-600 dark:text-slate-400">{t.marketing.home.step_2_desc}</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
             <div className="w-16 h-16 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center text-2xl font-black text-violet-400 mb-6">3</div>
             <h4 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">{t.marketing.home.step_3_title}</h4>
             <p className="text-sm text-slate-600 dark:text-slate-400">{t.marketing.home.step_3_desc}</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
             <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-2xl font-black text-green-500 mb-6">4</div>
             <h4 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">{t.marketing.home.step_4_title}</h4>
             <p className="text-sm text-slate-600 dark:text-slate-400">{t.marketing.home.step_4_desc}</p>
          </div>
        </div>
      </section>

      {/* Demo Mockup Section */}
      <section className="px-4 pt-10 pb-20 max-w-5xl mx-auto w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <div className="flex gap-1.5"><div className="w-3 h-3 bg-red-400 rounded-full"></div><div className="w-3 h-3 bg-amber-400 rounded-full"></div><div className="w-3 h-3 bg-green-400 rounded-full"></div></div>
            <div className="mx-auto bg-white dark:bg-slate-800 text-xs px-12 md:px-24 py-1.5 rounded-md shadow-sm text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis w-1/2 text-center">randapp.com/{language === 'tr' ? 'benimisletmem' : 'mybusiness'}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-8 flex flex-col md:flex-row gap-8 items-center justify-center">
             <div className="flex-1 w-full max-w-sm">
                <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
                   <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-violet-500 rounded-full shadow-md mb-4"></div>
                   <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                   <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-8"></div>
                   <div className="h-12 bg-blue-600 rounded-xl w-full mb-4"></div>
                   <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg w-full"></div>
                </div>
             </div>
             <div className="flex-1 w-full max-w-sm hidden md:block">
                 <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-6">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
                    <div className="space-y-4">
                       <div className="flex items-center gap-4 p-3 border border-slate-100 dark:border-slate-800 rounded-lg">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                          <div className="flex-1"><div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div></div>
                       </div>
                       <div className="flex items-center gap-4 p-3 border border-slate-100 dark:border-slate-800 rounded-lg">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                          <div className="flex-1"><div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div></div>
                       </div>
                    </div>
                 </div>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 md:py-20 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 dark:text-white">{t.marketing.home.faq_title}</h2>
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h4 className="font-bold text-base md:text-lg mb-2 dark:text-white">{t.marketing.home.faq_1_q}</h4>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{t.marketing.home.faq_1_a}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h4 className="font-bold text-base md:text-lg mb-2 dark:text-white">{t.marketing.home.faq_2_q}</h4>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{t.marketing.home.faq_2_a}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h4 className="font-bold text-base md:text-lg mb-2 dark:text-white">{t.marketing.home.faq_3_q}</h4>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{t.marketing.home.faq_3_a}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h4 className="font-bold text-base md:text-lg mb-2 dark:text-white">{t.marketing.home.faq_4_q}</h4>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{t.marketing.home.faq_4_a}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h4 className="font-bold text-base md:text-lg mb-2 dark:text-white">{t.marketing.home.faq_5_q}</h4>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{t.marketing.home.faq_5_a}</p>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="bg-blue-600 py-16 md:py-20 px-6 text-center rounded-3xl mx-4 md:max-w-6xl md:mx-auto mb-8 md:mb-12 shadow-2xl">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">{t.marketing.home.cta_bottom_title}</h2>
        <p className="text-blue-100 text-sm md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto">{t.marketing.home.cta_bottom_desc}</p>
        <Link to="/demo" className="inline-block w-full sm:w-auto bg-white text-blue-600 px-8 py-3.5 md:px-10 md:py-4 rounded-xl font-bold shadow-lg hover:bg-gray-50 transition transform hover:-translate-y-1">
          {(import.meta as any).env.VITE_PAYMENT_PROVIDER === 'iyzico' 
            ? t.marketing.home.btn_trial 
            : t.marketing.home.btn_preview}
        </Link>
      </section>
    </div>
  );
};

export default MarketingHomePage;

