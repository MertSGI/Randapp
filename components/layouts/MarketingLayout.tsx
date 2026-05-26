import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition" aria-label="Toggle Dark Mode">
      {theme === 'light' ? (
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      ) : (
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      )}
    </button>
  );
};

const MarketingLayout: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <nav className="sm:block bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold tracking-tighter">R</div>
                <span className="font-semibold text-xl text-primary dark:text-white">Randapp</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/features" className={`border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === '/features' ? 'text-gray-900 border-blue-500' : ''}`}>{language === 'tr' ? 'Özellikler' : 'Features'}</Link>
                <Link to="/pricing" className={`border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === '/pricing' ? 'text-gray-900 border-blue-500' : ''}`}>{language === 'tr' ? 'Fiyatlar' : 'Pricing'}</Link>
                <Link to="/contact" className={`border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === '/contact' ? 'text-gray-900 border-blue-500' : ''}`}>{language === 'tr' ? 'İletişim' : 'Contact'}</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-md text-xs font-semibold ${language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 dark:text-gray-300'}`}>EN</button>
                <button onClick={() => setLanguage('tr')} className={`px-3 py-1 rounded-md text-xs font-semibold ${language === 'tr' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 dark:text-gray-300'}`}>TR</button>
              </div>
              <Link to="/login" className="text-gray-600 dark:text-gray-200 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400">{language === 'tr' ? 'Giriş Yap' : 'Login'}</Link>
              <Link to="/demo" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-blue-700 transition hidden sm:block">{language === 'tr' ? 'Kendi Salonumu Önizle' : 'Preview My Salon'}</Link>
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        <div className="sm:hidden flex gap-4 overflow-x-auto px-4 py-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 whitespace-nowrap hide-scrollbar">
            <Link to="/" className={`text-sm font-medium border-b-2 ${location.pathname === '/' ? 'text-gray-900 dark:text-white border-blue-500' : 'text-gray-600 dark:text-gray-300 border-transparent'}`}>{language === 'tr' ? 'Ana Sayfa' : 'Home'}</Link>
            <Link to="/features" className={`text-sm font-medium border-b-2 ${location.pathname === '/features' ? 'text-gray-900 dark:text-white border-blue-500' : 'text-gray-600 dark:text-gray-300 border-transparent'}`}>{language === 'tr' ? 'Özellikler' : 'Features'}</Link>
            <Link to="/pricing" className={`text-sm font-medium border-b-2 ${location.pathname === '/pricing' ? 'text-gray-900 dark:text-white border-blue-500' : 'text-gray-600 dark:text-gray-300 border-transparent'}`}>{language === 'tr' ? 'Fiyatlar' : 'Pricing'}</Link>
            <Link to="/contact" className={`text-sm font-medium border-b-2 ${location.pathname === '/contact' ? 'text-gray-900 dark:text-white border-blue-500' : 'text-gray-600 dark:text-gray-300 border-transparent'}`}>{language === 'tr' ? 'İletişim' : 'Contact'}</Link>
            <Link to="/demo" className={`text-sm font-medium border-b-2 ${location.pathname === '/demo' ? 'text-blue-600 dark:text-blue-400 border-blue-500' : 'text-blue-600 dark:text-blue-400 border-transparent'}`}>{language === 'tr' ? 'Önizle' : 'Preview'}</Link>
        </div>
      </nav>
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 mt-auto py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
                   <span className="font-semibold text-xl dark:text-white">Randapp</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{language === 'tr' ? 'Kuaför ve güzellik salonları için profesyonel web sitesi ve randevu yönetim platformu.' : 'Professional website and appointment management platform for salons and beauty centers.'}</p>
            </div>
            <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">{language === 'tr' ? 'Ürün' : 'Product'}</h4>
                <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <li><Link to="/features" className="hover:text-blue-600">{language === 'tr' ? 'Özellikler' : 'Features'}</Link></li>
                    <li><Link to="/pricing" className="hover:text-blue-600">{language === 'tr' ? 'Fiyatlar' : 'Pricing'}</Link></li>
                    <li><Link to="/demo" className="hover:text-blue-600">{language === 'tr' ? 'Demo Alın' : 'Get Demo'}</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">{language === 'tr' ? 'Şirket' : 'Company'}</h4>
                <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <li><Link to="/contact" className="hover:text-blue-600">{language === 'tr' ? 'İletişime Geçin' : 'Contact Us'}</Link></li>
                    <li><a href="https://wa.me/905555555555" target="_blank" rel="noreferrer" className="hover:text-blue-600">{language === 'tr' ? 'WhatsApp Destek' : 'WhatsApp Support'}</a></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400 dark:text-gray-600 mt-12 pt-8 border-t border-gray-100 dark:border-slate-800">
          {(import.meta as any).env.VITE_DATA_MODE === 'mock' && window.location.search.includes('demoTools=1') && (
            <div className="flex flex-col items-center gap-2 mb-6 p-4 bg-gray-100 dark:bg-slate-800 rounded-lg max-w-sm mx-auto">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                {language === 'tr' ? 'Demo Araçları (Sadece Geliştirici Modu)' : 'Demo Utils (Dev Mode Only)'}
              </span>
              <div className="flex justify-center gap-4">
                 <button onClick={() => {
                    import('../../utils/demoSeeder').then(m => m.seedDemoData());
                 }} className="text-blue-500 hover:text-blue-700 text-xs font-semibold uppercase tracking-wider">
                   {language === 'tr' ? 'Pilot Demo Verisi Yükle' : 'Seed Pilot Demo Data'}
                 </button>
                 <button onClick={() => {
                    if(window.confirm(language === 'tr' ? 'Tüm yerel veriler silinecek (Demo sıfırlama). Bu işlem geri alınamaz. Emin misiniz?' : 'All local demo data will be wiped. This Cannot be undone. Are you sure?')) {
                       localStorage.clear();
                       window.location.reload();
                    }
                 }} className="text-red-500 hover:text-red-700 text-xs font-semibold uppercase tracking-wider">
                   {language === 'tr' ? 'Yerel Veriyi Sıfırla' : 'Reset Local Data'}
                 </button>
              </div>
            </div>
          )}
          &copy; {new Date().getFullYear()} Randapp Software. {language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
        </div>
      </footer>
    </div>
  );
};

export default MarketingLayout;
