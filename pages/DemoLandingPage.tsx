import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DemoLandingPage: React.FC = () => {
  const [salonName, setSalonName] = useState('My Salon');
  const [logoUrl, setLogoUrl] = useState('');
  const [localLogo, setLocalLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  
  const [service1Name, setService1Name] = useState('Haircut');
  const [service1Price, setService1Price] = useState('500');
  const [service2Name, setService2Name] = useState('Coloring');
  const [service2Price, setService2Price] = useState('1200');
  
  const [staff1Name, setStaff1Name] = useState('Jane Smith');
  const [staff2Name, setStaff2Name] = useState('John Doe');

  const [whatsappNumber, setWhatsappNumber] = useState('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir resim dosyası seçin.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'dan küçük olmalıdır.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setLocalLogo(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearLocalLogo = () => {
    setLocalLogo(null);
  };

  const handleWhatsappLead = () => {
    const text = `Merhaba, ${salonName} için Randapp akıllı randevu sistemini denemek istiyorum.`;
    const targetPhone = "905550000000"; // Sales phone number
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Kuaför ve güzellik salonunuz için <span className="text-accent dark:text-blue-400">akıllı randevu sistemi</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            WhatsApp, Google Takvim, personel müsaitliği, hizmet/fiyat seçimi ve yapay zeka destekli öneriler tek sistemde. Kendi salonunuzun uygulamasını şimdi saniyeler içinde önizleyin.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => document.getElementById('preview-generator')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-accent text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-600 transition-colors duration-300 text-lg"
            >
              Kendi Salonumu Önizle
            </button>
            <button 
              onClick={handleWhatsappLead}
              className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-gray-300 dark:border-slate-600 px-8 py-3 rounded-full font-bold shadow-sm hover:focus-ring transition-colors duration-300 text-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              10 Dakikalık Demo Talep Et
            </button>
          </div>
        </div>

        <div id="preview-generator" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-8">
          
          {/* Controls Panel */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Salonunuzu Özelleştirin</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salon Adı</label>
                <input 
                  type="text" 
                  value={salonName} 
                  onChange={e => setSalonName(e.target.value)}
                  className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-3 border shadow-sm focus:ring-accent focus:border-accent"
                  placeholder="Güzellik Salonum"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logoyu bilgisayardan yükle</label>
                <div className="flex items-center gap-4 mb-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-accent/10 file:text-accent
                      hover:file:bg-accent/20 cursor-pointer"
                  />
                  {localLogo && (
                    <button 
                      onClick={handleClearLocalLogo} 
                      className="text-red-500 dark:text-red-400 text-sm font-medium hover:underline whitespace-nowrap"
                    >
                      Logoyu kaldır
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-4">Bu logo yalnızca önizleme içindir; henüz sisteme kaydedilmez.</p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">...veya Logo URL Kullan (İsteğe Bağlı)</label>
                <input 
                  type="text" 
                  value={logoUrl} 
                  onChange={e => setLogoUrl(e.target.value)}
                  disabled={!!localLogo}
                  className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-3 border shadow-sm focus:ring-accent focus:border-accent disabled:opacity-50"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marka Rengi</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={primaryColor} 
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="h-10 w-16 p-1 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 cursor-pointer"
                    />
                    <span className="text-sm text-gray-500 font-mono">{primaryColor}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">WhatsApp Numarası</label>
                  <input 
                    type="text" 
                    value={whatsappNumber} 
                    onChange={e => setWhatsappNumber(e.target.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-3 border shadow-sm"
                    placeholder="+90 555..."
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Örnek Hizmetler</h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                   <input type="text" value={service1Name} onChange={e => setService1Name(e.target.value)} className="rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border shadow-sm" placeholder="Hizmet Adı"/>
                   <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">₺</span>
                      <input type="number" value={service1Price} onChange={e => setService1Price(e.target.value)} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 pl-8 border shadow-sm" placeholder="Fiyat"/>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <input type="text" value={service2Name} onChange={e => setService2Name(e.target.value)} className="rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border shadow-sm" placeholder="Hizmet Adı"/>
                   <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">₺</span>
                      <input type="number" value={service2Price} onChange={e => setService2Price(e.target.value)} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 pl-8 border shadow-sm" placeholder="Fiyat"/>
                   </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Örnek Uzmanlar</h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                   <input type="text" value={staff1Name} onChange={e => setStaff1Name(e.target.value)} className="rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border shadow-sm" placeholder="Uzman Adı"/>
                   <input type="text" value="Master" disabled className="rounded-lg border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 text-gray-500 p-2 border shadow-sm" placeholder="Unvan"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <input type="text" value={staff2Name} onChange={e => setStaff2Name(e.target.value)} className="rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border shadow-sm" placeholder="Uzman Adı"/>
                   <input type="text" value="Uzman" disabled className="rounded-lg border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 text-gray-500 p-2 border shadow-sm" placeholder="Unvan"/>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="sticky top-24">
            <h2 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              Canlı Önizleme
            </h2>
            
            <div className="bg-white dark:bg-slate-800 border-4 border-gray-200 dark:border-slate-700 rounded-[2rem] overflow-hidden shadow-2xl relative" style={{ aspectRatio: '9/16', maxHeight: '800px', margin: '0 auto', maxWidth: '400px' }}>
              
              {/* Fake Mobile Header */}
              <div className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-4 py-3 flex items-center justify-between z-10 relative">
                <div className="flex items-center gap-2">
                  {(localLogo || logoUrl) ? (
                    <img src={localLogo || logoUrl} alt="Logo" className="h-8 w-8 rounded-md object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold" style={{ backgroundColor: primaryColor }}>
                      {salonName.charAt(0)}
                    </div>
                  )}
                  <span className="font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{salonName}</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-700"></div>
              </div>

              {/* Fake App Content */}
              <div className="p-4 bg-gray-50 dark:bg-slate-900 h-full overflow-y-auto pb-32">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Bir Uzman Seçin</h3>
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-accent flex items-center gap-3 relative shadow-sm">
                      <div className="absolute -top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">MASTER</div>
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(staff1Name)}&background=random`} alt="Staff" className="w-12 h-12 rounded-full" />
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{staff1Name || 'Uzman Adı'}</div>
                        <div className="text-xs text-gray-500">Müsait: Bugün</div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(staff2Name)}&background=random`} alt="Staff" className="w-12 h-12 rounded-full opacity-80" />
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{staff2Name || 'Uzman Adı'}</div>
                        <div className="text-xs text-gray-500">Müsait: Yarın</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Bir Hizmet Seçin</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 flex flex-col justify-between" style={{ minHeight: '100px' }}>
                      <div className="font-medium text-sm text-gray-900 dark:text-white">{service1Name || 'Hizmet 1'}</div>
                      <div className="font-bold mt-2" style={{ color: primaryColor }}>₺{service1Price || '0'}</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 flex flex-col justify-between" style={{ minHeight: '100px' }}>
                      <div className="font-medium text-sm text-gray-900 dark:text-white">{service2Name || 'Hizmet 2'}</div>
                      <div className="font-bold mt-2" style={{ color: primaryColor }}>₺{service2Price || '0'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="w-full py-3 rounded-xl text-center font-bold text-white shadow-md opacity-50 cursor-not-allowed" style={{ backgroundColor: primaryColor }}>
                    Devam Et
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-2">Önizleme modundadır.</p>
                </div>
              </div>

            </div>

             {/* Lead Capture CTAs */}
             <div className="mt-8 flex flex-col gap-3">
                <button 
                  onClick={handleWhatsappLead}
                  className="w-full text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity text-lg text-center"
                  style={{ backgroundColor: primaryColor }}
                >
                  Bu Sistemi Salonum İçin İstiyorum
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DemoLandingPage;
