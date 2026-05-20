import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/admin');
    } else {
      setError(t.login.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100 dark:border-slate-700 transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white transition-colors duration-300">{t.login.title}</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Email (Mock: admin@randapp.com)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border transition-colors duration-300"
              placeholder="Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">{t.login.password} (Mock: admin123)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border transition-colors duration-300"
              placeholder={t.login.placeholder}
            />
          </div>
          {error && <p className="text-red-500 dark:text-red-400 text-sm transition-colors duration-300">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
          >
            {t.login.button}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500 transition-colors duration-300">
          {t.login.hint}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;