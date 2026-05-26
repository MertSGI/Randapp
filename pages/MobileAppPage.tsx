import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { Link } from 'react-router-dom';
import { Smartphone, MapPin, Star, CalendarHeart, Gift } from 'lucide-react';

const MobileAppPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  // We hardcode translations here since this is a new bespoke marketing page
  const content = {
    badge: language === 'tr' ? 'Mobil Uygulama (Gelecek Yol Haritası)' : 'Mobile App (Future Roadmap)',
    title: language === 'tr' ? 'Randapp Mobil Uygulaması ile Keşfedilin' : 'Get Discovered with the Randapp Mobile App',
    subtitle: language === 'tr' 
      ? 'Randapp sadece salonunuz için bir altyapı değildir. Müşterileriniz gelecekte Randapp Mobil uygulamasını indirerek doğrudan yeni randevular alabilecek ve işletmenizi haritada keşfedebilecek.' 
      : 'Randapp isn\'t just infrastructure for your salon. In the future, your customers will download the Randapp Mobile app to book appointments directly and discover your business on the map.',
    notice: language === 'tr'
      ? 'Önemli Bilgi: Mobil uygulama, gelecekte müşteri keşfi ve randevu takibi için planlanan ek bir kanaldır. Henüz canlı değildir.'
      : 'Important: The mobile app is planned as a future customer discovery and appointment companion. It is not live yet.',
    features: [
      {
        icon: <MapPin className="w-6 h-6 text-accent" />,
        title: language === 'tr' ? 'Lokasyon Bazlı Keşif' : 'Location-Based Discovery',
        desc: language === 'tr' ? 'Müşteriler, çevrelerindeki en iyi salonları, klinikleri ve stüdyoları haritada görebilir.' : 'Customers can see the best salons, clinics, and studios around them on the map.'
      },
      {
        icon: <CalendarHeart className="w-6 h-6 text-accent" />,
        title: language === 'tr' ? 'Randevu Cüzdanı' : 'Appointment Wallet',
        desc: language === 'tr' ? 'Kullanıcılar tek uygulamadan tüm eski ve yeni randevularını yönetebilir, iptal edebilir veya yeniden alabilir.' : 'Users can manage, cancel, or rebook all past and upcoming appointments from a single app.'
      },
      {
        icon: <Star className="w-6 h-6 text-accent" />,
        title: language === 'tr' ? 'Gerçek Puanlamalar' : 'Verified Ratings',
        desc: language === 'tr' ? 'Hizmet alan müşteriler işletmenize puan vererek güvenilirliğinizi ve görünürlüğünüzü artırır.' : 'Verified customers can rate your business, increasing your trust and visibility.'
      },
      {
        icon: <Gift className="w-6 h-6 text-accent" />,
        title: language === 'tr' ? 'Kampanya ve Referans' : 'Campaigns & Referrals',
        desc: language === 'tr' ? 'Kullanıcılar arkadaşlarını davet edebilir veya sadece mobil uygulamaya özel fırsatlardan yararlanabilir.' : 'Users can invite friends or benefit from mobile-app-only deals.'
      }
    ],
    cta: language === 'tr' ? 'Randapp platformuna bugün katılın ve yerinizi ayırtın.' : 'Join the Randapp platform today and reserve your spot.',
    btn: language === 'tr' ? 'Demo Alın' : 'Get a Demo'
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-[calc(100vh-64px)] pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="flex justify-center mb-6">
               <span className="inline-flex items-center gap-2 bg-blue-50 dark:bg-slate-700/50 text-accent font-semibold px-4 py-2 rounded-full text-sm">
                 <Smartphone className="w-5 h-5" />
                 {content.badge}
               </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 max-w-4xl mx-auto">
              {content.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {content.subtitle}
            </p>

            <div className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400 p-4 rounded-lg max-w-2xl mx-auto text-sm">
               {content.notice}
            </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {content.features.map((feat, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 flex gap-6 hover:shadow-md transition">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
                         {feat.icon}
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feat.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                              {feat.desc}
                          </p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
      
      {/* CTA Box */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
         <div className="bg-gradient-to-r from-blue-600 to-accent rounded-3xl p-10 text-center shadow-lg">
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                 {content.cta}
             </h2>
             <Link to="/demo" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
                 {content.btn}
             </Link>
         </div>
      </div>
    </div>
  );
};

export default MobileAppPage;
