import React, { useState, useEffect } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { Staff, Service, Appointment } from '../types';
import { goLiveService, GoLiveReadiness } from '../services/goLiveService';

import { createService } from '../services/serviceCatalogService';
import { createStaff } from '../services/staffService';

interface OnboardingWizardProps {
  staffList: Staff[];
  servicesList: Service[];
  appointments: Appointment[];
  refreshData: () => void;
  onNavigateToTab?: (tab: 'setup' | 'appointments' | 'staff' | 'services' | 'reports' | 'billing' | 'settings') => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ 
  staffList, 
  servicesList, 
  appointments, 
  refreshData,
  onNavigateToTab
}) => {
  const { tenant, refreshTenant } = useTenant();
  
  // States based on previous setup
  const [setupSalonName, setSetupSalonName] = useState(tenant?.name || '');
  const [setupLogoUrl, setSetupLogoUrl] = useState(tenant?.branding?.logoUrl || '');
  const [setupPrimaryColor, setSetupPrimaryColor] = useState(tenant?.branding?.primaryColor || '#000000');
  const [setupWhatsapp, setSetupWhatsapp] = useState(tenant?.branding?.whatsappNumber || '');
  const [setupInstagram, setSetupInstagram] = useState(tenant?.branding?.instagramUrl || '');
  const [setupAddress, setSetupAddress] = useState(tenant?.branding?.address || '');
  const [setupFooter, setSetupFooter] = useState(tenant?.branding?.footerText || '');
  const [setupSaving, setSetupSaving] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  
  const [activeStep, setActiveStep] = useState(1);
  const [readiness, setReadiness] = useState<GoLiveReadiness | null>(null);

  // New states for business profile
  const [profileShortDesc, setProfileShortDesc] = useState('');
  const [profileAddress, setProfileAddress] = useState('');

  // Quick add states
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('500');
  const [newServiceDuration, setNewServiceDuration] = useState('60');
  const [newServiceActive, setNewServiceActive] = useState(true);
  
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffTitle, setNewStaffTitle] = useState('Uzman');
  const [newStaffActive, setNewStaffActive] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);

  // Business logic step completed checks
  const isInfoCompleted = !!setupSalonName && !!setupWhatsapp; // Enforced whatsapp here based on prompt
  const isBrandingCompleted = !!setupPrimaryColor;
  const isProfileCompleted = !!profileShortDesc && !!profileAddress;
  const isServicesCompleted = servicesList.some(s => s.active);
  const isStaffCompleted = staffList.some(s => s.active);
  const isTestApptCompleted = appointments.length > 0;

  useEffect(() => {
    if (tenant) {
      setSetupSalonName(tenant.name || '');
      setSetupLogoUrl(tenant.branding?.logoUrl || '');
      setSetupPrimaryColor(tenant.branding?.primaryColor || '#000000');
      setSetupWhatsapp(tenant.branding?.whatsappNumber || '');
      setSetupInstagram(tenant.branding?.instagramUrl || '');
      setSetupAddress(tenant.branding?.address || '');
      setSetupFooter(tenant.branding?.footerText || '');
      
      goLiveService.getGoLiveReadiness(tenant.id).then(setReadiness);

      // Load profile info for onboarding step
      import('../services/businessProfileService').then(({ businessProfileService }) => {
         businessProfileService.getBusinessProfile(tenant.id).then(prof => {
            if (prof) {
               setProfileShortDesc(prof.short_description || '');
               setProfileAddress(prof.address || '');
            }
         });
      });
    }
  }, [tenant, servicesList, staffList, appointments]);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;
    if (!setupSalonName || !setupWhatsapp) {
        alert("Salon Adı ve WhatsApp numarası zorunludur.");
        return;
    }
    setSetupSaving(true);
    try {
      const { tenantService } = await import('../services/tenantService');
      await tenantService.updateTenantBranding(tenant.id, {
        businessName: setupSalonName,
        whatsappNumber: setupWhatsapp,
        instagramUrl: setupInstagram,
        address: setupAddress,
      });
      await refreshTenant();
      setActiveStep(2);
    } catch (error) {
      console.error(error);
      alert('Kayıt sırasında hata oluştu.');
    } finally {
      setSetupSaving(false);
    }
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;
    setSetupSaving(true);
    try {
      const { tenantService } = await import('../services/tenantService');
      await tenantService.updateTenantBranding(tenant.id, {
        logoUrl: setupLogoUrl,
        primaryColor: setupPrimaryColor,
        footerText: setupFooter
      });
      await refreshTenant();
      setActiveStep(3);
    } catch (error) {
      console.error(error);
      alert('Kayıt sırasında hata oluştu.');
    } finally {
      setSetupSaving(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;
    setSetupSaving(true);
    try {
      const { businessProfileService } = await import('../services/businessProfileService');
      await businessProfileService.updateBusinessProfile(tenant.id, {
        short_description: profileShortDesc,
        address: profileAddress
      });
      setActiveStep(4);
    } catch (err) {
      console.error(err);
      alert('Kayıt sırasında hata oluştu.');
    } finally {
      setSetupSaving(false);
    }
  };

  const handleQuickAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant || !newServiceName) return;
    setIsAdding(true);
    try {
      await createService(tenant.id, {
        name: newServiceName,
        name_tr: newServiceName,
        price: Number(newServicePrice),
        duration: Number(newServiceDuration),
        active: newServiceActive,
        category: 'Ek Hizmetler',
        image: ''
      } as any);
      setNewServiceName('');
      refreshData();
    } catch (err) {
      console.error(err);
      alert('Hizmet eklenemedi.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuickAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant || !newStaffName) return;
    setIsAdding(true);
    try {
      await createStaff(tenant.id, {
        name: newStaffName,
        title: newStaffTitle,
        active: newStaffActive,
        rating: 5,
        reviewCount: 0
      } as any); // using as any since types might conflict slightly without all properties
      setNewStaffName('');
      refreshData();
    } catch (err) {
      console.error(err);
      alert('Çalışan eklenemedi.');
    } finally {
      setIsAdding(false);
    }
  };

  const steps = [
    { id: 1, name: 'Salon Bilgileri', completed: isInfoCompleted },
    { id: 2, name: 'Marka & Tasarım', completed: isBrandingCompleted },
    { id: 3, name: 'İşletme Profili', completed: isProfileCompleted },
    { id: 4, name: 'Hizmetler', completed: isServicesCompleted },
    { id: 5, name: 'Çalışanlar', completed: isStaffCompleted },
    { id: 6, name: 'Çalışma Saatleri', completed: true },
    { id: 7, name: 'Test Randevusu', completed: isTestApptCompleted },
    { id: 8, name: 'Yayına Hazır', completed: isInfoCompleted && isBrandingCompleted && isProfileCompleted && isServicesCompleted && isStaffCompleted }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar Wizard Navigation */}
      <div className="md:col-span-1 border-r border-gray-200 dark:border-slate-700 pr-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Kurulum Sihirbazı</h2>
        <nav className="space-y-2">
          {steps.map(step => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between transition-colors ${
                activeStep === step.id 
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step.completed 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' 
                    : activeStep === step.id 
                      ? 'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100' 
                      : 'bg-gray-200 text-gray-500 dark:bg-slate-700 dark:text-gray-400'
                }`}>
                  {step.completed ? '✓' : step.id}
                </div>
                <span>{step.name}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="md:col-span-3">
        <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg border border-gray-200 dark:border-slate-700 p-6">
          
          {activeStep === 1 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">1. Salon Bilgilerini Girin</h3>
              <form onSubmit={handleSaveInfo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Salon Adı</label>
                  <input type="text" required value={setupSalonName} onChange={e => setSetupSalonName(e.target.value)} className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">WhatsApp Numarası <span className="text-red-500">*</span></label>
                  <input type="text" required value={setupWhatsapp} onChange={e => setSetupWhatsapp(e.target.value)} placeholder="Örn: +905550000000" className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border" />
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={setupSaving || !setupSalonName || !setupWhatsapp} className="px-6 py-2 bg-accent text-white rounded-md font-medium disabled:opacity-50">Kaydet & Sonraki</button>
                </div>
              </form>
            </div>
          )}

          {activeStep === 2 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">2. Marka ve Tasarım</h3>
              <form onSubmit={handleSaveBranding} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Logo URL (Opsiyonel)</label>
                  <input type="text" value={setupLogoUrl} onChange={e => setSetupLogoUrl(e.target.value)} placeholder="https://..." className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ana Renk (Primary Color)</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={setupPrimaryColor} onChange={e => setSetupPrimaryColor(e.target.value)} className="h-10 w-16 p-1 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700" />
                    <span className="font-mono text-gray-500">{setupPrimaryColor}</span>
                  </div>
                </div>
                <div className="pt-4 flex justify-between">
                  <button type="button" onClick={() => setActiveStep(1)} className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md font-medium">Geri</button>
                  <button type="submit" disabled={setupSaving} className="px-6 py-2 bg-accent text-white rounded-md font-medium disabled:opacity-50">Kaydet & Sonraki</button>
                </div>
              </form>
            </div>
          )}

          {activeStep === 3 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">3. İşletme Profili (Web Sitesi)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Müşterilerinizin salon sayfanızı bir web sitesi gibi görmesi için bu bilgileri doldurun. Detaylı düzenlemeleri daha sonra 'Web Sitesi' sekmesinden yapabilirsiniz.</p>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kısa Açıklama (Slogan)</label>
                  <input type="text" required value={profileShortDesc} onChange={e => setProfileShortDesc(e.target.value)} placeholder="Örn: Şehrin en iyi saç tasarım merkezi" className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Adres</label>
                  <textarea rows={2} required value={profileAddress} onChange={e => setProfileAddress(e.target.value)} className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border"></textarea>
                </div>
                <div className="pt-4 flex justify-between">
                  <button type="button" onClick={() => setActiveStep(2)} className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md font-medium">Geri</button>
                  <button type="submit" disabled={setupSaving || !profileShortDesc || !profileAddress} className="px-6 py-2 bg-accent text-white rounded-md font-medium disabled:opacity-50">Kaydet & Sonraki</button>
                </div>
              </form>
            </div>
          )}

          {activeStep === 4 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Hizmetler</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Randevu alınabilmesi için en az 1 aktif hizmet belirlemelisiniz.</p>
              
              <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 mb-6">
                 <div className="flex justify-between items-center mb-2">
                   <h4 className="font-medium text-gray-900 dark:text-white">Ekli Hizmetler ({servicesList.length})</h4>
                   <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isServicesCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                     {isServicesCompleted ? 'Tamamlandı' : 'En az 1 aktif hizmet gerekli'}
                   </span>
                 </div>
                 <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                   {servicesList.slice(0, 3).map(s => <li key={s.id}>• {s.name} {s.active ? '(Aktif)' : '(Pasif)'} - {s.price} TL</li>)}
                   {servicesList.length > 3 && <li>ve {servicesList.length - 3} daha...</li>}
                   {servicesList.length === 0 && <li className="text-red-500 py-2 font-medium">Yayına çıkmak için en az 1 aktif hizmet eklemelisiniz.</li>}
                 </ul>
                 
                 {!isServicesCompleted && (
                   <form onSubmit={handleQuickAddService} className="mt-4 p-4 border border-dashed border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800">
                     <h5 className="text-sm font-bold text-gray-800 dark:text-white mb-3">Hızlı Hizmet Ekle</h5>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                       <div>
                         <input type="text" placeholder="Hizmet Adı (Örn: Saç Kesimi)" required value={newServiceName} onChange={e => setNewServiceName(e.target.value)} className="w-full text-sm rounded-md border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 p-2 border" />
                       </div>
                       <div>
                         <input type="number" placeholder="Fiyat (TL)" required value={newServicePrice} onChange={e => setNewServicePrice(e.target.value)} className="w-full text-sm rounded-md border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 p-2 border" />
                       </div>
                       <div>
                         <input type="number" placeholder="Süre (Dk)" required value={newServiceDuration} onChange={e => setNewServiceDuration(e.target.value)} className="w-full text-sm rounded-md border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 p-2 border" />
                       </div>
                       <div className="flex items-center">
                         <label className="flex items-center text-sm cursor-pointer">
                           <input type="checkbox" checked={newServiceActive} onChange={e => setNewServiceActive(e.target.checked)} className="mr-2" />
                           Aktif
                         </label>
                       </div>
                     </div>
                     <button type="submit" disabled={isAdding || !newServiceName} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-sm font-medium transition-colors disabled:opacity-50">
                       Hizmeti Kaydet
                     </button>
                   </form>
                 )}

                 {onNavigateToTab && (
                   <button 
                     onClick={() => onNavigateToTab('services')} 
                     className="mt-4 text-sm text-accent dark:text-blue-400 hover:underline inline-flex items-center w-full justify-center sm:justify-start"
                   >
                     {isServicesCompleted ? 'Tüm Hizmetleri Yönet →' : 'Gelişmiş Hizmet Ayarlarına Git →'}
                   </button>
                 )}
              </div>
              <div className="pt-4 flex justify-between">
                 <button type="button" onClick={() => setActiveStep(3)} className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md font-medium">Geri</button>
                 <button type="button" onClick={() => setActiveStep(5)} disabled={!isServicesCompleted} className="px-6 py-2 bg-accent text-white rounded-md font-medium disabled:opacity-50">Sonraki</button>
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Çalışanlar / Uzmanlar</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Müşterilerin randevu alabilmesi için en az 1 aktif çalışan tanımlamalısınız.</p>
              
              <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 mb-6">
                 <div className="flex justify-between items-center mb-2">
                   <h4 className="font-medium text-gray-900 dark:text-white">Ekli Çalışanlar ({staffList.length})</h4>
                   <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isStaffCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                     {isStaffCompleted ? 'Tamamlandı' : 'En az 1 aktif uzman gerekli'}
                   </span>
                 </div>
                 <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                   {staffList.slice(0, 3).map(s => <li key={s.id}>• {s.name} - {s.title} {s.active ? '(Aktif)' : '(Pasif)'}</li>)}
                   {staffList.length > 3 && <li>ve {staffList.length - 3} daha...</li>}
                   {staffList.length === 0 && <li className="text-red-500 py-2 font-medium">Yayına çıkmak için en az 1 aktif çalışan eklemelisiniz.</li>}
                 </ul>

                 {!isStaffCompleted && (
                   <form onSubmit={handleQuickAddStaff} className="mt-4 p-4 border border-dashed border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800">
                     <h5 className="text-sm font-bold text-gray-800 dark:text-white mb-3">Hızlı Çalışan Ekle</h5>
                     <div className="grid grid-cols-1 gap-3 mb-3">
                       <div>
                         <input type="text" placeholder="Ad Soyad (Örn: Ayşe Yılmaz)" required value={newStaffName} onChange={e => setNewStaffName(e.target.value)} className="w-full text-sm rounded-md border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 p-2 border" />
                       </div>
                       <div>
                         <input type="text" placeholder="Unvan (Örn: Kıdemli Stilist)" value={newStaffTitle} onChange={e => setNewStaffTitle(e.target.value)} className="w-full text-sm rounded-md border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 p-2 border" />
                       </div>
                       <div className="flex items-center">
                         <label className="flex items-center text-sm cursor-pointer">
                           <input type="checkbox" checked={newStaffActive} onChange={e => setNewStaffActive(e.target.checked)} className="mr-2" />
                           Aktif (Randevu alabilir)
                         </label>
                       </div>
                     </div>
                     <button type="submit" disabled={isAdding || !newStaffName} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 text-sm font-medium transition-colors disabled:opacity-50">
                       Çalışanı Kaydet
                     </button>
                   </form>
                 )}

                 {onNavigateToTab && (
                   <button 
                     onClick={() => onNavigateToTab('staff')} 
                     className="mt-4 text-sm text-accent dark:text-blue-400 hover:underline inline-flex items-center w-full justify-center sm:justify-start"
                   >
                     {isStaffCompleted ? 'Tüm Çalışanları Yönet →' : 'Gelişmiş Çalışan Ayarlarına Git →'}
                   </button>
                 )}
              </div>
              <div className="pt-4 flex justify-between">
                 <button type="button" onClick={() => setActiveStep(4)} className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md font-medium">Geri</button>
                 <button type="button" onClick={() => setActiveStep(6)} disabled={!isStaffCompleted} className="px-6 py-2 bg-accent text-white rounded-md font-medium disabled:opacity-50">Sonraki</button>
              </div>
            </div>
          )}

          {activeStep === 6 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Çalışma Saatleri</h3>
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg mb-6 flex flex-col items-start gap-4">
                <p className="text-blue-800 dark:text-blue-300">Çalışma saatleri şu anda temel varsayılan ayar olarak kaydedilir. Detaylı saat yönetimi sonraki fazda eklenecektir.</p>
                <button 
                  onClick={() => {
                     alert('Varsayılan çalışma saatleri uygulandı.');
                     setActiveStep(7);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
                >
                  Varsayılan çalışma saatlerini kullan: 09:00–18:00
                </button>
              </div>
              {onNavigateToTab && (
                 <button 
                   onClick={() => onNavigateToTab('settings')} 
                   className="mb-6 text-sm text-accent dark:text-blue-400 hover:underline flex items-center"
                 >
                   Çalışma saatlerini düzenle
                 </button>
               )}
              <div className="pt-4 flex justify-between">
                 <button type="button" onClick={() => setActiveStep(5)} className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md font-medium">Geri</button>
                 <button type="button" onClick={() => setActiveStep(7)} className="px-6 py-2 bg-accent text-white rounded-md font-medium">Sonraki</button>
              </div>
            </div>
          )}

          {activeStep === 7 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. Test Randevusu Oluşturun</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Tüm ayarlarınızı görmek ve sistemin doğru çalıştığını onaylamak için kendi profilinize bir test randevusu oluşturabilirsiniz.</p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-gray-200 dark:border-slate-700 rounded-lg p-6 mb-6">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Randevu Sayfanız:</h4>
                <div className="flex gap-4 items-center">
                  <input type="text" readOnly value={`${window.location.origin}/${(import.meta as any).env.VITE_ROUTER_MODE === 'hash' ? '#/' : ''}`} className="w-full bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 p-3 rounded border text-gray-700 dark:text-gray-300" />
                  <button onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/${(import.meta as any).env.VITE_ROUTER_MODE === 'hash' ? '#/' : ''}`);
                    alert('Link kopyalandı.');
                  }} className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium whitespace-nowrap shadow-sm">
                    Kopyala
                  </button>
                  <a href={`${window.location.origin}/${(import.meta as any).env.VITE_ROUTER_MODE === 'hash' ? '#/' : ''}`} target="_blank" rel="noreferrer" className="px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded font-medium whitespace-nowrap shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600">
                    Aç
                  </a>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-4">Tavsiye: Linki cihazınızda gizli modda (Incognito) açarak bir müşteri gibi randevu deneyimini test edebilirsiniz.</p>
              </div>

              <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 mb-6">
                 <span className="text-gray-700 dark:text-gray-300 font-medium">Test Randevusu Durumu:</span>
                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${isTestApptCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                   {isTestApptCompleted ? 'Test Başarılı' : 'Bekleniyor veya Atlandı'}
                 </span>
              </div>
              <div className="pt-4 flex justify-between">
                 <button type="button" onClick={() => setActiveStep(6)} className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md font-medium">Geri</button>
                 <button type="button" onClick={() => setActiveStep(8)} className="px-6 py-2 bg-accent text-white rounded-md font-medium">Daha Sonra Test Edeceğim / Sonraki</button>
              </div>
            </div>
          )}

          {activeStep === 8 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">8. Yayına Hazırlık Onayı</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                 <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg p-5">
                    <h4 className="font-bold text-red-800 dark:text-red-300 mb-4 border-b border-red-200 dark:border-red-700/50 pb-2">Zorunlu Adımlar</h4>
                    <ul className="space-y-3">
                       <li className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">Temel Bilgiler (İsim, WhatsApp)</span>
                          <span>{isInfoCompleted ? '✅' : '❌'}</span>
                       </li>
                       <li className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">İşletme Profili (Slogan, Adres)</span>
                          <span>{isProfileCompleted ? '✅' : '❌'}</span>
                       </li>
                       <li className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">Marka ve Tasarım (Renk)</span>
                          <span>{isBrandingCompleted ? '✅' : '❌'}</span>
                       </li>
                       <li className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">En az 1 Hizmet</span>
                          <span>{isServicesCompleted ? '✅' : '❌'}</span>
                       </li>
                       <li className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">En az 1 Uzman</span>
                          <span>{isStaffCompleted ? '✅' : '❌'}</span>
                       </li>
                    </ul>
                 </div>
                 
                 <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-5">
                    <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-4 border-b border-blue-200 dark:border-blue-700/50 pb-2">Önerilen Adımlar</h4>
                    <ul className="space-y-3">
                       <li className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">Logo ve Kapak Fotoğrafı</span>
                          <span>{setupSalonName && tenant?.branding?.logoUrl ? '✅' : '⚠️'}</span>
                       </li>
                       <li className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">Instagram Bağlantısı</span>
                          <span>{tenant?.branding?.instagramUrl ? '✅' : '⚠️'}</span>
                       </li>
                       <li className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">Test Randevusu</span>
                          <span>{isTestApptCompleted ? '✅' : '⚠️'}</span>
                       </li>
                    </ul>
                 </div>
              </div>

              {readiness && !readiness.canGoLive && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
                  <h4 className="font-bold mb-2">Engeller:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {readiness.blockingReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-6 mb-8 text-center">
                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Yayına göndermeden önce site önizlemesini kontrol etmenizi tavsiye ederiz. Randevu sisteminiz henüz dışarıdan erişilebilir değildir.</p>
                 <a 
                   href={`/#/book?preview=true`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex px-6 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-bold shadow-sm transition-all text-center items-center justify-center mb-4"
                 >
                   Site Önizlemesini Aç
                 </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-center">
                 <button 
                   onClick={() => {
                     navigator.clipboard.writeText(`${window.location.origin}/${(import.meta as any).env.VITE_ROUTER_MODE === 'hash' ? '#/' : ''}book`);
                     alert('Randevu sayfanızın adresi kopyalandı.');
                   }}
                   className="px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-bold shadow-sm transition-all"
                 >
                   Bağlantıyı Kopyala
                 </button>
                 <button 
                   disabled={!isInfoCompleted || !isServicesCompleted || !isStaffCompleted || !isProfileCompleted || !isBrandingCompleted || (tenant as any)?.provisioning_status === 'ready_for_review' || (tenant as any)?.provisioning_status === 'live'}
                   onClick={async () => {
                     if (!tenant) return;
                     try {
                        await goLiveService.markReadyForReview(tenant.id);
                        alert("Yayına Hazır olarak işaretlendi. Randapp ekibi kurulumunuzu inceledikten sonra sistemi yayına alacaktır.");
                        if (typeof refreshTenant === 'function') await refreshTenant();
                        await goLiveService.getGoLiveReadiness(tenant.id).then(setReadiness);
                     } catch(err) {
                        alert("Hata oluştu.");
                     }
                   }} 
                   className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-bold shadow-sm transition-all"
                 >
                   Yayına Hazır Olarak İşaretle
                 </button>
              </div>

              {(tenant as any)?.provisioning_status === 'ready_for_review' && (
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-center font-medium border border-blue-200">
                     Kurulumunuz inceleme için gönderildi. Lütfen Randapp ekibinin onayını bekleyin.
                  </div>
              )}
              {(tenant as any)?.provisioning_status === 'live' && (
                  <div className="bg-green-50 text-green-800 p-4 rounded-lg text-center font-medium border border-green-200">
                     İşletmeniz yayında! Randevu almaya başlayabilirsiniz.
                  </div>
              )}
              
              <div className="pt-8 flex justify-start">
                 <button type="button" onClick={() => setActiveStep(7)} className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md font-medium">Geri</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
