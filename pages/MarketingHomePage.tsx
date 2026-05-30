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
      <section className="text-center px-4 max-w-4xl mx-auto">
        <div className="inline-block bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold px-4 py-1.5 rounded-full text-xs md:text-sm mb-6 border border-blue-100 dark:border-slate-700">
          {t.marketing.home.badge}
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
          {language === 'tr' ? (
            <>
              <div className="h-[1.2em] relative overflow-hidden inline-flex w-full justify-center align-bottom px-0 md:px-2 flex-col">
                 <span key={currentPhrase} className="absolute inset-x-0 bottom-0 animate-slideUpFade whitespace-nowrap overflow-visible text-gray-800 dark:text-gray-200 text-[0.85em] sm:text-[1em]">
                   {currentPhrase}
                 </span>
              </div>
              <br/>
              için <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">web sitesi + akıllı randevu</span> sistemi
            </>
          ) : (
            <>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Website + smart booking</span> system<br/>
              for your <div className="h-[1.2em] relative overflow-hidden inline-flex min-w-[240px] md:min-w-[280px] align-bottom ml-1 md:ml-2">
                 <span key={currentPhrase} className="absolute left-0 bottom-0 animate-slideUpFade whitespace-nowrap overflow-visible text-gray-800 dark:text-gray-200 text-[0.85em] sm:text-[1em]">
                   {currentPhrase}
                 </span>
              </div>
            </>
          )}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 mx-auto leading-relaxed px-2">
          {t.marketing.home.subtitle}
        </p>
        <p className="mt-2 text-xs md:text-sm text-gray-500 dark:text-gray-500 font-medium font-sans italic">
          {t.marketing.home.disclaimer}
        </p>
        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/demo" className="bg-blue-600 text-white px-8 py-3.5 md:py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition transform hover:-translate-y-1 block w-full sm:w-auto text-center">
            {(import.meta as any).env.VITE_PAYMENT_PROVIDER === 'iyzico' 
              ? t.marketing.home.btn_trial 
              : t.marketing.home.btn_preview}
          </Link>
          <Link to="/pricing" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-8 py-3.5 md:py-4 rounded-xl font-bold shadow-sm border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition block w-full sm:w-auto text-center">
            {t.marketing.home.btn_pricing}
          </Link>
        </div>
        <div className="mt-12 md:mt-16 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700 transform -skew-y-2 max-w-4xl mx-auto">
          {/* Mockup of public page */}
          <div className="bg-slate-100 dark:bg-slate-900 px-3 py-2 md:px-4 md:py-3 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
            <div className="flex gap-1.5"><div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-red-400 rounded-full"></div><div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-yellow-400 rounded-full"></div><div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full"></div></div>
            <div className="mx-auto bg-white dark:bg-slate-800 text-[10px] md:text-xs px-12 md:px-24 py-1 rounded shadow-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] md:max-w-none">randapp.com/{language === 'tr' ? 'benimisletmem' : 'mybusiness'}</div>
          </div>
          <div className="h-48 sm:h-72 md:h-80 bg-gray-50 dark:bg-slate-800 relative z-10 transform skew-y-2 opacity-90 p-4 md:p-8 flex flex-col">
            <div className="w-full flex-grow border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl flex items-center justify-center p-4">
               <div className="text-center space-y-3 md:space-y-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full mx-auto shadow-md"></div>
                  <div className="h-3 md:h-4 bg-gray-200 dark:bg-slate-700 rounded w-40 md:w-48 mx-auto"></div>
                  <div className="h-2.5 md:h-3 bg-gray-200 dark:bg-slate-700 rounded w-24 md:w-32 mx-auto"></div>
                  <div className="flex justify-center gap-2 mt-4 hidden sm:flex">
                     <div className="h-8 md:h-10 bg-blue-100 dark:bg-slate-700 rounded-lg w-24 md:w-32"></div>
                     <div className="h-8 md:h-10 bg-blue-600 rounded-lg w-24 md:w-32"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-slate-50 dark:bg-slate-800/50 py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-16 dark:text-white">{t.marketing.home.problem_title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-5 md:mb-6 text-xl md:text-2xl">📱</div>
              <h3 className="text-lg md:text-xl font-bold mb-3 dark:text-white">{t.marketing.home.problem_1_title}</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{t.marketing.home.problem_1_desc}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-5 md:mb-6 text-xl md:text-2xl">💬</div>
              <h3 className="text-lg md:text-xl font-bold mb-3 dark:text-white">{t.marketing.home.problem_2_title}</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{t.marketing.home.problem_2_desc}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center mb-5 md:mb-6 text-xl md:text-2xl">🌐</div>
              <h3 className="text-lg md:text-xl font-bold mb-3 dark:text-white">{t.marketing.home.problem_3_title}</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{t.marketing.home.problem_3_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust and Workflow */}
      <section className="px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center dark:text-white">{t.marketing.home.how_it_works_title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left sm:text-center">
          <div className="p-4 md:p-6 bg-white dark:bg-transparent rounded-xl sm:rounded-none shadow-sm sm:shadow-none border border-gray-100 sm:border-none dark:border-slate-800 flex flex-row sm:flex-col items-center sm:items-center gap-4 sm:gap-0">
             <div className="text-3xl md:text-4xl font-black text-blue-100 dark:text-slate-800 mb-0 sm:mb-4 w-12 text-center">1</div>
             <div>
                <h4 className="font-bold text-base md:text-lg mb-1 sm:mb-2 dark:text-white">{t.marketing.home.step_1_title}</h4>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{t.marketing.home.step_1_desc}</p>
             </div>
          </div>
          <div className="p-4 md:p-6 bg-white dark:bg-transparent rounded-xl sm:rounded-none shadow-sm sm:shadow-none border border-gray-100 sm:border-none dark:border-slate-800 flex flex-row sm:flex-col items-center sm:items-center gap-4 sm:gap-0">
             <div className="text-3xl md:text-4xl font-black text-blue-200 dark:text-slate-700 mb-0 sm:mb-4 w-12 text-center">2</div>
             <div>
                <h4 className="font-bold text-base md:text-lg mb-1 sm:mb-2 dark:text-white">{t.marketing.home.step_2_title}</h4>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{t.marketing.home.step_2_desc}</p>
             </div>
          </div>
          <div className="p-4 md:p-6 bg-white dark:bg-transparent rounded-xl sm:rounded-none shadow-sm sm:shadow-none border border-gray-100 sm:border-none dark:border-slate-800 flex flex-row sm:flex-col items-center sm:items-center gap-4 sm:gap-0">
             <div className="text-3xl md:text-4xl font-black text-blue-300 dark:text-slate-600 mb-0 sm:mb-4 w-12 text-center">3</div>
             <div>
                <h4 className="font-bold text-base md:text-lg mb-1 sm:mb-2 dark:text-white">{t.marketing.home.step_3_title}</h4>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{t.marketing.home.step_3_desc}</p>
             </div>
          </div>
          <div className="p-4 md:p-6 bg-white dark:bg-transparent rounded-xl sm:rounded-none shadow-sm sm:shadow-none border border-gray-100 sm:border-none dark:border-slate-800 flex flex-row sm:flex-col items-center sm:items-center gap-4 sm:gap-0">
             <div className="text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-500 mb-0 sm:mb-4 w-12 text-center">4</div>
             <div>
                <h4 className="font-bold text-base md:text-lg mb-1 sm:mb-2 dark:text-white">{t.marketing.home.step_4_title}</h4>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{t.marketing.home.step_4_desc}</p>
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

