import React from 'react';
import { Link } from 'react-router-dom';

const PricingPage: React.FC = () => {
  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">Fiyatlar</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Gizli ücret ve randevu başı komisyon yok. Salonunuzun büyüklüğüne uygun paketi seçin, işinizi dijitale taşıyın.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { 
            name: 'Starter', price: '499', period: '/ay',
            description: 'Tek başına veya küçük ekibiyle çalışan uzmanlar için temel dijital vitrin.',
            features: ['Maksimum 2 Çalışan', '10 Hizmet Ekleyebilme', 'Mini Web Sitesi & İşletme Profili', 'Online Randevu Sistemi', 'WhatsApp İletişim Butonu'] 
          },
          { 
            name: 'Professional', price: '999', period: '/ay',
            description: 'Orta ve büyük ölçekli salonlar için gelişmiş yönetim ve AI özellikleri.',
            features: ['Maksimum 8 Çalışan', 'Sınırsız Hizmet', 'Mini Web Sitesi & İşletme Profili', 'Online Randevu Sistemi', 'AI Stil Tavsiyesi (Yakında)', 'Google Maps Yönlendirmesi'],
            recommended: true
          },
          { 
            name: 'Premium', price: '1999', period: '/ay',
            description: 'Sınırları kaldırmak ve tam otomasyon isteyen büyük işletmeler için.',
            features: ['Sınırsız Çalışan', 'Sınırsız Hizmet', 'Gelişmiş Performans Raporları', 'Gelişmiş AI Analizi', 'Özel Domain Erişimi (Yakında)', 'Öncelikli Destek'] 
          },
        ].map((plan) => (
          <div key={plan.name} className={`bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border ${plan.recommended ? 'border-blue-500 shadow-blue-500/20 shadow-xl relative transform md:-translate-y-2' : 'border-gray-200 dark:border-slate-700'} flex flex-col`}>
            {plan.recommended && (
               <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                 En Popüler
               </div>
            )}
            <h3 className="text-2xl font-bold mb-2 dark:text-white">{plan.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 h-10">{plan.description}</p>
            <div className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6">₺{plan.price}<span className="text-lg text-gray-400 font-normal">{plan.period}</span></div>
            <ul className="space-y-4 mb-8 text-gray-600 dark:text-gray-300 flex-grow">
              {plan.features.map(f => (
                <li key={f} className="flex gap-3">
                   <span className="text-blue-500 font-bold">✓</span>
                   <span className="text-sm border-b border-dashed border-gray-200 dark:border-slate-700 pb-1 w-full">{f}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-3 mt-auto">
               <Link to="/demo" className={`block w-full text-center font-bold py-3.5 rounded-xl transition ${plan.recommended ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'}`}>
                 Kendi Salonumu Önizle
               </Link>
               <a href={`https://wa.me/905555555555?text=Merhaba, Randapp ${plan.name} planı hakkında bilgi almak istiyorum.`} target="_blank" rel="noreferrer" className="block w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-white py-2">
                 Satış Ekibiyle Görüş
               </a>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 text-center max-w-3xl mx-auto">
         <h4 className="text-xl font-bold mb-2 dark:text-white">Kurulum Ücreti Nedir?</h4>
         <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">İlk kayıt olduğunuzda, randevu sisteminizin yapılandırılması, çalışan ve hizmet bilgilerinizin sisteme aktarılması ve salon web sitenizin yayına hazır hale getirilmesi için tek seferlik bir kurulum ücreti alınır. Sonrasında sadece seçtiğiniz paketin aylık ücretini ödersiniz.</p>
         <Link to="/contact" className="text-blue-600 font-semibold hover:underline text-sm">Kurumsal anlaşmalar için bizimle iletişime geçin.</Link>
      </div>
    </div>
  );
};

export default PricingPage;
