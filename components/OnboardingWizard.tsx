import React, { useState, useEffect } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { Staff, Service, Appointment } from '../types';

interface OnboardingWizardProps {
  staffList: Staff[];
  servicesList: Service[];
  appointments: Appointment[];
  refreshData: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ 
  staffList, 
  servicesList, 
  appointments, 
  refreshData 
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
  
  const [activeStep, setActiveStep] = useState(1);

  // Business logic step completed checks
  const isInfoCompleted = !!setupSalonName && !!setupAddress;
  const isBrandingCompleted = !!setupLogoUrl || setupPrimaryColor !== '#000000';
  const isServicesCompleted = servicesList.some(s => s.isActive);
  const isStaffCompleted = staffList.some(s => s.isActive);
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
    }
  }, [tenant]);

  const handleSaveSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;
    setSetupSaving(true);
    try {
      const { tenantService } = await import('../services/tenantService');
      await tenantService.updateTenantBranding(tenant.id, {
        businessName: setupSalonName,
        logoUrl: setupLogoUrl,
        primaryColor: setupPrimaryColor,
        whatsappNumber: setupWhatsapp,
        instagramUrl: setupInstagram,
        address: setupAddress,
        footerText: setupFooter
      });
      await refreshTenant();
      // Optionally advance step
      alert('Kurulum bilgileri kaydedildi!');
    } catch (error) {
      console.error(error);
      alert('Kayıt sırasında hata oluştu.');
    } finally {
      setSetupSaving(false);
    }
  };

  const steps = [
    { id: 1, name: 'Salon Bilgileri', completed: isInfoCompleted },
    { id: 2, name: 'Marka & Tasarım', completed: isBrandingCompleted },
    { id: 3, name: 'Hizmetler', completed: isServicesCompleted },
    { id: 4, name: 'Çalışanlar', completed: isStaffCompleted },
    { id: 5, name: 'Çalışma Saatleri', completed: false }, // Placeholder for standard basic hours
    { id: 6, name: 'Test Randevusu', completed: isTestApptCompleted },
    { id: 7, name: 'Yayına Hazır', completed: isInfoCompleted && isServicesCompleted && isStaffCompleted }
  ];

  const handleGoLive = () => {
    if (!tenant) return;
    alert("Super-admin veya sistem onayı isteği gönderildi. (Gerçekte onboarding DB status güncellenecek)");
  };

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
              <form onSubmit={handleSaveSetup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Salon Adı</label>
                  <input type="text" required value={setupSalonName} onChange={e => setSetupSalonName(e.target.value)} className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">WhatsApp Numarası</label>
                  <input type="text" value={setupWhatsapp} onChange={e => setSetupWhatsapp(e.target.value)} placeholder="Örn: 905550000000" className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Instagram (@kullaniciadi)</label>
                  <input type="text" value={setupInstagram} onChange={e => setSetupInstagram(e.target.value)} className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Adres</label>
                  <textarea value={setupAddress} onChange={e => setSetupAddress(e.target.value)} rows={3} className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border"></textarea>
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={setupSaving} className="px-6 py-2 bg-accent text-white rounded-md font-medium">Kaydet & Sonraki</button>
                </div>
              </form>
            </div>
          )}

          {activeStep === 2 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">2. Marka ve Tasarım</h3>
              <form onSubmit={handleSaveSetup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Logo URL</label>
                  <input type="text" value={setupLogoUrl} onChange={e => setSetupLogoUrl(e.target.value)} placeholder="https://..." className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ana Renk (Primary Color)</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={setupPrimaryColor} onChange={e => setSetupPrimaryColor(e.target.value)} className="h-10 w-16 p-1 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700" />
                    <span className="font-mono text-gray-500">{setupPrimaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alt Bilgi (Footer) Metni</label>
                  <input type="text" value={setupFooter} onChange={e => setSetupFooter(e.target.value)} className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border" />
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={setupSaving} className="px-6 py-2 bg-accent text-white rounded-md font-medium">Kaydet & Sonraki</button>
                </div>
              </form>
            </div>
          )}

          {activeStep === 3 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Hizmetler</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Randevu alınabilmesi için en az 1 aktif hizmet belirlemelisiniz. Yönetim paneli üst menüdeki "Hizmetler" sekmesini kullanarak yeni hizmetlerinizi ekleyin ve aktif hale getirin.</p>
              
              <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 mb-6">
                 <div className="flex justify-between items-center mb-2">
                   <h4 className="font-medium text-gray-900 dark:text-white">Ekli Hizmetler ({servicesList.length})</h4>
                   <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isServicesCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                     {isServicesCompleted ? 'Tamamlandı' : 'En az 1 aktif hizmet gerekli'}
                   </span>
                 </div>
                 <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                   {servicesList.slice(0, 3).map(s => <li key={s.id}>• {s.name} {s.isActive ? '(Aktif)' : '(Pasif)'}</li>)}
                   {servicesList.length > 3 && <li>ve {servicesList.length - 3} daha...</li>}
                   {servicesList.length === 0 && <li>Henüz hizmet eklenmemiş.</li>}
                 </ul>
              </div>
              
              {/* Not doing full inline editing here to save complexity, direct user to the actual tab for full management */}
            </div>
          )}

          {activeStep === 4 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Çalışanlar / Uzmanlar</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Müşterilerin randevu alabilmesi için en az 1 aktif çalışan/uzman tanımlamalısınız. Üst menüdeki "Çalışanlar" sekmesinden ekleme yapabilirsiniz.</p>
              
              <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 mb-6">
                 <div className="flex justify-between items-center mb-2">
                   <h4 className="font-medium text-gray-900 dark:text-white">Ekli Çalışanlar ({staffList.length})</h4>
                   <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isStaffCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                     {isStaffCompleted ? 'Tamamlandı' : 'En az 1 aktif uzman gerekli'}
                   </span>
                 </div>
                 <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                   {staffList.slice(0, 3).map(s => <li key={s.id}>• {s.name} {s.isActive ? '(Aktif)' : '(Pasif)'}</li>)}
                   {staffList.length > 3 && <li>ve {staffList.length - 3} daha...</li>}
                   {staffList.length === 0 && <li>Henüz çalışan eklenmemiş.</li>}
                 </ul>
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Çalışma Saatleri (Yakında)</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Personel özelinde mesai saatleri ve günler "Çalışanlar" sekmesinden ayarlanabilmektedir. Genel salon çalışma saatleri ayarları bu alana eklenecektir.</p>
            </div>
          )}

          {activeStep === 6 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Test Randevusu Oluşturun</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Tüm ayarlarınızı görmek ve sistemin doğru çalıştığını onaylamak için kendi profilinize bir test randevusu oluşturun.</p>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Randevu Sayfanız:</h4>
                <div className="flex gap-4">
                  <input type="text" readOnly value={`${window.location.origin}/${(import.meta as any).env.VITE_ROUTER_MODE === 'hash' ? '#/' : ''}`} className="w-full bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 p-3 rounded border text-gray-700 dark:text-gray-300" />
                  <button onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/${(import.meta as any).env.VITE_ROUTER_MODE === 'hash' ? '#/' : ''}`);
                    alert('Link kopyalandı.');
                  }} className="px-4 py-3 bg-blue-600 text-white rounded font-medium whitespace-nowrap">
                    Kopyala
                  </button>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-4">Tavsiye: Linki cihazınızda gizli modda (Incognito) açarak bir müşteri gibi randevu deneyimini test edebilirsiniz.</p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Test Randevusu Durumu:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${isTestApptCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isTestApptCompleted ? 'Test Başarılı' : 'Bekleniyor'}
                </span>
              </div>
            </div>
          )}

          {activeStep === 7 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">7. Yayına Hazırlık Onayı</h3>
              
              <div className="space-y-4 mb-8">
                 <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                    <span>Temel Bilgiler</span>
                    <span>{isInfoCompleted ? '✅' : '❌'}</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                    <span>Hizmetler</span>
                    <span>{isServicesCompleted ? '✅' : '❌'}</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                    <span>Uzmanlar</span>
                    <span>{isStaffCompleted ? '✅' : '❌'}</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                    <span>Test Randevusu</span>
                    <span>{isTestApptCompleted ? '✅' : '⚠️'}</span>
                 </div>
              </div>

              {isInfoCompleted && isServicesCompleted && isStaffCompleted ? (
                 <div className="text-center">
                   <p className="text-green-600 dark:text-green-400 font-medium mb-4">Harika! Salonunuz müşteri kabul etmeye hazır görünüyor.</p>
                   <button onClick={handleGoLive} className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg transition-all">
                     Yayına Hazır Olarak İşaretle
                   </button>
                 </div>
              ) : (
                 <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-lg">
                   Eksik adımları tamamlamadan sistemi yayına alamazsınız. Lütfen ❌ olan adımları gözden geçirin.
                 </div>
              )}

              {/* TODO: super_admin view to approve the live status once setup is marked complete */}
              <div className="hidden">
                 {/* Super admin only tools */}
                 {/* <SuperAdminOverride status={tenant.go_live_status} /> */}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
