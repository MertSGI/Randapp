import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Appointment } from '../types';
import * as Storage from '../services/storage';
import * as GeminiService from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('nexus_admin_auth');
    if (!isAuth) {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = () => {
    const data = Storage.getAppointments();
    // Sort by date then time
    data.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
    });
    setAppointments(data);
  };

  const handleCancel = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      Storage.updateAppointmentStatus(id, 'cancelled');
      loadData();
    }
  };

  const runAnalysis = async () => {
    setLoadingAnalysis(true);
    const analysis = await GeminiService.analyzeSchedule(appointments, language);
    setAiAnalysis(analysis);
    setLoadingAnalysis(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.admin.title}</h1>
          <p className="text-gray-500">{t.admin.subtitle}</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={runAnalysis}
             disabled={loadingAnalysis}
             className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
           >
             {loadingAnalysis ? t.admin.btn_analyzing : t.admin.btn_analysis}
           </button>
           <button 
             onClick={() => { localStorage.removeItem('nexus_admin_auth'); navigate('/login'); }}
             className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
           >
             {t.admin.btn_logout}
           </button>
        </div>
      </div>

      {/* AI Insight Box */}
      {aiAnalysis && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-1">{t.admin.ai_insights}</h3>
            <p className="text-gray-700 italic">{aiAnalysis}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm font-medium text-gray-500 uppercase">{t.admin.stats_total}</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{appointments.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm font-medium text-gray-500 uppercase">{t.admin.stats_confirmed}</div>
          <div className="mt-2 text-3xl font-bold text-green-600">
            {appointments.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'confirmed').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm font-medium text-gray-500 uppercase">{t.admin.stats_pending}</div>
          <div className="mt-2 text-3xl font-bold text-accent">0</div> 
          <span className="text-xs text-gray-400">({t.admin.synced} via API)</span>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{t.admin.recent_title}</h3>
        </div>
        <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
          {appointments.length === 0 ? (
            <li className="p-8 text-center text-gray-500">{t.admin.empty}</li>
          ) : (
            appointments.map((apt) => (
              <li key={apt.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-accent truncate">
                      {apt.user_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {apt.date} at {apt.time}
                    </p>
                    <div className="mt-1 flex items-center text-xs text-gray-400 gap-2">
                        <span>{apt.user_email}</span>
                        <span>&bull;</span>
                        <span>{t.admin.synced}: {apt.syncedToGoogle ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center gap-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {apt.status}
                    </span>
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        {t.admin.cancel}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;