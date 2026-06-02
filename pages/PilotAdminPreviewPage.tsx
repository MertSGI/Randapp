import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pilotDemoService, DEMO_PILOT_TENANT_ID } from '../services/pilotDemoService';
import { getAppointments } from '../services/appointmentService';
import { getStaffList } from '../services/staffService';
import { getServices } from '../services/serviceCatalogService';
import { Appointment, Staff, Service } from '../types';

export const PilotAdminPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDemoData = async () => {
      // Ensure the demo data is seeded
      await pilotDemoService.seedDemoDataOnly();
      const tenantId = DEMO_PILOT_TENANT_ID;
      
      const apts = await getAppointments(tenantId);
      apts.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
      setAppointments(apts);
      
      setStaffList(await getStaffList(tenantId));
      setServicesList(await getServices(tenantId));
      
      setLoading(false);
    };
    loadDemoData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
         <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-2"></div>
         </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter(a => a.date === todayStr);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row">
       {/* Sidebar */}
       <div className="w-full md:w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col shrink-0">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">L</div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lumina Demo</h2>
             </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
             <a href="#" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-medium">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                Genel Bakış
             </a>
             <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Randevular
             </a>
             <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                Müşteriler
             </a>
             <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                Hizmetler
             </a>
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-slate-700 text-center">
             <button onClick={() => navigate('/register')} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2">
                14 Gün Ücretsiz Başla
             </button>
             <p className="text-xs text-gray-500 mt-3">Bu bir tanıtım önizlemesidir.</p>
          </div>
       </div>

       {/* Main Content */}
       <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          {/* Preview Header Banner */}
          <div className="bg-indigo-600 text-white py-3 px-4 text-center text-sm font-medium shadow-md relative z-50 flex items-center justify-center flex-col sm:flex-row gap-2 shrink-0">
              <span className="flex items-center gap-2">
                 <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                 Bu ekran salt okunur bir örnek paneldir.
              </span>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <div>
                     <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Genel Bakış</h1>
                     <p className="text-gray-500 dark:text-gray-400">İşletmenizin performans özeti</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/demo')} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg shadow-sm transition">
                        Kendi İşletmeni Önizle
                    </button>
                    <button onClick={() => navigate('/pilot')} className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-white rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                        Geri Dön
                    </button>
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-slate-700">
                  <div className="text-sm font-medium text-gray-400 uppercase">Toplam Randevu</div>
                  <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{appointments.length}</div>
               </div>
               <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-slate-700">
                  <div className="text-sm font-medium text-gray-400 uppercase">Bugün Onaylananlar</div>
                  <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{todayApts.filter(a => a.status === 'confirmed').length}</div>
               </div>
               <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-slate-700">
                  <div className="text-sm font-medium text-gray-400 uppercase">Uzman Sayısı</div>
                  <div className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">{staffList.length}</div>
               </div>
             </div>

             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Yaklaşan Randevular</h2>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-slate-700">
                    {appointments.slice(0, 5).map(apt => {
                       const assignedStaff = staffList.find(s => s.id === apt.staffId);
                       const assignedService = servicesList.find(s => s.id === apt.serviceId);
                       return (
                           <div key={apt.id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                               <div className="flex flex-col sm:flex-row justify-between gap-4">
                                   <div>
                                       <h4 className="text-base font-bold text-gray-900 dark:text-white">{apt.user_name}</h4>
                                       <p className="text-sm text-gray-500 mt-1">{apt.date} • {apt.time} • {assignedService?.name || 'Servis'}</p>
                                       <p className="text-sm text-gray-400 mt-0.5">Uzman: {assignedStaff?.name || 'Seçilmedi'}</p>
                                   </div>
                                   <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {apt.status === 'confirmed' ? 'ONAYLI' : apt.status}
                                        </span>
                                   </div>
                               </div>
                           </div>
                       );
                    })}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
