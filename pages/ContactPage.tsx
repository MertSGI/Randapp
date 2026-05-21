import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="py-12 max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">İletişime Geçin</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Sorularınız veya kurumsal anlaşmalar için bize her zaman ulaşabilirsiniz.
      </p>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <a href="mailto:iletisim@randapp.com" className="block text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 hover:underline">iletisim@randapp.com</a>
        <a href="https://wa.me/905555555555" className="inline-block bg-green-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition">
          WhatsApp'tan Yazın
        </a>
      </div>
    </div>
  );
};

export default ContactPage;
