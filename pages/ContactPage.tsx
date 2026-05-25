import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [salonName, setSalonName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  
  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    const text = t.marketing.contact.wa_template.replace('{salon}', salonName).replace('{city}', city).replace('{phone}', phone);
    window.open(`https://wa.me/905555555555?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">{t.marketing.contact.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {t.marketing.contact.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
         <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-700">
           <h3 className="text-2xl font-bold mb-6 dark:text-white">{t.marketing.contact.form_title}</h3>
           <p className="text-sm text-gray-500 mb-6">{t.marketing.contact.form_notice}</p>
           <form onSubmit={handleWhatsAppRedirect} className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.marketing.contact.form_salon}</label>
               <input required type="text" autocomplete="organization" value={salonName} onChange={e => setSalonName(e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-slate-600 p-3 bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.marketing.contact.form_city}</label>
               <input required type="text" autocomplete="address-level2" value={city} onChange={e => setCity(e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-slate-600 p-3 bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.marketing.contact.form_phone}</label>
               <input required type="tel" autocomplete="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-slate-600 p-3 bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
             <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition mt-4">
               {t.marketing.contact.btn_send}
             </button>
           </form>
         </div>

         <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
               <h3 className="text-xl font-bold mb-4 dark:text-white">{t.marketing.contact.fast_contact_title}</h3>
               <p className="text-gray-600 dark:text-gray-400 mb-6">{t.marketing.contact.fast_contact_desc}</p>
               <a href="https://wa.me/905555555555" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-600 transition mb-4">
                  {t.marketing.contact.btn_wa}
               </a>
               <a href="mailto:iletisim@randapp.com" className="flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition">
                  iletisim@randapp.com
               </a>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-3xl border border-blue-100 dark:border-blue-800">
               <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">{t.marketing.contact.support_hours_title}</h3>
               <p className="text-blue-600 dark:text-blue-400">{t.marketing.contact.support_hours_1}</p>
               <p className="text-blue-600 dark:text-blue-400">{t.marketing.contact.support_hours_2}</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ContactPage;
