import React, { useState, useEffect } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { Staff, Service, Appointment } from '../types';
import { goLiveService, GoLiveReadiness } from '../services/goLiveService';

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

  // Business logic step completed checks
  const isInfoCompleted = !!setupSalonName && !!setupWhatsapp; // Enforced whatsapp here based on prompt
  const isBrandingCompleted = !!setupPrimaryColor;
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

  const steps = [
    { id: 1, name: 'Salon Bilgileri', completed: isInfoCompleted },
    { id: 2, name: 'Marka & Tasarım', completed: isBrandingCompleted },
    { id: 3, name: 'Hizmetler', completed: isServicesCompleted },
    { id: 4, name: 'Çalışanlar', completed: isStaffCompleted },
    { id: 5, name: 'Çalışma Saatleri', completed: true }, // Placeholder completed by default
    { id: 6, name: 'Test Randevusu', completed: isTestApptCompleted },
    { id: 7, name: 'Yayına Hazır', completed: isInfoCompleted && isServicesCompleted && isStaffCompleted }
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
                  <input type="text" required value={setupWhatsapp} onChange={e => setSetupWhatsapp(e.target.value)} placeholder="Örn: 905550000000" className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Instagram (@kullaniciadi) (Opsiyonel)</label>
                  <input type="text" value={setupInstagram} onChange={e => setSetupInstagram(e.target.value)} className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Adres (Opsiyonel)</label>
                  <textarea value={setupAddress} onChange={e => setSetupAddress(e.target.value)} rows={3} className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border"></textarea>
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
                <div>
                  <label className="block text-sm font-medium mb-1">Alt Bilgi (Footer) Metni (Opsiyonel)</label>
                  <input type="text" value={setupFooter} onChange={e => setSetupFooter(e.target.value)} className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border" />
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Hizmetler</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Randevu alınabilmesi için en az 1 aktif hizmet belirlemelisiniz.</p>
              
              <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 mb-6">
                 <div className="flex justify-between items-center mb-2">
                   <h4 className="font-medium text-gray-900 dark:text-white">Ekli Hizmetler ({servicesList.length})</h4>
                   <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isServicesCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                     {isServicesCompleted ? 'Tamamlandı' : 'En az 1 aktif hizmet gerekli'}
                   </span>
                 </div>
                 <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                   {servicesList.slice(0, 3).map(s => <li key={s.id}>• {s.name} {s.active ? '(Aktif)' : '(Pasif)'}</li>)}
                   {servicesList.length > 3 && <li>ve {servicesList.length - 3} daha...</li>}
                   {servicesList.length === 0 && <li className="text-red-500 py-2">Yayına çıkmak için en az 1 aktif hizmet eklemelisiniz.</li>}
                 </ul>
                 {onNavigateToTab && (
                   <button 
                     onClick={() => onNavigateToTab('services')} 
                     className="mt-2 text-sm text-accent dark:text-blue-400 hover:underline inline-flex items-center"
                   >
                     + Hizmetler menüsüne git ve hizmet ekle
                   </button>
                 )}
              </div>
              <div className="pt-4 flex justify-between">
                 <button type="button" onClick={() => setActiveStep(2)} className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md font-medium">Geri</button>
                 <button type="button" onClick={() => setActiveStep(4)} disabled={!isServicesCompleted} className="px-6 py-2 bg-accent text-white rounded-md font-medium disabled:opacity-50">Sonraki</button>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Çalışanlar / Uzmanlar</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Müşterilerin randevu alabilmesi için en az 1 aktif çalışan tanımlamalısınız.</p>
              
              <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 mb-6">
                 <div className="flex justify-between items-center mb-2">
                   <h4 className="font-medium text-gray-900 dark:text-white">Ekli Çalışanlar ({staffList.length})</h4>
                   <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isStaffCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                     {isStaffCompleted ? 'Tamamlandı' : 'En az 1 aktif uzman gerekli'}
                   </span>
                 </div>
                 <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                   {staffList.slice(0, 3).map(s => <li key={s.id}>• {s.name} {s.active ? '(Aktif)' : '(Pasif)'}</li>)}
                   {staffList.length > 3 && <li>ve {staffList.length - 3} daha...</li>}
                   {staffList.length === 0 && <li className="text-red-500 py-2">Yayına çıkmak için en az 1 aktif çalışan eklemelisiniz.</li>}
                 </ul>
                 {onNavigateToTab && (
                   <button 
                     onClick={() => onNavigateToTab('staff')} 
                     className="mt-2 text-sm text-accent dark:text-blue-400 hover:underline inline-flex items-center"
                   >
                     + Çalışanlar menüsüne git ve çalışan ekle
                   </button>
                 )}
              </div>
              <div className="pt-4 flex justify-between">
                 <button type="button" onClick={() => setActiveStep(3)} className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md font-medium">Geri</button>
                 <button type="button" onClick={() => setActiveStep(5)} disabled={!isStaffCompleted} className="px-6 py-2 bg-accent text-white rounded-md font-medium disabled:opacity-50">Sonraki</button>
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Çalışma Saatleri</h3>
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg mb-6">
                <p className="text-blue-800 dark:text-blue-300 mb-4">Çalışma saatleri şu anda temel varsayılan ayar olarak kaydedilir. Detaylı saat yönetimi sonraki fazda eklenecektir.</p>
                <div className="font-bold text-blue-900 dark:text-blue-100">Varsayılan Saatler: Pazartesi - Pazar | 09:00 - 18:00</div>
              </div>
              {onNavigateToTab && (
                 <button 
                   onClick={() => onNavigateToTab('settings')} 
                   className="mb-6 text-sm text-accent dark:text-blue-400 hover:underline flex items-center"
                 >
                   Ayarlar menüsünü gör
                 </button>
               )}
              <div className="pt-4 flex justify-between">
                 <button type="button" onClick={() => setActiveStep(4)} className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md font-medium">Geri</button>
                 <button type="button" onClick={() => setActiveStep(6)} className="px-6 py-2 bg-accent text-white rounded-md font-medium">Varsayılanları Kabul Et & Sonraki</button>
              </div>
            </div>
          )}

          {activeStep === 6 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Test Randevusu Oluşturun</h3>
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
                 <button type="button" onClick={() => setActiveStep(5)} className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md font-medium">Geri</button>
                 <button type="button" onClick={() => setActiveStep(7)} className="px-6 py-2 bg-accent text-white rounded-md font-medium">Daha Sonra Test Edeceğim / Sonraki</button>
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
                    <span>{isTestApptCompleted ? '✅' : '⚠️ Gerekli Değil'}</span>
                 </div>
              </div>

              {readiness && !readiness.canGoLive && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
                  <h4 className="font-bold mb-2">Eksikler:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {readiness.blockingReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
                 <button 
                   disabled={!isInfoCompleted || !isServicesCompleted || !isStaffCompleted}
                   onClick={async () => {
                     if (!tenant) return;
                     await goLiveService.markReadyForReview(tenant.id);
                     alert("Yayına Hazır olarak işaretlendi. Randapp ekibi kurulumunuzu inceledikten sonra sistemi yayına alacaktır.");
                     if (tenant) goLiveService.getGoLiveReadiness(tenant.id).then(setReadiness);
                   }} 
                   className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-bold shadow-sm transition-all"
                 >
                   Yayına Hazır Olarak İşaretle
                 </button>
              </div>

              {tenant?.provisioning_status === 'ready_for_review' && (
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-center font-medium border border-blue-200">
                     Kurulumunuz inceleme için gönderildi. Lütfen yöneticinin onayını bekleyin.
                  </div>
              )}
              
              <div className="pt-8 flex justify-start">
                 <button type="button" onClick={() => setActiveStep(6)} className="px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md font-medium">Geri</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
