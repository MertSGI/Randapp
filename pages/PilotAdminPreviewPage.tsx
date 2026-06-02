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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
       {/* Preview Header Banner */}
       <div className="bg-indigo-600 text-white py-3 px-4 text-center text-sm font-medium shadow-md relative z-50 flex items-center justify-center flex-col sm:flex-row gap-2">
           <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              Bu ekran salt okunur bir önizlemedir. Gerçek kullanımda daha faza özellik bulunur.
           </span>
       </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Salon Yönetimi</h1>
                  <p className="text-gray-500">Demo İşletme - LUMINA Güzellik</p>
              </div>
              <button onClick={() => navigate('/pilot')} className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-white rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                  Geri Dön
              </button>
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
                 <h2 className="text-lg font-bold text-gray-900 dark:text-white">Örnek Randevular (Lumina Demo)</h2>
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
  );
};
