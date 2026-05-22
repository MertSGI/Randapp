import React from 'react';
import { Link } from 'react-router-dom';

const MarketingHomePage: React.FC = () => {
  return (
    <div className="flex flex-col space-y-24 py-12">
      {/* Hero Section */}
      <section className="text-center px-4 max-w-4xl mx-auto">
        <div className="inline-block bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold px-4 py-1.5 rounded-full text-sm mb-6 border border-blue-100 dark:border-slate-700">
          Randapp ile İşinizi Büyütün
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
          Kuaför ve güzellik salonunuz için <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">web sitesi + akıllı randevu</span> sistemi
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 mx-auto leading-relaxed">
          Randapp, salonunuza özel mini web sitesi, online randevu, çalışan yönetimi, WhatsApp iletişimi, Google Maps ve AI stil tavsiyesini tek platformda toplar.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/demo" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition transform hover:-translate-y-1">
            Kendi Salonumu Önizle
          </Link>
          <Link to="/pricing" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold shadow-sm border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
            Fiyatları Gör
          </Link>
        </div>
        <div className="mt-16 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700 transform -skew-y-2 max-w-5xl mx-auto">
          {/* Mockup of public page */}
          <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
            <div className="flex gap-1.5"><div className="w-3 h-3 bg-red-400 rounded-full"></div><div className="w-3 h-3 bg-yellow-400 rounded-full"></div><div className="w-3 h-3 bg-green-400 rounded-full"></div></div>
            <div className="mx-auto bg-white dark:bg-slate-800 text-xs px-24 py-1 rounded shadow-sm text-gray-500">randapp.com/benimsalonum</div>
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
          <h2 className="text-3xl font-bold text-center mb-16 dark:text-white">Neden Randapp'a İhtiyacınız Var?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6 text-2xl">📱</div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Randevular Karışıyor mu?</h3>
              <p className="text-gray-600 dark:text-gray-400">WhatsApp, telefon ve DM arasında randevuları yönetmek hata yaptırır. Randapp, tüm müsaitliği otomatik hesaplar.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 text-2xl">💬</div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Fiyat Sorularından Yoruldunuz mu?</h3>
              <p className="text-gray-600 dark:text-gray-400">"Saç kesimi ne kadar?" sorularına son. İnteraktif fiyat listenizi yayınlayın, müşteriler görerek randevu alsın.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center mb-6 text-2xl">🌐</div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Bir Web Siteniz Yok mu?</h3>
              <p className="text-gray-600 dark:text-gray-400">Instagram profili yeterli değil. Kurumsal, Google Maps destekli ve profesyonel bir web profiliniz olsun.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust and Workflow */}
      <section className="px-4 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 dark:text-white">Nasıl Çalışır?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6">
             <div className="text-4xl font-black text-blue-100 dark:text-slate-800 mb-4">1</div>
             <h4 className="font-bold mb-2 dark:text-white">Demoyu Oluştur</h4>
             <p className="text-sm text-gray-500 dark:text-gray-400">Saniyeler içinde salonunuza özel sayfayı önizleyin.</p>
          </div>
          <div className="p-6">
             <div className="text-4xl font-black text-blue-200 dark:text-slate-700 mb-4">2</div>
             <h4 className="font-bold mb-2 dark:text-white">Bilgileri Gir</h4>
             <p className="text-sm text-gray-500 dark:text-gray-400">Hizmet, fiyat ve çalışan bilgilerinizi kolayca ekleyin.</p>
          </div>
          <div className="p-6">
             <div className="text-4xl font-black text-blue-300 dark:text-slate-600 mb-4">3</div>
             <h4 className="font-bold mb-2 dark:text-white">Ekibimiz Onaylasın</h4>
             <p className="text-sm text-gray-500 dark:text-gray-400">Yayına almadan önce sayfanızı ücretsiz kontrol ediyoruz.</p>
          </div>
          <div className="p-6">
             <div className="text-4xl font-black text-blue-600 dark:text-blue-500 mb-4">4</div>
             <h4 className="font-bold mb-2 dark:text-white">Randevu Almaya Başla</h4>
             <p className="text-sm text-gray-500 dark:text-gray-400">Sayfanızı yayınlayın ve komisyonsuz randevu almaya başlayın.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Sıkça Sorulan Sorular</h2>
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h4 className="font-bold text-lg mb-2 dark:text-white">Bu sadece bir randevu sistemi mi?</h4>
            <p className="text-gray-600 dark:text-gray-400">Hayır, Randapp salonunuz için kapsamlı bir dijital vitrindir. İçerisinde profesyonel bir mini web sitesi, hizmet fiyat listesi, Google Maps yönlendirmesi, takım tanıtımı, AI stil tavsiyesi ve online randevu sistemi barındırır.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h4 className="font-bold text-lg mb-2 dark:text-white">Kurulum ücreti ödüyor muyum?</h4>
            <p className="text-gray-600 dark:text-gray-400">Hayır. Sistem tamamen kendi kendinize veya Randapp destek ekibinin yönlendirmesiyle ücretsiz kurulur. Sadece seçtiğiniz paketin aylık veya yıllık abonelik ücretini ödersiniz.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h4 className="font-bold text-lg mb-2 dark:text-white">Yayına almadan önce web sitemi görebilir miyim?</h4>
            <p className="text-gray-600 dark:text-gray-400">Evet. Randapp paneline üye olduktan sonra işletme bilgilerinizi girip "Önizleme Modu"nda web sitenizi müşterilerinize açmadan önce sadece kendiniz görebilirsiniz.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h4 className="font-bold text-lg mb-2 dark:text-white">Google Maps ve WhatsApp çalışıyor mu?</h4>
            <p className="text-gray-600 dark:text-gray-400">Evet. Sisteme adresinizi ve telefon numaranızı girdiğinizde "Yol Tarifi Al" ve "WhatsApp" butonları müşterileriniz için otomatik olarak aktifleşir.</p>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="bg-blue-600 py-20 px-4 text-center rounded-3xl mx-4 max-w-6xl md:mx-auto mb-12 shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Salonunuz İçin Yeni Bir Başlangıç</h2>
        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Kayıt olmadan, kredi kartı gerektirmeden salonunuza özel web sitesi ve randevu ekranını hemen şimdi önizleyin.</p>
        <Link to="/demo" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-gray-50 transition transform hover:-translate-y-1">
          Kendi Salonumu Önizle
        </Link>
      </section>
    </div>
  );
};

export default MarketingHomePage;
