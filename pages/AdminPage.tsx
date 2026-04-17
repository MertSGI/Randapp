import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Appointment, Staff } from '../types';
import * as Storage from '../services/storage';
import * as GeminiService from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'appointments' | 'staff'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // New staff form state
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffTitle, setNewStaffTitle] = useState('');
  const [newStaffImage, setNewStaffImage] = useState('');

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
    data.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
    });
    setAppointments(data);
    setStaffList(Storage.getStaff());
  };

  const handleCancel = (id: string) => {
    if (window.confirm('Emin misiniz?' /* simplified confirm for both langs*/)) {
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

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newStaffName || !newStaffTitle) return;

    const newStaff: Staff = {
      id: `stf_${Date.now()}`,
      name: newStaffName,
      title: newStaffTitle,
      image: newStaffImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(newStaffName)}&background=random`
    };

    Storage.saveStaff(newStaff);
    loadData();
    setNewStaffName('');
    setNewStaffTitle('');
    setNewStaffImage('');
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`${activeTab === 'appointments' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {t.admin.tab_appointments}
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`${activeTab === 'staff' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {t.admin.tab_staff}
          </button>
        </nav>
      </div>

      {activeTab === 'appointments' && (
        <div className="space-y-8">
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
                appointments.map((apt) => {
                  const assignedStaff = staffList.find(s => s.id === apt.staffId);
                  return (
                    <li key={apt.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-accent truncate">
                            {apt.user_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {apt.date} at {apt.time} {assignedStaff && `(with ${assignedStaff.name})`}
                          </p>
                          <div className="mt-1 flex items-center text-xs text-gray-400 gap-2">
                              <span>{apt.user_email}</span>
                              <span>•</span>
                              <span>{apt.phone || 'No phone'}</span>
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
                  )
                })
              )}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="space-y-8">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden p-6">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-4 mb-4">
              Add New Staff / Specialist
            </h3>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input required type="text" value={newStaffName} onChange={e => setNewStaffName(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm border p-2"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title / Role</label>
                  <input required type="text" value={newStaffTitle} onChange={e => setNewStaffTitle(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm border p-2"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
                  <input type="text" value={newStaffImage} onChange={e => setNewStaffImage(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm border p-2"/>
                </div>
              </div>
              <button type="submit" className="bg-accent text-white px-4 py-2 rounded-md shadow-sm font-medium hover:bg-blue-600">
                Add Staff
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffList.map(staff => (
              <div key={staff.id} className="bg-white border text-center p-6 border-gray-200 rounded-xl shadow-sm flex flex-col items-center">
                <img src={staff.image} alt={staff.name} className="w-16 h-16 rounded-full mb-3 object-cover shadow-sm"/>
                <h4 className="font-bold text-gray-900 text-lg">{staff.name}</h4>
                <p className="text-sm text-gray-500 mb-4">{staff.title}</p>
                <div className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{staff.id}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
