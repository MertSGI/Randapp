import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTenant } from '../contexts/TenantContext';
import { usePWAInstall } from '../utils/usePWAInstall';

interface LayoutProps {
  children: React.ReactNode;
}

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'light' ? (
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      ) : (
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      )}
    </button>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('admin');
  const { language, setLanguage, t } = useLanguage();
  const { isInstallable, promptInstall } = usePWAInstall();
  const { branding, isLoadingTenant, tenantStatus } = useTenant();

  if (isLoadingTenant) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div></div>;
  }

  if (tenantStatus === 'not_found') {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900"><div className="text-center"><h1 className="text-3xl font-bold dark:text-white">Salon Not Found</h1><p className="mt-2 text-gray-500">This booking site is not active or doesn't exist.</p></div></div>;
  }

  if (tenantStatus === 'suspended') {
     return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900"><div className="text-center"><h1 className="text-3xl font-bold dark:text-white">Account Suspended</h1><p className="mt-2 text-gray-500">This salon's account is currently suspended.</p></div></div>;
  }

  const businessName = branding?.businessName || 'Salon';
  const logoInitial = businessName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* PWA Install Banner */}
      {isInstallable && (
        <div className="bg-accent text-white px-4 py-3 flex justify-between items-center text-sm shadow-md z-50">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="font-medium">
              {language === 'tr' ? "Daha iyi deneyim için uygulamayı ana ekrana ekleyin!" : "Install our app for a better experience!"}
            </span>
          </div>
          <button 
            onClick={promptInstall}
            className="bg-white text-accent px-4 py-1.5 rounded-lg font-bold shadow-sm hover:bg-blue-50 transition"
          >
            {language === 'tr' ? "Yükle" : "Install"}
          </button>
        </div>
      )}

      <nav className="hidden sm:block bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                {branding?.logoUrl ? (
                   <img src={branding.logoUrl} alt={businessName} className="h-8 w-auto rounded" />
                ) : (
                   <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-bold tracking-tighter transition-colors duration-300">{logoInitial}</div>
                )}
                <span className="font-semibold text-xl text-primary dark:text-white transition-colors duration-300">{businessName}</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={`${!isAdmin ? 'border-accent text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-slate-600'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-300`}
                >
                  {t.nav.book}
                </Link>
                <Link
                  to="/admin"
                  className={`${isAdmin ? 'border-accent text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-slate-600'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-300`}
                >
                  {t.nav.admin}
                </Link>
                <Link
                  to="/ai-visualizer"
                  className={`${location.pathname.includes('ai-visualizer') ? 'border-accent text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-slate-600'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-300`}
                >
                  {t.nav.ai_visualizer}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1 transition-colors duration-300">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition ${language === 'en' ? 'bg-white dark:bg-slate-600 text-accent dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('tr')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition ${language === 'tr' ? 'bg-white dark:bg-slate-600 text-accent dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'}`}
                >
                  TR
                </button>
              </div>
              <button className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-md text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                {isAdmin ? t.nav.mode_admin : t.nav.mode_guest}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-16 sm:mb-0 max-w-7xl">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 w-full bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 z-50 flex justify-around items-center px-2 py-3 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)] transition-colors duration-300">
        <Link to="/" className={`flex flex-col items-center p-2 rounded-xl transition ${!isAdmin && !location.pathname.includes('ai-visualizer') ? 'text-accent dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="text-[10px] font-semibold">{t.nav.book}</span>
        </Link>
        <Link to="/ai-visualizer" className={`flex flex-col items-center p-2 rounded-xl transition ${location.pathname.includes('ai-visualizer') ? 'text-accent dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span className="text-[10px] font-semibold">{t.nav.ai_visualizer}</span>
        </Link>
        <Link to="/admin" className={`flex flex-col items-center p-2 rounded-xl transition ${isAdmin ? 'text-accent dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          <span className="text-[10px] font-semibold">{t.nav.admin}</span>
        </Link>
      </nav>

      {/* Mobile Top Header */}
      <div className="sm:hidden bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-40 px-4 py-3 flex justify-between items-center transition-colors duration-300">
        <Link to="/" className="flex items-center gap-2">
           {branding?.logoUrl ? (
                   <img src={branding.logoUrl} alt={businessName} className="h-8 w-auto rounded" />
                ) : (
                   <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-bold tracking-tighter transition-colors duration-300">{logoInitial}</div>
           )}
          <span className="font-semibold text-lg text-primary dark:text-white">{businessName}</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1 transition-colors duration-300">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${language === 'en' ? 'bg-white dark:bg-slate-600 text-accent dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('tr')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${language === 'tr' ? 'bg-white dark:bg-slate-600 text-accent dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'}`}
            >
              TR
            </button>
          </div>
        </div>
      </div>

      <footer className="hidden sm:block bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {branding?.footerText || t.footer}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;