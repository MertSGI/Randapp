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
  const { language, setLanguage, t } = useLanguage();
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
                <Link to="/features" className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 px-1 pt-1 border-b-2 text-sm font-medium">Özellikler</Link>
                <Link to="/pricing" className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 px-1 pt-1 border-b-2 text-sm font-medium">Fiyatlar</Link>
                <Link to="/demo" className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 px-1 pt-1 border-b-2 text-sm font-medium">Demo Oluştur</Link>
                <Link to="/contact" className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 px-1 pt-1 border-b-2 text-sm font-medium">İletişim</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-md text-xs font-semibold ${language === 'en' ? 'bg-white text-accent shadow-sm' : 'text-gray-500'}`}>EN</button>
                <button onClick={() => setLanguage('tr')} className={`px-3 py-1 rounded-md text-xs font-semibold ${language === 'tr' ? 'bg-white text-accent shadow-sm' : 'text-gray-500'}`}>TR</button>
              </div>
              <Link to="/login" className="text-gray-600 dark:text-gray-200 text-sm font-medium hover:opacity-80">Giriş Yap</Link>
              <a href="https://wa.me/905555555555" className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600 hidden sm:block">Abonelik Talep Et</a>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-16 sm:mb-0 max-w-7xl">
        <Outlet />
      </main>
      <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Randapp Software. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MarketingLayout;
