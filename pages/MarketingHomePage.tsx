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
      {/* 1. Hero Section */}
      <section className="text-center px-4 max-w-5xl mx-auto">
        <div className="inline-block bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 font-bold px-5 py-2 rounded-full text-xs md:text-sm mb-8 border border-violet-100 dark:border-violet-800">
          {language === 'tr' ? 'Randapp ile İşletmenizi Dijitalleştirin' : 'Digitize Your Business with Randapp'}
        </div>
        
        <div className="mb-4 min-h-[3.5rem] sm:min-h-[1.3em] relative inline-flex w-full justify-center align-bottom px-2 flex-col">
            <span key={currentPhrase} className="animate-slideUpFade text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 font-extrabold text-3xl sm:text-5xl md:text-[56px] leading-tight tracking-tight">
                {currentPhrase}
            </span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.15]">
          {language === 'tr' ? 'İşletmenize web sitesi, online randevu ve AI destekli müşteri deneyimi kazandırın.' : 'Give your business a website, online booking, and AI-powered customer experience.'}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300 mx-auto leading-relaxed max-w-3xl">
          {language === 'tr' ? 'Randapp; kuaförler, güzellik salonları, klinikler ve randevulu işletmeler için dijital vitrin, online randevu, müşteri hafızası, AI stil asistanı ve kampanya yönetimini tek panelde birleştirir.' : 'Randapp unifies your digital storefront, online booking, customer memory, AI style assistant, and campaign management in one dashboard.'}
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/demo" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition transform hover:-translate-y-1 block w-full sm:w-auto text-center md:min-w-[200px]">
            {language === 'tr' ? 'Demoyu Aç' : 'Open Demo'}
          </Link>
          <Link to="/demo" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-bold shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition block w-full sm:w-auto text-center md:min-w-[200px]">
             {language === 'tr' ? 'Kendi İşletmeni Önizle' : 'Preview Your Business'}
          </Link>
        </div>
        <div className="mt-4 text-center">
            <Link to="/pricing" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium text-sm transition-colors border-b border-transparent hover:border-slate-400">
               {language === 'tr' ? 'Paketleri Gör' : 'View Plans'}
            </Link>
        </div>

        {/* Trust Chips */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
           <div className="flex items-center gap-1.5"><span className="text-blue-500">✓</span> {language === 'tr' ? 'Mini web sitesi dahil' : 'Mini website included'}</div>
           <div className="flex items-center gap-1.5"><span className="text-violet-500">✓</span> {language === 'tr' ? 'AI Stil Asistanı' : 'AI Style Assistant'}</div>
           <div className="flex items-center gap-1.5"><span className="text-indigo-500">✓</span> {language === 'tr' ? 'Müşteri Hafızası' : 'Customer Memory'}</div>
           <div className="flex items-center gap-1.5"><span className="text-green-500">✓</span> {language === 'tr' ? '7 gün ücretsiz deneme' : '7 day free trial'}</div>
           <div className="flex items-center gap-1.5 hidden sm:flex"><span className="text-slate-500">✓</span> {language === 'tr' ? 'KVKK odaklı yapı' : 'Privacy focused'}</div>
        </div>
      </section>

      {/* 2. Problem Section */}
      <section className="bg-slate-50 dark:bg-slate-800/20 py-20 px-4 mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{language === 'tr' ? 'Randevular neden kaçıyor?' : 'Why are bookings lost?'}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{language === 'tr' ? 'Geleneksel iletişim yöntemleri ve dağınık sistemler müşterilerinizi kaybetmenize neden olur.' : 'Traditional communication and scattered systems cause you to lose customers.'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="text-2xl mb-4">💬</div>
              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{language === 'tr' ? 'Mesajlar dağınık kalıyor' : 'Scattered messages'}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{language === 'tr' ? 'Instagram, WhatsApp ve telefon trafiği içinde müşterilerin soruları ve randevu talepleri gözden kaçabiliyor.' : 'Questions and booking requests get lost in social media and phone traffic.'}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="text-2xl mb-4">🤷</div>
              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{language === 'tr' ? 'Müşteri karar veremiyor' : 'Indecisive customers'}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{language === 'tr' ? 'Hangi hizmeti seçeceğini bilmeyen müşteri, randevuyu tamamlamadan iletişimden çıkabiliyor.' : 'Customers who do not know what they want often drop off before completing the booking.'}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="text-2xl mb-4">🕒</div>
              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{language === 'tr' ? 'Boş saatler dolmuyor' : 'Empty slots'}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{language === 'tr' ? 'Müsait saatler müşteri tarafından görünür olmadığında en uygun zamanı kendileri seçemiyor.' : 'When available hours are not visible, customers cannot self-serve the best time.'}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="text-2xl mb-4">🧠</div>
              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{language === 'tr' ? 'Müşteri hafızası kayboluyor' : 'Customer memory is lost'}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{language === 'tr' ? 'Tercihler, notlar ve önceki ziyaretler tutulmadığında, kişiselleştirilmiş hizmet vermek zorlaşıyor.' : 'Without tracking preferences and past visits, it becomes hard to provide personalized service.'}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="text-2xl mb-4">🌐</div>
              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{language === 'tr' ? 'Profesyonel web sitesi eksik' : 'Lack of professional website'}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{language === 'tr' ? 'Sadece sosyal medyaya bağlı kalındığında hizmetler, fiyatlar, uzmanlar ve randevu akışı profesyonel görünmüyor.' : 'Relying solely on social media makes it hard to present a professional front with clear services, pricing, and staff.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Solution Section */}
      <section className="px-4 py-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{language === 'tr' ? 'Randapp bu akışı tek platformda toplar' : 'Randapp unifies this flow'}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
             <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl font-black text-slate-400 mb-6">1</div>
             <h4 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">{language === 'tr' ? 'Dijital vitrininizi oluşturun' : 'Create your storefront'}</h4>
             <p className="text-sm text-slate-600 dark:text-slate-400">{language === 'tr' ? 'İşletme bilgileriniz, cover görseliniz, hizmetleriniz, uzmanlarınız, konumunuz ve Instagram vitrininizle kendi mağazanızı yaratın.' : 'Publish your own website with business info, services, staff, location, and Instagram showcase.'}</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
             <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-2xl font-black text-blue-400 mb-6">2</div>
             <h4 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">{language === 'tr' ? 'Müşteri hizmeti ve uzmanı seçsin' : 'Customers choose service & staff'}</h4>
             <p className="text-sm text-slate-600 dark:text-slate-400">{language === 'tr' ? 'Şeffaf fiyatlar, süreler ve uzman müsaitliği ile müşterilerin kendilerine en uygun saati ve uzmanı şeffafça seçmesini sağlayın.' : 'Enable customers to book the best time and staff with transparent pricing and durations.'}</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
             <div className="w-16 h-16 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center text-2xl font-black text-violet-400 mb-6">3</div>
             <h4 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">{language === 'tr' ? 'AI Stil Asistanı karar vermeyi kolaylaştırsın' : 'AI Style Assistant simplifies decisions'}</h4>
             <p className="text-sm text-slate-600 dark:text-slate-400">{language === 'tr' ? 'Müşterileriniz stil hedefi için bir fotoğraf yükleyip asistan üzerinden karar sürecini hızlandırarak hemen randevuya geçsin.' : 'Customers upload photos to the AI Style Assistant to speed up decision-making and jump straight to booking.'}</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
             <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-2xl font-black text-green-500 mb-6">4</div>
             <h4 className="font-bold text-lg mb-3 text-slate-900 dark:text-white">{language === 'tr' ? 'Müşteri hafızasıyla tekrar satış yaratın' : 'Create repeat sales with memory'}</h4>
             <p className="text-sm text-slate-600 dark:text-slate-400">{language === 'tr' ? 'Müşteri tercihleri, ziyaret geçmişi, notlar, tavsiye ve kampanyalar ile onları işletmenize daha sık bağlayın.' : 'Build loyalty by offering personalized service based on preferences, history, and tailored campaigns.'}</p>
          </div>
        </div>
      </section>

      {/* 4. Comparison Section */}
      <section className="px-4 py-16 max-w-5xl mx-auto">
         <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">{language === 'tr' ? 'Sadece randevu linki değil, işletme web sitesi + yönetim paneli' : 'Not just a booking link: A full website + admin panel'}</h2>
         </div>
         <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 hide-scrollbar">
            <table className="w-full text-left min-w-[600px]">
               <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                     <th className="p-4 md:p-6 font-bold text-slate-900 dark:text-white"></th>
                     <th className="p-4 md:p-6 font-bold text-slate-500 dark:text-slate-400 text-center w-1/4">{language === 'tr' ? 'Sadece Sosyal Medya' : 'Social Media Only'}</th>
                     <th className="p-4 md:p-6 font-bold text-slate-500 dark:text-slate-400 text-center w-1/4">{language === 'tr' ? 'Basit Randevu Linki' : 'Basic Booking Link'}</th>
                     <th className="p-4 md:p-6 font-bold text-blue-600 dark:text-blue-400 text-center w-1/4 bg-blue-50/50 dark:bg-blue-900/10 rounded-t-xl">Randapp</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  <tr>
                     <td className="p-4 md:p-6 font-medium text-slate-900 dark:text-white">{language === 'tr' ? 'Mini Web Sitesi' : 'Mini Website'}</td>
                     <td className="p-4 md:p-6 text-center text-slate-300 dark:text-slate-600">-</td>
                     <td className="p-4 md:p-6 text-center text-slate-300 dark:text-slate-600">-</td>
                     <td className="p-4 md:p-6 text-center text-green-500 bg-blue-50/50 dark:bg-blue-900/10 font-bold">✓</td>
                  </tr>
                  <tr>
                     <td className="p-4 md:p-6 font-medium text-slate-900 dark:text-white">{language === 'tr' ? 'Online Randevu' : 'Online Booking'}</td>
                     <td className="p-4 md:p-6 text-center text-slate-300 dark:text-slate-600">-</td>
                     <td className="p-4 md:p-6 text-center text-green-500">✓</td>
                     <td className="p-4 md:p-6 text-center text-green-500 bg-blue-50/50 dark:bg-blue-900/10 font-bold">✓</td>
                  </tr>
                  <tr>
                     <td className="p-4 md:p-6 font-medium text-slate-900 dark:text-white">{language === 'tr' ? 'Uzman / Fark Etmez Seçimi' : 'Staff/No-Preference Selection'}</td>
                     <td className="p-4 md:p-6 text-center text-slate-300 dark:text-slate-600">-</td>
                     <td className="p-4 md:p-6 text-center text-green-500">✓</td>
                     <td className="p-4 md:p-6 text-center text-green-500 bg-blue-50/50 dark:bg-blue-900/10 font-bold">✓</td>
                  </tr>
                  <tr>
                     <td className="p-4 md:p-6 font-medium text-slate-900 dark:text-white">{language === 'tr' ? 'AI Stil Asistanı' : 'AI Style Assistant'}</td>
                     <td className="p-4 md:p-6 text-center text-slate-300 dark:text-slate-600">-</td>
                     <td className="p-4 md:p-6 text-center text-slate-300 dark:text-slate-600">-</td>
                     <td className="p-4 md:p-6 text-center text-green-500 bg-blue-50/50 dark:bg-blue-900/10 font-bold">✓</td>
                  </tr>
                  <tr>
                     <td className="p-4 md:p-6 font-medium text-slate-900 dark:text-white">{language === 'tr' ? 'Müşteri Hafızası (CRM Lite)' : 'Customer Memory (CRM Lite)'}</td>
                     <td className="p-4 md:p-6 text-center text-slate-300 dark:text-slate-600">-</td>
                     <td className="p-4 md:p-6 text-center text-amber-500">{language === 'tr' ? 'Kısmi' : 'Partial'}</td>
                     <td className="p-4 md:p-6 text-center text-green-500 bg-blue-50/50 dark:bg-blue-900/10 font-bold">✓</td>
                  </tr>
                  <tr>
                     <td className="p-4 md:p-6 font-medium text-slate-900 dark:text-white">{language === 'tr' ? 'Kampanya ve Yönlendirme' : 'Campaign/Referral'}</td>
                     <td className="p-4 md:p-6 text-center text-slate-300 dark:text-slate-600">-</td>
                     <td className="p-4 md:p-6 text-center text-slate-300 dark:text-slate-600">-</td>
                     <td className="p-4 md:p-6 text-center text-green-500 bg-blue-50/50 dark:bg-blue-900/10 font-bold">✓</td>
                  </tr>
                  <tr>
                     <td className="p-4 md:p-6 font-medium text-slate-900 dark:text-white">{language === 'tr' ? 'Yönetici Paneli' : 'Admin Dashboard'}</td>
                     <td className="p-4 md:p-6 text-center text-slate-300 dark:text-slate-600">-</td>
                     <td className="p-4 md:p-6 text-center text-green-500">✓</td>
                     <td className="p-4 md:p-6 text-center text-green-500 bg-blue-50/50 dark:bg-blue-900/10 font-bold">✓</td>
                  </tr>
                  <tr>
                     <td className="p-4 md:p-6 font-medium text-slate-900 dark:text-white border-b-0">{language === 'tr' ? 'Gelecekte Mobil Keşif Kanalı' : 'Future Mobile Discovery Channel'}</td>
                     <td className="p-4 md:p-6 text-center text-slate-300 dark:text-slate-600 border-b-0">-</td>
                     <td className="p-4 md:p-6 text-center text-slate-300 dark:text-slate-600 border-b-0">-</td>
                     <td className="p-4 md:p-6 text-center text-green-500 bg-blue-50/50 dark:bg-blue-900/10 font-bold border-b-0 rounded-b-xl">✓</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </section>

      {/* 5. Product Surface Previews/Proof */}
      <section className="bg-slate-50 dark:bg-slate-800/30 border-y border-slate-200 dark:border-slate-800 py-16 px-4">
         <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 dark:text-white">{language === 'tr' ? 'Sistemi Keşfedin (Örnek Görünümler)' : 'Explore the System (Sample Views)'}</h2>
            <div className="grid md:grid-cols-2 gap-8">
               <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4">
                  <div className="h-48 bg-slate-100 dark:bg-slate-900 rounded-xl w-full border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden relative">
                     <div className="absolute inset-x-4 top-4 h-8 bg-white dark:bg-slate-800 rounded shadow-sm flex items-center px-4 z-20">
                        <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 mr-2"></div>
                        <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="ml-auto w-12 h-4 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
                     </div>
                     <div className="w-full flex-1 mt-14 grid grid-cols-2 gap-3 px-4 pb-4">
                        <div className="bg-white dark:bg-slate-800 rounded shadow-sm h-full flex flex-col p-3">
                           <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/20 rounded mb-2"></div>
                           <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded mb-1.5"></div>
                           <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded shadow-sm h-full flex flex-col p-3 border-l-2 border-violet-500">
                           <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-[10px]">AI</div>
                              <div className="h-2 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                           </div>
                           <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded mb-1"></div>
                           <div className="h-1.5 w-3/4 bg-slate-100 dark:bg-slate-700 rounded"></div>
                        </div>
                     </div>
                  </div>
                  <div>
                     <h4 className="font-bold text-lg dark:text-white">{language === 'tr' ? 'Halka Açık Web Sitesi' : 'Public Business Website'}</h4>
                     <p className="text-sm text-slate-500">{language === 'tr' ? 'Tamamen size ait bir subdomain altında, profesyonel web siteniz hazır.' : 'Your professional website is ready under your own custom subdomain.'}</p>
                  </div>
               </div>
               
               <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4">
                  <div className="h-48 bg-slate-100 dark:bg-slate-900 flex justify-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden relative">
                     <div className="w-[140px] bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-xl border-4 border-slate-800 dark:border-slate-950 p-3 flex flex-col h-full shrink-0 relative z-10 translate-y-2">
                        <div className="h-2 w-12 bg-slate-200 dark:bg-slate-600 rounded mx-auto mb-4"></div>
                        <div className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-700 p-2 border border-slate-100 dark:border-slate-600 mb-2">
                           <div className="h-2 w-full bg-slate-200 dark:bg-slate-600 rounded mb-1.5"></div>
                           <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-600 rounded"></div>
                        </div>
                        <div className="h-7 w-full bg-blue-600 rounded-lg shrink-0"></div>
                     </div>
                     <div className="absolute right-8 top-12 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full blur-2xl"></div>
                  </div>
                  <div>
                     <h4 className="font-bold text-lg dark:text-white">{language === 'tr' ? 'Gömülü Randevu Akışı' : 'Embedded Booking Flow'}</h4>
                     <p className="text-sm text-slate-500">{language === 'tr' ? 'Web sitenizden hiç ayrılmadan akıcı bir şekilde randevu oluşturma deneyimi.' : 'A fluid booking experience directly embedded without leaving your site.'}</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 6. AI Positioning Section */}
      <section className="bg-gradient-to-br from-violet-900 to-indigo-900 py-16 md:py-24 px-4 text-white my-8 mx-0 md:mx-4 md:rounded-3xl shadow-xl">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
               <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.15]">{language === 'tr' ? 'AI sadece cevap vermez, randevuya yönlendirir.' : 'AI does not just answer, it drives bookings.'}</h2>
               <div className="bg-white/10 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                  <h3 className="font-bold text-lg md:text-xl mb-2 text-violet-200 flex items-center gap-2">
                     <span>📸</span> {language === 'tr' ? 'Müşteri İçin: Yaratıcı AI Asistan' : 'For Customers: Creative AI Assistant'}
                  </h3>
                  <p className="text-sm md:text-base text-indigo-100/90 leading-relaxed">{language === 'tr' ? 'Müşteri saç, sakal veya tırnak fikri için bir fotoğraf yükler. AI stil önerisinde bulunur ve ardından doğru hizmete eşleştirerek randevu formunu açar.' : 'Customers upload an image for hair, beard, or nail ideas. AI offers style suggestions and matches them with the right service to open the booking step.'}</p>
               </div>
               <div className="bg-white/5 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
                  <h3 className="font-bold text-lg md:text-xl mb-2 text-indigo-300 flex items-center gap-2">
                     <span>📊</span> {language === 'tr' ? 'İşletme İçin: AI İçgörüleri (Planlanan)' : 'For Businesses: AI Insights (Planned)'}
                  </h3>
                  <p className="text-sm md:text-base text-indigo-100/70 leading-relaxed">{language === 'tr' ? 'Sistemin kullanımı arttıkça, yoğun saatlerinizi, geri dönüş fırsatlarınızı ve hizmet performansınızı daha analitik bir şekilde değerlendirirsiniz.' : 'As system usage grows, evaluate peak hours, return opportunities, and service performance analytically.'}</p>
               </div>
            </div>
            <div className="flex-1 w-full max-w-sm relative hidden sm:block">
               <div className="absolute inset-0 bg-violet-500/30 blur-[60px] rounded-full"></div>
               <div className="bg-slate-900 border border-slate-700 shadow-2xl rounded-[3rem] p-5 relative z-10 mx-auto w-[280px] sm:w-[320px]">
                  <div className="w-full h-12 flex justify-center items-center mb-4 border-b border-slate-800 pb-2">
                     <div className="w-1/3 h-2 bg-slate-800 rounded-full"></div>
                  </div>
                  <div className="bg-slate-800 rounded-2xl p-4 mb-4">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xl shadow-lg shadow-violet-500/20">🪄</div>
                        <div className="h-4 w-24 bg-slate-700 rounded"></div>
                     </div>
                     <div className="h-2 w-full bg-slate-700 rounded mb-2"></div>
                     <div className="h-2 w-5/6 bg-slate-700 rounded mb-2"></div>
                     <div className="h-2 w-4/6 bg-slate-700 rounded"></div>
                  </div>
                  <div className="bg-violet-900/40 border border-violet-500/30 rounded-2xl p-4 flex items-center justify-between">
                     <div>
                        <div className="h-3 w-20 bg-violet-300/50 rounded mb-2"></div>
                        <div className="h-2 w-16 bg-violet-400/30 rounded"></div>
                     </div>
                     <div className="h-9 w-24 bg-violet-600 rounded-xl"></div>
                  </div>
               </div>
            </div>
        </div>
      </section>

      {/* 7. Sector Coverage */}
      <section className="px-4 py-16 max-w-6xl mx-auto text-center">
         <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{language === 'tr' ? 'Randevulu işletmeler için tasarlandı' : 'Designed for appointment businesses'}</h2>
         <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">{language === 'tr' ? 'Zamana dayalı hizmet veren her sektör için profesyonelce çalışan modüller.' : 'Professional modules for every industry providing time-based services.'}</p>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition">
               <span className="text-4xl mb-2">✂️</span>
               <span className="font-bold text-slate-900 dark:text-white">{language === 'tr' ? 'Kuaför & Berber' : 'Hair & Barber'}</span>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition">
               <span className="text-4xl mb-2">✨</span>
               <span className="font-bold text-slate-900 dark:text-white">{language === 'tr' ? 'Güzellik Merkezi' : 'Beauty Center'}</span>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition">
               <span className="text-4xl mb-2">💅</span>
               <span className="font-bold text-slate-900 dark:text-white">Nail Studio</span>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition">
               <span className="text-4xl mb-2">💆‍♀️</span>
               <span className="font-bold text-slate-900 dark:text-white">Spa & Wellness</span>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition">
               <span className="text-4xl mb-2">🦷</span>
               <span className="font-bold text-slate-900 dark:text-white">{language === 'tr' ? 'Diş Kliniği' : 'Dental Clinic'}</span>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition">
               <span className="text-4xl mb-2">🩺</span>
               <span className="font-bold text-slate-900 dark:text-white">{language === 'tr' ? 'Özel Klinik' : 'Private Clinic'}</span>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition">
               <span className="text-4xl mb-2">🏋️</span>
               <span className="font-bold text-slate-900 dark:text-white">{language === 'tr' ? 'PT / Spor Stüdyosu' : 'PT / Gym Studio'}</span>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition">
               <span className="text-4xl mb-2">💼</span>
               <span className="font-bold text-slate-900 dark:text-white">{language === 'tr' ? 'Danışmanlık Ofisi' : 'Consulting Office'}</span>
            </div>
         </div>
      </section>

      {/* 8. Integrations Roadmap */}
      <section className="px-4 py-8 md:py-12 max-w-4xl mx-auto text-center border-t border-slate-200 dark:border-slate-800">
         <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-8">{language === 'tr' ? 'Öne Çıkan Entegrasyonlar' : 'Featured Integrations'}</h2>
         <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <span className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm flex items-center gap-2">
               <span className="text-green-500">✅</span> WhatsApp İletişim
            </span>
            <span className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm flex items-center gap-2">
               <span className="text-pink-500">✅</span> Instagram Gösterimi
            </span>
            <span className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-full text-sm font-medium text-slate-500 flex items-center gap-2">
               <span>⏳</span> Google Takvim (Planlanan)
            </span>
            <span className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-full text-sm font-medium text-slate-500 flex items-center gap-2">
               <span>⏳</span> Ödeme / Checkout (Planlanan)
            </span>
            <span className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-full text-sm font-medium text-slate-500 flex items-center gap-2">
               <span>🚀</span> Mobil Uygulama (Yol Haritası)
            </span>
         </div>
      </section>

      {/* 9. Pricing Bridge */}
      <section className="px-4 pt-16 pb-8 text-center max-w-4xl mx-auto">
         <div className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold px-4 py-2 rounded-full text-xs md:text-sm mb-6 border border-blue-100 dark:border-blue-800">
            {language === 'tr' ? '7 Gün Ücretsiz Pilot' : '7 Day Free Pilot'}
         </div>
         <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">{language === 'tr' ? 'İşletmenizin büyüklüğüne göre paket seçin' : 'Choose a plan based on your business size'}</h2>
         <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">{language === 'tr' ? 'Sınırsız randevu kapasitesi Standart pakette dahil. Ekibiniz büyüdükçe gelişmiş yapay zeka asistanı ve müşteri hafızası özellikleri için Premium plana geçebilirsiniz.' : 'Unlimited booking capacity included in Standard. Upgrade to Premium for advanced AI assistant and customer memory tools.'}</p>
      </section>

      {/* CTA Bottom */}
      <section className="bg-blue-600 py-16 md:py-24 px-6 text-center rounded-[2.5rem] mx-4 md:max-w-6xl md:mx-auto mb-16 shadow-[0_20px_50px_-12px_rgba(37,99,235,0.4)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10">
           <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">{language === 'tr' ? 'Randapp ile İşletmenizi Büyütün' : 'Grow your business with Randapp'}</h2>
           <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">{language === 'tr' ? 'Teknik bilgi veya kurulum deneyimi gerekmez. 7 gün ücretsiz deneyin ve kendi işletme vitrininizi hemen oluşturun.' : 'No technical skills required. Try free for 7 days, start taking bookings immediately.'}</p>
           <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
              <Link to="/demo" className="inline-block w-full sm:w-1/2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-gray-50 transition transform hover:-translate-y-1 text-center text-lg">
                {language === 'tr' ? 'Demoyu Aç' : 'Open Demo'}
              </Link>
              <Link to="/pricing" className="inline-block w-full sm:w-1/2 bg-blue-700/80 backdrop-blur-sm border border-blue-400/50 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-800 transition transform hover:-translate-y-1 text-center text-lg">
                {language === 'tr' ? 'Paketleri Gör' : 'View Plans'}
              </Link>
           </div>
           <p className="mt-8 text-blue-200 text-sm opacity-80">{language === 'tr' ? 'Kredi kartı bilgileri istenmeden denemeye başlayabilirsiniz.' : 'Start trying right away, no credit card required upfront.'}</p>
        </div>
      </section>
    </div>
  );
};

export default MarketingHomePage;
