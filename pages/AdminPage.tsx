import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Appointment, Staff } from '../types';
import * as GeminiService from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useTenant } from '../contexts/TenantContext';
import { useAuth } from '../contexts/AuthContext';
import { getAppointments, updateAppointmentStatus } from '../services/appointmentService';
import { getStaffList, createStaff, updateStaff, deleteStaff } from '../services/staffService';
import { getServices, createService, updateService, deleteService } from '../services/serviceCatalogService';
import { Service } from '../types';

import BillingTab from '../components/BillingTab';
import OnboardingWizard from '../components/OnboardingWizard';
import SalonReportsTab from '../components/SalonReportsTab';
import BusinessProfileTab from '../components/BusinessProfileTab';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { tenant, refreshTenant } = useTenant();
  const { currentUser, isLoading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'setup' | 'appointments' | 'staff' | 'services' | 'reports' | 'billing' | 'profile' | 'settings'>('setup');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // New/Edit staff form state
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffTitle, setNewStaffTitle] = useState('');
  const [newStaffImage, setNewStaffImage] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');

  const [newStaffActive, setNewStaffActive] = useState(true);

  // New/Edit service form state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceNameTr, setNewServiceNameTr] = useState('');
  const [newServicePrice, setNewServicePrice] = useState<number>(0);
  const [newServiceDuration, setNewServiceDuration] = useState<number>(30);
  const [newServiceImage, setNewServiceImage] = useState('');
  const [newServiceActive, setNewServiceActive] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (tenant) {
      loadData();
    }
  }, [navigate, tenant, currentUser, authLoading]);

  const loadData = async () => {
    if (!tenant) return;
    const data = await getAppointments(tenant.id);
    data.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
    });
    setAppointments(data);
    
    const staffData = await getStaffList(tenant.id);
    setStaffList(staffData);

    const servicesData = await getServices(tenant.id);
    setServicesList(servicesData);
  };

  const handleCancel = async (id: string) => {
    if (!tenant) return;
    if (window.confirm('Emin misiniz?' /* simplified confirm for both langs*/)) {
      await updateAppointmentStatus(tenant.id, id, 'cancelled');
      loadData();
    }
  };

  const runAnalysis = async () => {
    setLoadingAnalysis(true);
    const analysis = await GeminiService.analyzeSchedule(appointments, language);
    setAiAnalysis(analysis);
    setLoadingAnalysis(false);
  };

  const handleToggleStaffActive = async (teacher: Staff) => {
    if (!tenant) return;
    await updateStaff(tenant.id, teacher.id, { active: !teacher.active });
    loadData();
  };

  const handleToggleServiceActive = async (service: Service) => {
    if (!tenant) return;
    await updateService(tenant.id, service.id, { active: !service.active });
    loadData();
  };

  const handleDeleteService = async (id: string) => {
    if (!tenant) return;
    if (window.confirm(language === 'tr' ? 'Bu hizmeti silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this service?')) {
      await deleteService(tenant.id, id);
      loadData();
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newServiceName || !tenant) return;

    if (!editingServiceId) {
      const { subscriptionService } = await import('../services/subscriptionService');
      const canAdd = await subscriptionService.canAddService(tenant.id);
      if (!canAdd) {
        // Final enforcement must happen server-side via Supabase Edge Functions or RLS policies.
        alert('Mevcut planınız daha fazla hizmet eklemeyi desteklemiyor. Planınızı yükseltin.');
        return;
      }
    }

    const payload = {
      name: newServiceName,
      name_tr: newServiceNameTr || newServiceName,
      price: newServicePrice,
      duration: newServiceDuration,
      image: newServiceImage || undefined,
      active: newServiceActive
    };

    if (editingServiceId) {
      await updateService(tenant.id, editingServiceId, payload);
    } else {
      await createService(tenant.id, payload);
    }
    
    loadData();
    resetServiceForm();
  };

  const initiateEditService = (service: Service) => {
    setEditingServiceId(service.id);
    setNewServiceName(service.name);
    setNewServiceNameTr(service.name_tr || '');
    setNewServicePrice(service.price);
    setNewServiceDuration(service.duration);
    setNewServiceImage(service.image || '');
    setNewServiceActive(service.active ?? true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setNewServiceName('');
    setNewServiceNameTr('');
    setNewServicePrice(0);
    setNewServiceDuration(30);
    setNewServiceImage('');
    setNewServiceActive(true);
  };

  const handleDeleteStaff = async (id: string, name: string) => {
    if (!tenant) return;
    if (id === 'stf_1' || name.toLowerCase().includes('mustafa ali yılmaz')) {
      alert(language === 'tr' ? 'Bu çalışanı silemezsiniz.' : 'You cannot delete the master owner.');
      return;
    }
    if (window.confirm(language === 'tr' ? 'Bu çalışanı silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this staff member?')) {
      await deleteStaff(tenant.id, id);
      loadData();
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newStaffName || !newStaffTitle || !tenant) return;

    if (!editingStaffId) {
      const { subscriptionService } = await import('../services/subscriptionService');
      const canAdd = await subscriptionService.canAddStaff(tenant.id);
      if (!canAdd) {
        // Final enforcement must happen server-side via Supabase Edge Functions or RLS policies.
        alert('Mevcut planınız daha fazla çalışan eklemeyi desteklemiyor. Planınızı yükseltin.');
        return;
      }
    }

    if (editingStaffId) {
      await updateStaff(tenant.id, editingStaffId, {
        name: newStaffName,
        title: newStaffTitle,
        image: newStaffImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(newStaffName)}&background=random`,
        calendarEmail: newStaffEmail || undefined,
        phone: newStaffPhone || undefined,
        active: newStaffActive
      });
    } else {
      await createStaff(tenant.id, {
        name: newStaffName,
        title: newStaffTitle,
        image: newStaffImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(newStaffName)}&background=random`,
        calendarEmail: newStaffEmail || undefined,
        phone: newStaffPhone || undefined,
        active: newStaffActive
      });
    }
    
    loadData();
    resetForm();
  };

  const initiateEdit = (staff: Staff) => {
    setEditingStaffId(staff.id);
    setNewStaffName(staff.name);
    setNewStaffTitle(staff.title);
    setNewStaffImage(staff.image || '');
    setNewStaffEmail(staff.calendarEmail || '');
    setNewStaffPhone(staff.phone || '');
    setNewStaffActive(staff.active ?? true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingStaffId(null);
    setNewStaffName('');
    setNewStaffTitle('');
    setNewStaffImage('');
    setNewStaffEmail('');
    setNewStaffPhone('');
    setNewStaffActive(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{t.admin.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">{t.admin.subtitle}</p>
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
             onClick={() => { logout(); navigate('/login'); }}
             className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
           >
             {t.admin.btn_logout}
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('setup')}
            className={`${activeTab === 'setup' ? 'border-accent text-accent dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300`}
          >
            Kurulum
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`${activeTab === 'appointments' ? 'border-accent text-accent dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300`}
          >
            {t.admin.tab_appointments}
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`${activeTab === 'staff' ? 'border-accent text-accent dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300`}
          >
            {t.admin.tab_staff}
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`${activeTab === 'services' ? 'border-accent text-accent dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300`}
          >
            {language === 'tr' ? 'Hizmetler' : 'Services'}
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`${activeTab === 'reports' ? 'border-accent text-accent dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300`}
          >
            {language === 'tr' ? 'Raporlar' : 'Reports'}
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`${activeTab === 'billing' ? 'border-accent text-accent dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300`}
          >
            Abonelik
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`${activeTab === 'profile' ? 'border-accent text-accent dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300`}
          >
            Web Sitesi / İşletme Profili
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`${activeTab === 'settings' ? 'border-accent text-accent dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300`}
          >
            {language === 'tr' ? 'Ayarlar' : 'Settings'}
          </button>
        </nav>
      </div>

      {activeTab === 'setup' && (
        <OnboardingWizard 
          staffList={staffList}
          servicesList={servicesList}
          appointments={appointments}
          onNavigateToTab={(tab) => setActiveTab(tab)}
          refreshData={() => {
             // In future, trigger individual fetches if needed
             if (tenant) {
               refreshTenant(); // Re-fetches tenant branding
             }
          }}
        />
      )}

      {activeTab === 'appointments' && (
        <div className="space-y-8">
          {/* AI Insight Box */}
          {aiAnalysis && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/40 border border-blue-100 dark:border-blue-800 rounded-lg p-4 shadow-sm transition-colors duration-300">
                <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide mb-1 transition-colors duration-300">{t.admin.ai_insights}</h3>
                <p className="text-gray-700 dark:text-gray-300 italic transition-colors duration-300">{aiAnalysis}</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">{t.admin.stats_total}</div>
              <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{appointments.length}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">{t.admin.stats_confirmed}</div>
              <div className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                {appointments.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'confirmed').length}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase transition-colors duration-300">{t.admin.stats_pending}</div>
              <div className="mt-2 text-3xl font-bold text-accent dark:text-blue-400 transition-colors duration-300">0</div> 
              <span className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-300">({t.admin.synced} via API)</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white transition-colors duration-300">{t.admin.recent_title}</h3>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-slate-700 max-h-[600px] overflow-y-auto">
              {appointments.length === 0 ? (
                <li className="p-8 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300">{t.admin.empty}</li>
              ) : (
                appointments.map((apt) => {
                  const assignedStaff = staffList.find(s => s.id === apt.staffId);
                  return (
                    <li key={apt.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-accent dark:text-blue-400 truncate transition-colors duration-300">
                            {apt.user_name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                            {apt.date} at {apt.time} {assignedStaff && `(with ${assignedStaff.name})`}
                          </p>
                          <div className="mt-1 flex items-center text-xs text-gray-400 dark:text-gray-500 gap-2 transition-colors duration-300">
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
          <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden p-6 transition-colors duration-300">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-4 mb-4 transition-colors duration-300">
              {editingStaffId ? (language === 'tr' ? 'Çalışanı Düzenle' : 'Edit Staff') : (language === 'tr' ? 'Yeni Uzman Ekle' : 'Add New Staff / Specialist')}
            </h3>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Full Name</label>
                  <input required placeholder="Mustafa Ali Yılmaz" type="text" value={newStaffName} onChange={e => setNewStaffName(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white shadow-sm border p-2 transition-colors duration-300"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Title / Role</label>
                  <input required placeholder="Master Designer" type="text" value={newStaffTitle} onChange={e => setNewStaffTitle(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white shadow-sm border p-2 transition-colors duration-300"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Image URL</label>
                  <input type="text" placeholder="https://..." value={newStaffImage} onChange={e => setNewStaffImage(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white shadow-sm border p-2 transition-colors duration-300"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Google Calendar Email</label>
                  <input type="email" placeholder="example@gmail.com" value={newStaffEmail} onChange={e => setNewStaffEmail(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white shadow-sm border p-2 transition-colors duration-300"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Phone Number</label>
                  <input type="tel" placeholder="+905554443322" value={newStaffPhone} onChange={e => setNewStaffPhone(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white shadow-sm border p-2 transition-colors duration-300"/>
                </div>
                <div className="flex items-center">
                  <input id="staff-active" type="checkbox" checked={newStaffActive} onChange={e => setNewStaffActive(e.target.checked)} className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"/>
                  <label htmlFor="staff-active" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    {language === 'tr' ? 'Aktif (Randevuya Açık)' : 'Active (Available for booking)'}
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                  <button type="submit" className="bg-accent text-white px-4 py-2 rounded-md shadow-sm font-medium hover:bg-blue-600">
                    {editingStaffId ? (language === 'tr' ? 'Güncelle' : 'Update') : (language === 'tr' ? 'Ekle' : 'Add Staff')}
                  </button>
                  {editingStaffId && (
                      <button type="button" onClick={resetForm} className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md shadow-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors duration-300">
                        {language === 'tr' ? 'İptal' : 'Cancel'}
                      </button>
                  )}
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffList.map(staff => {
              const isOwner = staff.id === 'stf_1' || staff.name.toLowerCase().includes('mustafa ali yılmaz');
              return (
              <div key={staff.id} className={`bg-white dark:bg-slate-800 border text-center p-6 border-gray-200 dark:border-slate-700 rounded-xl shadow-sm flex flex-col items-center relative group transition-colors duration-300 ${!staff.active ? 'opacity-60' : ''}`}>
                {!staff.active && (
                   <span className="absolute top-2 left-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md">{language === 'tr' ? 'İnaktif' : 'Inactive'}</span>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => handleToggleStaffActive(staff)}
                        className={`p-1 text-gray-400 dark:text-gray-500 hover:text-${staff.active ? 'yellow' : 'green'}-500 rounded-full hover:bg-${staff.active ? 'yellow' : 'green'}-50 dark:hover:bg-slate-700 transition-colors duration-300`}
                        title={language === 'tr' ? (staff.active ? 'Devre Dışı Bırak' : 'Aktif Et') : (staff.active ? 'Deactivate' : 'Activate')}
                    >
                      {staff.active ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      )}
                    </button>
                    <button 
                        onClick={() => initiateEdit(staff)}
                        className="p-1 text-gray-400 dark:text-gray-500 hover:text-accent dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors duration-300"
                        title={language === 'tr' ? 'Düzenle' : 'Edit'}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    {!isOwner && (
                    <button 
                        onClick={() => handleDeleteStaff(staff.id, staff.name)}
                        className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-slate-700 transition-colors duration-300"
                        title={language === 'tr' ? 'Çalışanı Sil' : 'Delete Staff'}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    )}
                </div>
                <img src={staff.image} alt={staff.name} className="w-16 h-16 rounded-full mb-3 object-cover shadow-sm"/>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg transition-colors duration-300">{staff.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">{staff.title}</p>
                <div className="flex flex-col gap-1 items-center w-full">
                    <div className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full transition-colors duration-300">{staff.id}</div>
                    {staff.calendarEmail && <div className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full truncate w-full transition-colors duration-300" title={staff.calendarEmail}>Google: {staff.calendarEmail}</div>}
                    {staff.phone && <div className="text-xs bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full truncate w-full transition-colors duration-300">{staff.phone}</div>}
                </div>
              </div>
            )})}
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden p-6 transition-colors duration-300">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-4 mb-4 transition-colors duration-300">
              {editingServiceId ? (language === 'tr' ? 'Hizmeti Düzenle' : 'Edit Service') : (language === 'tr' ? 'Yeni Hizmet Ekle' : 'Add New Service')}
            </h3>
            <form onSubmit={handleAddService} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Name (English)</label>
                  <input required placeholder="Haircut" type="text" value={newServiceName} onChange={e => setNewServiceName(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white shadow-sm border p-2 transition-colors duration-300"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Name (Turkish)</label>
                  <input placeholder="Saç Kesimi" type="text" value={newServiceNameTr} onChange={e => setNewServiceNameTr(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white shadow-sm border p-2 transition-colors duration-300"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Price (₺)</label>
                  <input required type="number" min="0" step="10" value={newServicePrice} onChange={e => setNewServicePrice(Number(e.target.value))} className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white shadow-sm border p-2 transition-colors duration-300"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Duration (mins)</label>
                  <input required type="number" min="5" step="5" value={newServiceDuration} onChange={e => setNewServiceDuration(Number(e.target.value))} className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white shadow-sm border p-2 transition-colors duration-300"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Image URL</label>
                  <input type="text" placeholder="https://..." value={newServiceImage} onChange={e => setNewServiceImage(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white shadow-sm border p-2 transition-colors duration-300"/>
                </div>
                <div className="flex items-center">
                  <input id="service-active" type="checkbox" checked={newServiceActive} onChange={e => setNewServiceActive(e.target.checked)} className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"/>
                  <label htmlFor="service-active" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    {language === 'tr' ? 'Aktif (Randevuya Açık)' : 'Active (Available for booking)'}
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                  <button type="submit" className="bg-accent text-white px-4 py-2 rounded-md shadow-sm font-medium hover:bg-blue-600">
                    {editingServiceId ? (language === 'tr' ? 'Güncelle' : 'Update') : (language === 'tr' ? 'Ekle' : 'Add Service')}
                  </button>
                  {editingServiceId && (
                      <button type="button" onClick={resetServiceForm} className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md shadow-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors duration-300">
                        {language === 'tr' ? 'İptal' : 'Cancel'}
                      </button>
                  )}
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map(service => (
              <div key={service.id} className={`bg-white dark:bg-slate-800 border text-center p-6 border-gray-200 dark:border-slate-700 rounded-xl shadow-sm flex flex-col items-center relative group transition-colors duration-300 ${!service.active ? 'opacity-60' : ''}`}>
                {!service.active && (
                   <span className="absolute top-2 left-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md">{language === 'tr' ? 'İnaktif' : 'Inactive'}</span>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => handleToggleServiceActive(service)}
                        className={`p-1 text-gray-400 dark:text-gray-500 hover:text-${service.active ? 'yellow' : 'green'}-500 rounded-full hover:bg-${service.active ? 'yellow' : 'green'}-50 dark:hover:bg-slate-700 transition-colors duration-300`}
                        title={language === 'tr' ? (service.active ? 'Devre Dışı Bırak' : 'Aktif Et') : (service.active ? 'Deactivate' : 'Activate')}
                    >
                      {service.active ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      )}
                    </button>
                    <button 
                        onClick={() => initiateEditService(service)}
                        className="p-1 text-gray-400 dark:text-gray-500 hover:text-accent dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors duration-300"
                        title={language === 'tr' ? 'Düzenle' : 'Edit'}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => handleDeleteService(service.id)}
                        className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-slate-700 transition-colors duration-300"
                        title={language === 'tr' ? 'Hizmeti Sil' : 'Delete Service'}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
                <div className="w-full h-32 mb-4 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                  {service.image ? (
                    <img src={service.image} alt={service.name} className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400"><span className="text-sm">No Image</span></div>
                  )}
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg transition-colors duration-300">{language === 'tr' ? service.name_tr || service.name : service.name}</h4>
                <div className="flex gap-4 mt-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
                   <span>{service.duration} {language === 'tr' ? 'dk' : 'min'}</span>
                   <span>•</span>
                   <span className="font-bold text-accent dark:text-blue-400">₺{service.price}</span>
                </div>
                <div className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full transition-colors duration-300">{service.id}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'reports' && (
        <SalonReportsTab 
          appointments={appointments} 
          services={servicesList} 
          staff={staffList} 
        />
      )}
      
      {activeTab === 'billing' && <BillingTab />}

      {activeTab === 'profile' && <BusinessProfileTab />}
      
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 p-6">
           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Çalışma Saatleri</h3>
           <p className="text-gray-600 dark:text-gray-400 mb-6 border-b border-gray-200 dark:border-slate-700 pb-4">
               Şu anda varsayılan çalışma saatleri uygulanmaktadır. Personel özelinde mesai saatleri "Çalışanlar" sekmesinden ayarlanabilmektedir. Detaylı işletme çalışma saatleri ve tatil günleri yakında eklenecektir.
           </p>
           
           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">İptal Politikası</h3>
           <p className="text-gray-600 dark:text-gray-400 mb-4">
               Randevuların iptal edilebilmesi için geçmesi gereken minimum süreyi buradan ayarlayabileceksiniz (Yakında).
           </p>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
