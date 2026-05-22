import React from 'react';
import { Link } from 'react-router-dom';

const FeaturesPage: React.FC = () => {
  return (
    <div className="py-12">
      <div className="text-center mb-16 max-w-3xl mx-auto px-4">
         <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">Salonunuzun Tüm Dijital İhtiyaçları Tek Yerde</h1>
         <p className="text-xl text-gray-600 dark:text-gray-400">Pazarlama, randevu, çalışan yönetimi ve raporlama; hepsi kendi markanız altında ücretsiz kurulumla.</p>
      </div>
      
      <div className="max-w-6xl mx-auto space-y-12 px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
           <div>
              <h3 className="text-3xl font-bold mb-4 dark:text-white">Profesyonel İşletme Profili</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Sadece bir randevu sayfası değil, salonunuza ait bir mini web sitesi oluşturun. Logonuz, kapak fotoğrafınız, işletme sloganınız ve Google Maps yol tarifiniz hepsi bir arada.</p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                 <li className="flex items-center gap-2"><span>✅</span> Markanıza özel sayfa renkleri ve logo</li>
                 <li className="flex items-center gap-2"><span>✅</span> Google Maps ile tek tıkla yol tarifi</li>
                 <li className="flex items-center gap-2"><span>✅</span> WhatsApp ve Instagram hızlı erişim butonları</li>
              </ul>
           </div>
           <div className="bg-blue-50 dark:bg-slate-800 rounded-2xl p-8 aspect-video flex items-center justify-center border border-blue-100 dark:border-slate-700">
              <span className="text-blue-500 font-bold text-xl">✨ Özelleştirilebilir Web Sitesi Arayüzü</span>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
           <div className="bg-indigo-50 dark:bg-slate-800 rounded-2xl p-8 aspect-video flex items-center justify-center border border-indigo-100 dark:border-slate-700 md:order-1 order-2">
              <span className="text-indigo-500 font-bold text-xl">📅 Akıllı Randevu Modülü</span>
           </div>
           <div className="md:order-2 order-1">
              <h3 className="text-3xl font-bold mb-4 dark:text-white">Otomatik Randevu Yönetimi</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Müşterileriniz sizin uyuduğunuz saatlerde bile randevu alabilir. Sistem her çalışanın mesai saatlerini, molalarını ve mevcut randevularını hesaplayarak çakışmaları önler.</p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                 <li className="flex items-center gap-2"><span>✅</span> 7/24 Kesintisiz online randevu</li>
                 <li className="flex items-center gap-2"><span>✅</span> Çalışan bazlı bağımsız çalışma saatleri</li>
                 <li className="flex items-center gap-2"><span>✅</span> Randevu anında tahmini süre hesaplaması</li>
              </ul>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
           <div>
              <h3 className="text-3xl font-bold mb-4 dark:text-white">AI Stil Tavsiyesi (Yakında)</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Müşterilerinize randevu almadan önce yüz hatlarına ve tarzlarına uygun saç kesimi, renk veya tırnak tasarımı analizleri sunun.</p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                 <li className="flex items-center gap-2"><span>✅</span> Fotoğraf yükleyerek AI destekli yüz analizi</li>
                 <li className="flex items-center gap-2"><span>✅</span> Salonunuzun hizmetlerine doğrudan yönlendirme</li>
                 <li className="flex items-center gap-2"><span>✅</span> Ek bir pazarlama aracı olarak fark yaratma</li>
              </ul>
           </div>
           <div className="bg-purple-50 dark:bg-slate-800 rounded-2xl p-8 aspect-video flex items-center justify-center border border-purple-100 dark:border-slate-700">
              <span className="text-purple-500 font-bold text-xl">🤖 Gemini AI Destekli Tasarım Analizi</span>
           </div>
        </div>
      </div>

      <div className="mt-20 text-center px-4">
         <h2 className="text-3xl font-bold mb-8 dark:text-white">Müşterilerinize En İyisini Sunmaya Hazır mısınız?</h2>
         <div className="flex flex-col sm:flex-row justify-center gap-4">
           <Link to="/demo" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">Kendi Salonumu Önizle</Link>
           <Link to="/pricing" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold shadow-sm border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">Paketleri İncele</Link>
         </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
