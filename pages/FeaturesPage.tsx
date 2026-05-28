import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

const FeaturesPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="py-12 md:py-16">
      <div className="text-center mb-12 md:mb-20 max-w-3xl mx-auto px-4">
         <div className="inline-block bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold px-4 py-1.5 rounded-full text-xs md:text-sm mb-6 border border-blue-100 dark:border-slate-700">
           {language === 'tr' ? 'Keşfedin' : 'Discover'}
         </div>
         <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 dark:text-white tracking-tight">{t.marketing.features.page_title}</h1>
         <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">{t.marketing.features.page_subtitle}</p>
      </div>
      
      <div className="max-w-6xl mx-auto space-y-16 md:space-y-24 px-4">
        {/* Feature 1 */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
           <div className="w-full md:w-1/2 order-2 md:order-1">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white leading-tight">{t.marketing.features.feat1_title}</h3>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{t.marketing.features.feat1_desc}</p>
              <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                 <li className="flex items-start gap-3">
                    <span className="text-blue-500 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    </span> 
                    <span className="text-sm md:text-base leading-relaxed">{t.marketing.features.feat1_1}</span>
                 </li>
                 <li className="flex items-start gap-3">
                    <span className="text-blue-500 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    </span> 
                    <span className="text-sm md:text-base leading-relaxed">{t.marketing.features.feat1_2}</span>
                 </li>
                 <li className="flex items-start gap-3">
                    <span className="text-blue-500 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    </span> 
                    <span className="text-sm md:text-base leading-relaxed">{t.marketing.features.feat1_3}</span>
                 </li>
              </ul>
           </div>
           <div className="w-full md:w-1/2 order-1 md:order-2">
              <div className="bg-blue-50 dark:bg-slate-800 rounded-3xl p-6 aspect-[4/3] flex flex-col items-center justify-center border border-blue-100 dark:border-slate-700 relative overflow-hidden shadow-inner">
                 <div className="w-11/12 max-w-sm h-6 bg-white dark:bg-slate-700 rounded-t-lg shadow-sm border border-gray-100 dark:border-slate-600 flex items-center px-3 gap-2 translate-y-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div><div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                 </div>
                 <div className="w-11/12 max-w-sm flex-1 bg-white dark:bg-slate-700 rounded-b-lg shadow-md flex flex-col p-4 border border-t-0 border-gray-100 dark:border-slate-600 translate-y-2">
                     <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 mb-4 mx-auto shadow-sm"></div>
                     <div className="w-32 h-3 rounded bg-gray-200 dark:bg-slate-500 mb-2 mx-auto"></div>
                     <div className="w-24 h-2 rounded bg-gray-100 dark:bg-slate-600 mb-6 mx-auto"></div>
                     
                     <div className="grid grid-cols-2 gap-3">
                        <div className="h-16 bg-gray-50 dark:bg-slate-800 rounded-lg"></div>
                        <div className="h-16 bg-gray-50 dark:bg-slate-800 rounded-lg"></div>
                     </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
           <div className="w-full md:w-1/2 order-1">
              <div className="bg-indigo-50 dark:bg-slate-800 rounded-3xl p-6 aspect-[4/3] flex items-center justify-center border border-indigo-100 dark:border-slate-700 relative overflow-hidden shadow-inner">
                 <div className="w-full max-w-sm bg-white dark:bg-slate-700 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-600 p-5 transform -rotate-2 hover:rotate-0 transition duration-300">
                     <div className="flex justify-between items-center mb-6">
                        <div className="h-5 w-24 bg-indigo-100 dark:bg-slate-600 rounded"></div>
                        <div className="h-5 w-16 bg-gray-100 dark:bg-slate-600 rounded-full"></div>
                     </div>
                     <div className="space-y-3">
                        <div className="h-14 w-full bg-indigo-50 dark:bg-slate-800 rounded-xl flex items-center px-4 border border-indigo-100 dark:border-slate-600">
                           <div className="w-5 h-5 bg-indigo-200 dark:bg-indigo-500/50 rounded-full mr-3 shrink-0"></div>
                           <div className="flex-1"><div className="h-2 w-20 bg-indigo-200 dark:bg-indigo-400/50 rounded mb-1"></div><div className="h-2 w-12 bg-indigo-100 dark:bg-indigo-900/50 rounded"></div></div>
                        </div>
                        <div className="h-14 w-full bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center px-4">
                           <div className="w-5 h-5 bg-gray-200 dark:bg-slate-600 rounded-full mr-3 shrink-0"></div>
                           <div className="flex-1"><div className="h-2 w-24 bg-gray-200 dark:bg-slate-600 rounded mb-1"></div><div className="h-2 w-16 bg-gray-100 dark:bg-slate-700 rounded"></div></div>
                        </div>
                        <div className="h-14 w-full bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center px-4">
                           <div className="w-5 h-5 bg-gray-200 dark:bg-slate-600 rounded-full mr-3 shrink-0"></div>
                        </div>
                     </div>
                 </div>
              </div>
           </div>
           <div className="w-full md:w-1/2 order-2">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white leading-tight">{t.marketing.features.feat2_title}</h3>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{t.marketing.features.feat2_desc}</p>
              <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                 <li className="flex items-start gap-3">
                    <span className="text-indigo-500 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    </span> 
                    <span className="text-sm md:text-base leading-relaxed">{t.marketing.features.feat2_1}</span>
                 </li>
                 <li className="flex items-start gap-3">
                    <span className="text-indigo-500 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    </span> 
                    <span className="text-sm md:text-base leading-relaxed">{t.marketing.features.feat2_2}</span>
                 </li>
                 <li className="flex items-start gap-3">
                    <span className="text-indigo-500 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    </span> 
                    <span className="text-sm md:text-base leading-relaxed">{t.marketing.features.feat2_3}</span>
                 </li>
              </ul>
           </div>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
           <div className="w-full md:w-1/2 order-2 md:order-1">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white leading-tight">{t.marketing.features.feat3_title}</h3>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{t.marketing.features.feat3_desc}</p>
              <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                 <li className="flex items-start gap-3">
                    <span className="text-purple-500 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    </span> 
                    <span className="text-sm md:text-base leading-relaxed">{t.marketing.features.feat3_1}</span>
                 </li>
                 <li className="flex items-start gap-3">
                    <span className="text-purple-500 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    </span> 
                    <span className="text-sm md:text-base leading-relaxed">{t.marketing.features.feat3_2}</span>
                 </li>
                 <li className="flex items-start gap-3">
                    <span className="text-purple-500 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    </span> 
                    <span className="text-sm md:text-base leading-relaxed">{t.marketing.features.feat3_3}</span>
                 </li>
              </ul>
           </div>
           <div className="w-full md:w-1/2 order-1 md:order-2">
              <div className="bg-purple-50 dark:bg-slate-800 rounded-3xl p-6 aspect-[4/3] flex items-center justify-center border border-purple-100 dark:border-slate-700 relative overflow-hidden shadow-inner">
                 <div className="w-full max-w-sm bg-white dark:bg-slate-700 rounded-2xl shadow-xl border border-purple-100 dark:border-slate-600 p-5 flex gap-4">
                      <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/50 flex flex-shrink-0 items-center justify-center text-purple-500 font-bold text-xl shadow-inner">
                        AI
                      </div>
                      <div className="flex-1 space-y-3 pt-1">
                          <div className="h-3 w-24 bg-gray-200 dark:bg-slate-500 rounded"></div>
                          <div className="h-2.5 w-40 bg-purple-100 dark:bg-slate-600 rounded"></div>
                          <div className="bg-purple-50 dark:bg-slate-800 rounded-xl mt-3 border border-purple-100 dark:border-slate-600 p-3 shadow-sm">
                              <div className="h-2 w-16 bg-purple-200 dark:bg-purple-900/50 rounded mb-2"></div>
                              <div className="h-2 w-full bg-gray-200 dark:bg-slate-600 rounded mb-1.5"></div>
                              <div className="h-2 w-5/6 bg-gray-200 dark:bg-slate-600 rounded mb-1.5"></div>
                              <div className="h-2 w-3/4 bg-gray-200 dark:bg-slate-600 rounded"></div>
                          </div>
                      </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-20 md:mt-32 text-center px-4 max-w-3xl mx-auto">
         <h2 className="text-2xl md:text-4xl font-bold mb-8 dark:text-white leading-tight">{t.marketing.features.ready_title}</h2>
         <div className="flex flex-col sm:flex-row justify-center gap-4">
           <Link to="/demo" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition w-full sm:w-auto text-center">{t.marketing.home.btn_preview}</Link>
           <Link to="/pricing" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold shadow-sm border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition w-full sm:w-auto text-center">{t.marketing.home.btn_pricing}</Link>
         </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
