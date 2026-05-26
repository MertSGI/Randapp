import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

const trPhrases = [
  "Kuaför ve güzellik salonunuz",
  "Berber salonunuz",
  "Nail studio'nuz",
  "Spa merkeziniz",
  "Diş kliniğiniz",
  "Özel kliniğiniz",
  "PT stüdyonuz",
  "Danışmanlık ofisiniz",
  "Randevulu işletmeniz"
];

const enPhrases = [
  "hair and beauty salon",
  "barber shop",
  "nail studio",
  "spa center",
  "dental clinic",
  "private clinic",
  "PT studio",
  "consulting office",
  "appointment-based business"
];

const MarketingHomePage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % trPhrases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const phrases = language === 'tr' ? trPhrases : enPhrases;
  const currentPhrase = phrases[phraseIndex];

  return (
    <div className="flex flex-col space-y-24 py-12">
      {/* Hero Section */}
      <section className="text-center px-4 max-w-4xl mx-auto">
        <div className="inline-block bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold px-4 py-1.5 rounded-full text-sm mb-6 border border-blue-100 dark:border-slate-700">
          {t.marketing.home.badge}
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
          {language === 'tr' ? (
            <>
              <div className="h-[1.2em] md:h-[1.2em] relative overflow-hidden inline-block w-full align-bottom px-2">
                 <span key={currentPhrase} className="absolute inset-x-0 bottom-0 animate-slideUpFade whitespace-nowrap text-gray-800 dark:text-gray-200">
                   {currentPhrase}
                 </span>
              </div>
              <br/>
              için <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">web sitesi + akıllı randevu</span> sistemi
            </>
          ) : (
            <>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Website + smart booking</span> system<br/>
              for your <div className="h-[1.2em] relative overflow-hidden inline-block min-w-[280px] align-bottom ml-2">
                 <span key={currentPhrase} className="absolute left-0 bottom-0 animate-slideUpFade whitespace-nowrap text-gray-800 dark:text-gray-200">
                   {currentPhrase}
                 </span>
              </div>
            </>
          )}
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 mx-auto leading-relaxed">
          {t.marketing.home.subtitle}
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500 font-medium font-sans italic">
          {t.marketing.home.disclaimer}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/demo" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition transform hover:-translate-y-1">
            {t.marketing.home.btn_preview}
          </Link>
          <Link to="/pricing" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold shadow-sm border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
            {t.marketing.home.btn_pricing}
          </Link>
        </div>
        <div className="mt-16 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700 transform -skew-y-2 max-w-5xl mx-auto">
          {/* Mockup of public page */}
          <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
            <div className="flex gap-1.5"><div className="w-3 h-3 bg-red-400 rounded-full"></div><div className="w-3 h-3 bg-yellow-400 rounded-full"></div><div className="w-3 h-3 bg-green-400 rounded-full"></div></div>
            <div className="mx-auto bg-white dark:bg-slate-800 text-xs px-24 py-1 rounded shadow-sm text-gray-500">randapp.com/{language === 'tr' ? 'benimsalonum' : 'mysalon'}</div>
          </div>
          <div className="h-64 sm:h-96 bg-gray-50 dark:bg-slate-800 relative z-10 transform skew-y-2 opacity-90 p-8 flex flex-col">
            <div className="w-full flex-grow border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl flex items-center justify-center p-4">
               <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full mx-auto shadow-md"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-48 mx-auto"></div>
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-32 mx-auto"></div>
                  <div className="flex justify-center gap-2 mt-4">
                     <div className="h-10 bg-blue-100 dark:bg-slate-700 rounded-lg w-32"></div>
                     <div className="h-10 bg-blue-600 rounded-lg w-32"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-slate-50 dark:bg-slate-800/50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 dark:text-white">{t.marketing.home.problem_title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6 text-2xl">📱</div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">{t.marketing.home.problem_1_title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t.marketing.home.problem_1_desc}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 text-2xl">💬</div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">{t.marketing.home.problem_2_title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t.marketing.home.problem_2_desc}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center mb-6 text-2xl">🌐</div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">{t.marketing.home.problem_3_title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t.marketing.home.problem_3_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust and Workflow */}
      <section className="px-4 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 dark:text-white">{t.marketing.home.how_it_works_title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6">
             <div className="text-4xl font-black text-blue-100 dark:text-slate-800 mb-4">1</div>
             <h4 className="font-bold mb-2 dark:text-white">{t.marketing.home.step_1_title}</h4>
             <p className="text-sm text-gray-500 dark:text-gray-400">{t.marketing.home.step_1_desc}</p>
          </div>
          <div className="p-6">
             <div className="text-4xl font-black text-blue-200 dark:text-slate-700 mb-4">2</div>
             <h4 className="font-bold mb-2 dark:text-white">{t.marketing.home.step_2_title}</h4>
             <p className="text-sm text-gray-500 dark:text-gray-400">{t.marketing.home.step_2_desc}</p>
          </div>
          <div className="p-6">
             <div className="text-4xl font-black text-blue-300 dark:text-slate-600 mb-4">3</div>
             <h4 className="font-bold mb-2 dark:text-white">{t.marketing.home.step_3_title}</h4>
             <p className="text-sm text-gray-500 dark:text-gray-400">{t.marketing.home.step_3_desc}</p>
          </div>
          <div className="p-6">
             <div className="text-4xl font-black text-blue-600 dark:text-blue-500 mb-4">4</div>
             <h4 className="font-bold mb-2 dark:text-white">{t.marketing.home.step_4_title}</h4>
             <p className="text-sm text-gray-500 dark:text-gray-400">{t.marketing.home.step_4_desc}</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">{t.marketing.home.faq_title}</h2>
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h4 className="font-bold text-lg mb-2 dark:text-white">{t.marketing.home.faq_1_q}</h4>
            <p className="text-gray-600 dark:text-gray-400">{t.marketing.home.faq_1_a}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h4 className="font-bold text-lg mb-2 dark:text-white">{t.marketing.home.faq_2_q}</h4>
            <p className="text-gray-600 dark:text-gray-400">{t.marketing.home.faq_2_a}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h4 className="font-bold text-lg mb-2 dark:text-white">{t.marketing.home.faq_3_q}</h4>
            <p className="text-gray-600 dark:text-gray-400">{t.marketing.home.faq_3_a}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h4 className="font-bold text-lg mb-2 dark:text-white">{t.marketing.home.faq_4_q}</h4>
            <p className="text-gray-600 dark:text-gray-400">{t.marketing.home.faq_4_a}</p>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="bg-blue-600 py-20 px-4 text-center rounded-3xl mx-4 max-w-6xl md:mx-auto mb-12 shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t.marketing.home.cta_bottom_title}</h2>
        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">{t.marketing.home.cta_bottom_desc}</p>
        <Link to="/demo" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-gray-50 transition transform hover:-translate-y-1">
          {t.marketing.home.btn_preview}
        </Link>
      </section>
    </div>
  );
};

export default MarketingHomePage;
