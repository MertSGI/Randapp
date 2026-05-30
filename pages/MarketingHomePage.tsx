import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

const MarketingHomePage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const phrases = language === 'tr' 
    ? ['Kuaförler için', 'Berberler için', 'Güzellik salonları için', 'Klinikler için', 'Randevulu işletmeler için', "Nail Studio'lar için"]
    : ['For Barbers', 'For Hair Salons', 'For Beauty Clinics', 'For Nail Studios', 'For Spas', 'For Appointment Businesses'];

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
        <div className="inline-block bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 font-bold px-5 py-2 rounded-full text-xs md:text-sm mb-8 border border-violet-100 dark:border-violet-800">
          {t.marketing.home.badge}
        </div>
        
        <div className="mb-4 min-h-[3.5rem] sm:min-h-[1.3em] relative inline-flex w-full justify-center align-bottom px-2 flex-col">
            <span key={currentPhrase} className="animate-slideUpFade text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 font-extrabold text-3xl sm:text-5xl md:text-[56px] leading-tight tracking-tight">
                {currentPhrase}
            </span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.15]">
          {language === 'tr' ? 'Web siteniz, randevularınız ve müşteri hafızanız tek panelde.' : 'Your website, bookings, and CRM in one single dashboard.'}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300 mx-auto leading-relaxed max-w-3xl">
          {language === 'tr' ? 'Randapp; işletmenize profesyonel bir dijital vitrin, online randevu akışı, müşteri notları ve kampanya yönetimi sunar.' : t.marketing.home.subtitle}
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
           <div className="flex items-center gap-1.5"><span className="text-green-500">✓</span> {language === 'tr' ? '7 gün ücretsiz demo' : '7 day free demo'}</div>
           <div className="flex items-center gap-1.5 hidden sm:flex"><span className="text-amber-500">✓</span> {language === 'tr' ? 'Bu demoda satış/kredi kartı kapalı' : 'Payments disabled in demo'}</div>
           <div className="flex items-center gap-1.5"><span className="text-violet-500">✓</span> {language === 'tr' ? 'Web sitesi + online randevu' : 'Website + online booking'}</div>
           <div className="flex items-center gap-1.5"><span className="text-blue-500">✓</span> {language === 'tr' ? 'Müşteri hafızası' : 'Customer memory'}</div>
        </div>

        {/* Hero Product Visual Collage */}
        <div className="mt-16 md:mt-24 relative max-w-5xl mx-auto hidden sm:block h-[400px] mb-8">
           <div className="absolute left-0 top-10 w-1/3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 transform -rotate-3 z-10 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                 <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center font-bold text-xs">V</div>
                 <div>
                    <div className="h-3 w-24 bg-slate-800 dark:bg-slate-200 rounded mb-1"></div>
                    <div className="h-2 w-16 bg-slate-400 rounded"></div>
                 </div>
              </div>
              <div className="space-y-3">
                 <div className="h-10 bg-slate-50 dark:bg-slate-800 rounded-lg w-full flex items-center px-3 justify-between">
                    <div className="h-2 w-20 bg-slate-300 dark:bg-slate-600 rounded"></div>
                    <div className="h-3 w-10 bg-blue-500 rounded"></div>
                 </div>
                 <div className="h-10 bg-slate-50 dark:bg-slate-800 rounded-lg w-full flex items-center px-3 justify-between">
                    <div className="h-2 w-24 bg-slate-300 dark:bg-slate-600 rounded"></div>
                    <div className="h-3 w-10 bg-blue-500 rounded"></div>
                 </div>
                 <div className="h-8 bg-blue-600 rounded-lg w-full mt-4"></div>
              </div>
           </div>
           
           <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[45%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-5 z-20 hover:-translate-y-2 transition-transform duration-500">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex gap-1.5"><div className="w-3 h-3 bg-red-400 rounded-full"></div><div className="w-3 h-3 bg-amber-400 rounded-full"></div><div className="w-3 h-3 bg-green-400 rounded-full"></div></div>
                 <div className="bg-slate-100 dark:bg-slate-800 px-6 py-1 rounded-full text-[10px] text-slate-500 font-mono hidden md:block">randapp.com/studio</div>
              </div>
              <div className="flex flex-col items-center mb-6 text-center">
                 <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-violet-600 rounded-full shadow-lg mb-4"></div>
                 <div className="h-4 w-32 bg-slate-800 dark:bg-slate-200 rounded mb-2"></div>
                 <div className="h-2 w-48 bg-slate-400 rounded"></div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                 <div className="h-24 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800"></div>
                 <div className="h-24 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800"></div>
              </div>
              <div className="h-12 bg-blue-600 rounded-xl w-full flex items-center justify-center">
                 <div className="h-3 w-24 bg-white/80 rounded"></div>
              </div>
           </div>

           <div className="absolute right-0 top-12 w-1/3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 transform rotate-3 z-10 hover:rotate-0 transition-transform duration-500">
              <div className="flex justify-between items-start mb-4">
                  <div>
                     <div className="w-24 h-3 bg-slate-800 dark:bg-slate-200 rounded mb-2"></div>
                     <div className="w-16 h-2 bg-slate-400 rounded"></div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">⭐</div>
              </div>
              <div className="space-y-3">
                  <div className="w-full bg-amber-50/50 dark:bg-slate-800 rounded border border-amber-100 dark:border-slate-700 p-3">
                     <div className="w-16 h-2 bg-amber-300 dark:bg-slate-600 rounded mb-2"></div>
                     <div className="w-full h-2 bg-amber-200 dark:bg-slate-700 rounded mb-1.5"></div>
                     <div className="w-4/5 h-2 bg-amber-200 dark:bg-slate-700 rounded"></div>
                  </div>
                  <div className="flex gap-2 mt-2">
                     <div className="flex-1 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                     <div className="flex-1 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                  </div>
              </div>
           </div>
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

