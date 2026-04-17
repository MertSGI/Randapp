import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { usePWAInstall } from '../utils/usePWAInstall';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('admin');
  const { language, setLanguage, t } = useLanguage();
  const { isInstallable, promptInstall } = usePWAInstall();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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

      <nav className="hidden sm:block bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold tracking-tighter">M</div>
                <span className="font-semibold text-xl text-primary">MA Yılmaz Design</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={`${!isAdmin ? 'border-accent text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {t.nav.book}
                </Link>
                <Link
                  to="/admin"
                  className={`${isAdmin ? 'border-accent text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {t.nav.admin}
                </Link>
                <Link
                  to="/ai-visualizer"
                  className={`${location.pathname.includes('ai-visualizer') ? 'border-accent text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {t.nav.ai_visualizer}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition ${language === 'en' ? 'bg-white text-accent shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('tr')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition ${language === 'tr' ? 'bg-white text-accent shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  TR
                </button>
              </div>
              <button className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-slate-200 transition">
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
      <nav className="sm:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 flex justify-around items-center px-2 py-3 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <Link to="/" className={`flex flex-col items-center p-2 rounded-xl transition ${!isAdmin && !location.pathname.includes('ai-visualizer') ? 'text-accent' : 'text-gray-400'}`}>
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="text-[10px] font-semibold">{t.nav.book}</span>
        </Link>
        <Link to="/ai-visualizer" className={`flex flex-col items-center p-2 rounded-xl transition ${location.pathname.includes('ai-visualizer') ? 'text-accent' : 'text-gray-400'}`}>
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span className="text-[10px] font-semibold">{t.nav.ai_visualizer}</span>
        </Link>
        <Link to="/admin" className={`flex flex-col items-center p-2 rounded-xl transition ${isAdmin ? 'text-accent' : 'text-gray-400'}`}>
          <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          <span className="text-[10px] font-semibold">{t.nav.admin}</span>
        </Link>
      </nav>

      {/* Mobile Top Header (replaces the nav we hid on small screens) */}
      <div className="sm:hidden bg-white shadow-sm sticky top-0 z-40 px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold tracking-tighter">M</div>
          <span className="font-semibold text-lg text-primary">MA Yılmaz Design</span>
        </Link>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition ${language === 'en' ? 'bg-white text-accent shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('tr')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition ${language === 'tr' ? 'bg-white text-accent shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            TR
          </button>
        </div>
      </div>

      <footer className="hidden sm:block bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {t.footer}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;