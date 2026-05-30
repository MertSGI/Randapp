import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

const FeaturesPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="py-12 md:py-16">
      <div className="text-center mb-12 md:mb-20 max-w-4xl mx-auto px-4">
         <div className="inline-block bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-400 font-bold px-5 py-2 rounded-full text-sm mb-6 border border-violet-100 dark:border-slate-700">
           {language === 'tr' ? 'Neden Randapp?' : 'Why Randapp?'}
         </div>
         <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 dark:text-white tracking-tight leading-[1.15]">
           {language === 'tr' ? 'Karmaşık mesajlar yerine düzenli bir panel' : 'From messy messages to organized panel'}
         </h1>
         <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
           {language === 'tr' 
            ? 'Randapp sıradan bir takvim ajandası değildir. Müşterilerinizin markanızı algılayışını profesyonelleştiren ve sizi gereksiz mesaj trafiğinden kurtaran bir platformdur.' 
            : 'Randapp is not just a calendar. It elevates how clients perceive your brand and frees you from endless message traffic.'}
         </p>
      </div>
      
      <div className="max-w-6xl mx-auto space-y-20 md:space-y-32 px-4">
        {/* Feature 1 */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
           <div className="w-full md:w-1/2 order-2 md:order-1">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Problem 1</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white leading-tight">
                 {language === 'tr' ? 'Müşteriler WhatsApp\'tan sürekli aynı soruları soruyor.' : 'Customers ask the same questions on WhatsApp.'}
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                 {language === 'tr' ? 'Çözüm: Hizmetlerinizi, fiyatlarınızı, işlem sürelerini ve seçilebilir personellerinizi web sitenizde 7/24 gösterin.' : 'Solution: Show your services, prices, duration, and staff 24/7 on your website.'}
              </p>
              <div className="bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 p-4 rounded-xl text-slate-900 dark:text-white font-medium">
                 <span className="text-blue-600 dark:text-blue-400 font-bold">Sonuç: </span> 
                 {language === 'tr' ? 'Fiyat listesi göndermek veya "Müsait saat var mı?" sorularına cevap vermek için zaman kaybetmezsiniz.' : 'Stop wasting time answering availability or pricing queries.'}
              </div>
           </div>
           <div className="w-full md:w-1/2 order-1 md:order-2">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-6 aspect-[4/3] flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 relative overflow-hidden shadow-inner">
                 <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-0 transform translate-x-4 lg:translate-x-8 translate-y-4 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-violet-600 h-24 p-5 flex flex-col justify-end">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold -mb-10 shadow border border-slate-100">ST</div>
                      </div>
                      <div className="pt-12 px-5 pb-5">
                          <div className="h-4 w-32 bg-slate-800 dark:bg-slate-200 rounded mb-2"></div>
                          <div className="h-2 w-48 bg-slate-400 rounded mb-6"></div>
                          <div className="space-y-3">
                              <div className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-lg flex justify-between items-center px-4 border border-slate-100 dark:border-slate-700"><div className="w-24 h-2.5 bg-slate-400 dark:bg-slate-500 rounded"></div><div className="w-16 h-8 bg-blue-600 rounded text-center leading-8 text-[10px] text-white font-bold tracking-wider">AL</div></div>
                              <div className="w-full h-12 bg-slate-50 dark:bg-slate-800 rounded-lg flex justify-between items-center px-4 border border-slate-100 dark:border-slate-700"><div className="w-32 h-2.5 bg-slate-400 dark:bg-slate-500 rounded"></div><div className="w-16 h-8 bg-blue-600 rounded text-center leading-8 text-[10px] text-white font-bold tracking-wider">AL</div></div>
                          </div>
                      </div>
                  </div>
              </div>
           </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
           <div className="w-full md:w-1/2 order-1">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-6 aspect-[4/3] flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 relative overflow-hidden shadow-inner">
                 <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-5 transform -translate-x-4 lg:-translate-x-8 -translate-y-4">
                      <div className="flex gap-2 mb-6">
                           <div className="px-3 py-1 bg-violet-100 text-violet-700 font-bold text-[10px] rounded uppercase">Bugün</div>
                           <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px] rounded uppercase">Yarın</div>
                      </div>
                      <div className="w-full bg-violet-50 text-violet-900 dark:bg-slate-800/80 dark:text-violet-100 rounded-lg border-l-4 border-violet-500 p-3 mb-3">
                           <div className="flex justify-between items-center mb-1">
                               <div className="font-bold text-sm">Ayşe Yılmaz</div>
                               <div className="text-xs opacity-70">10:00 - 11:30</div>
                           </div>
                           <div className="text-xs opacity-80">Saç Kesimi & Boya</div>
                      </div>
                      <div className="w-full bg-blue-50 text-blue-900 dark:bg-slate-800/80 dark:text-blue-100 rounded-lg border-l-4 border-blue-500 p-3 mb-3">
                           <div className="flex justify-between items-center mb-1">
                               <div className="font-bold text-sm">Ece K.</div>
                               <div className="text-xs opacity-70">13:00 - 14:00</div>
                           </div>
                           <div className="text-xs opacity-80">Manikür</div>
                      </div>
                  </div>
              </div>
           </div>
           <div className="w-full md:w-1/2 order-2">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Problem 2</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white leading-tight">
                 {language === 'tr' ? 'Randevular karışıyor, çakışıyor veya müşteriler iptal etmeyi unutuyor.' : 'Appointments are scattered, conflicting, or clients forget to cancel.'}
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                 {language === 'tr' ? 'Çözüm: Randevuları, uzman seçimlerini ve personel takvimlerini tek merkezde toplayın. Müşteriler kendi portallarından iptal edebilsin.' : 'Solution: Centralize bookings, staff calendars, and let clients self-serve cancellations.'}
              </p>
              <div className="bg-violet-50 dark:bg-slate-800 border border-violet-100 dark:border-slate-700 p-4 rounded-xl text-slate-900 dark:text-white font-medium">
                 <span className="text-violet-600 dark:text-violet-400 font-bold">Sonuç: </span> 
                 {language === 'tr' ? 'Sıfır çakışma, minimum No-Show oranı. Yönetici panelinden gününüzü net görürsünüz.' : 'Zero conflicts, minimized no-shows, and a clear dashboard for your day.'}
              </div>
           </div>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
           <div className="w-full md:w-1/2 order-2 md:order-1">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Problem 3</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white leading-tight">
                 {language === 'tr' ? 'Eski müşterilerin ne zaman geldiğini ve ne yaptırdığını unutuyorsunuz.' : 'You forget customer preferences and past visits.'}
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                 {language === 'tr' ? 'Çözüm: Müşterilere ait gizli notları, renk formüllerini, referans fotoğraflarını ve eski randevu geçmişlerini Müşteri Hafızasına güvenle kaydedin.' : 'Solution: Keep customer notes, visit history, color formulas, and reference photos privately in Customer Memory.'}
              </p>
              <div className="bg-amber-50 dark:bg-slate-800 border border-amber-100 dark:border-slate-700 p-4 rounded-xl text-slate-900 dark:text-white font-medium">
                 <span className="text-amber-600 dark:text-amber-500 font-bold">Sonuç: </span> 
                 {language === 'tr' ? 'Her müşteri bir sonraki gelişinde kendini özel hisseder. Premium hizmet deneyimi.' : 'Every repeat visit feels personal. Premium service experience powered by CRM data.'}
              </div>
           </div>
           <div className="w-full md:w-1/2 order-1 md:order-2">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-6 aspect-[4/3] flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 relative overflow-hidden shadow-inner">
                 <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-5 transform translate-x-4 lg:translate-x-8 translate-y-4">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Merve Y.</div>
                              <div className="text-xs text-slate-500">Kayıt: 2024 • 12 Ziyaret</div>
                          </div>
                      </div>
                      <div className="space-y-4">
                          <div className="w-full bg-amber-50 dark:bg-slate-800/50 rounded-lg border border-amber-200 dark:border-slate-700 p-3">
                              <div className="flex items-center gap-2 mb-2">
                                  <span className="text-[10px] text-amber-700 font-bold uppercase rounded bg-amber-200 px-1.5 py-0.5">Gizli Not</span>
                              </div>
                              <div className="text-[11px] text-slate-700 dark:text-slate-300">Saç derisi hassas. Boya işleminde 20 volume oksidan kullanılmalı.</div>
                          </div>
                          <div>
                              <div className="text-xs font-bold text-slate-500 mb-2">Geçmiş İşlemler</div>
                              <div className="flex gap-2">
                                 <div className="flex-1 h-16 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                                 <div className="flex-1 h-16 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-24 md:mt-32 text-center px-4 max-w-3xl mx-auto">
         <h2 className="text-3xl md:text-5xl font-bold mb-8 dark:text-white leading-tight">
            {language === 'tr' ? 'İşletmenizi bir üst seviyeye taşıyın.' : 'Elevate your business to the next level.'}
         </h2>
         <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
           <Link to="/demo" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition w-full sm:w-auto text-center">
             {language === 'tr' ? 'Demoyu Aç' : 'View Demo'}
           </Link>
           <Link to="/pricing" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-bold shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition w-full sm:w-auto text-center">
             {language === 'tr' ? 'Paketleri Gör' : 'See Pricing'}
           </Link>
         </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
