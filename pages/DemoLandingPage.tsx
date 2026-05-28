import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

const DemoLandingPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [salonName, setSalonName] = useState('My Salon');
  const [logoUrl, setLogoUrl] = useState('');
  const [localLogo, setLocalLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  
  const [service1Name, setService1Name] = useState('Haircut');
  const [service1Price, setService1Price] = useState('500');
  const [service2Name, setService2Name] = useState('Coloring');
  const [service2Price, setService2Price] = useState('1200');
  
  const [staff1Name, setStaff1Name] = useState('Jane Smith');
  const [staff1Title, setStaff1Title] = useState('Master');
  const [staff2Name, setStaff2Name] = useState('John Doe');
  const [staff2Title, setStaff2Title] = useState('Uzman');

  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [instagram, setInstagram] = useState('');
  const [address, setAddress] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  
  const [service3Name, setService3Name] = useState('Manicure');
  const [service3Price, setService3Price] = useState('300');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(t.marketing.demo.err_image);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(t.marketing.demo.err_size);
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
    if (!salonName.trim()) {
       alert(t.marketing.demo.err_salon_name);
       return;
    }

    const salesNumber = (import.meta as any).env.VITE_SALES_WHATSAPP_NUMBER;
    if (!salesNumber) {
       console.warn("Satış WhatsApp numarası .env içinde tanımlı değil.");
       alert("Sistem yapılandırma eksikliği: WhatsApp yönlendirmesi şu an çalışmıyor.");
       return;
    }

    const text = t.marketing.demo.wa_template
        .replace('{salon}', salonName)
        .replace('{phone}', whatsappNumber)
        .replace('{instagram}', instagram)
        .replace('{address}', address)
        .replace('{s1_name}', service1Name).replace('{s1_price}', service1Price)
        .replace('{s2_name}', service2Name).replace('{s2_price}', service2Price)
        .replace('{s3_name}', service3Name).replace('{s3_price}', service3Price)
        .replace('{st1_name}', staff1Name).replace('{st1_title}', staff1Title)
        .replace('{st2_name}', staff2Name).replace('{st2_title}', staff2Title);
    
    window.open(`https://wa.me/${salesNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert(t.marketing.demo.copied);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-10 md:py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 md:mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: t.marketing.demo.hero_title }} />
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed px-2">
            {t.marketing.demo.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4 sm:px-0">
            <button 
              onClick={() => document.getElementById('preview-generator')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-accent text-white px-8 py-3.5 md:py-4 rounded-full font-bold shadow-lg hover:bg-blue-600 transition-colors duration-300 text-base md:text-lg w-full sm:w-auto"
            >
              {t.marketing.demo.btn_preview}
            </button>
            <button 
              onClick={handleWhatsappLead}
              className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-gray-300 dark:border-slate-600 px-8 py-3.5 md:py-4 rounded-full font-bold shadow-sm hover:ring-2 hover:ring-gray-200 dark:hover:ring-slate-700 transition-all duration-300 text-base md:text-lg flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {t.marketing.demo.btn_demo_request}
            </button>
          </div>
        </div>

        <div id="preview-generator" className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start mt-8 md:mt-12">
          
          {/* Controls Panel */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t.marketing.demo.panel_title}</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.marketing.demo.salon_name}</label>
                <input 
                  type="text" 
                  value={salonName} 
                  onChange={e => setSalonName(e.target.value)}
                  className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-3 border shadow-sm focus:ring-accent focus:border-accent"
                  placeholder={t.marketing.demo.salon_name_ph}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.marketing.demo.upload_logo}</label>
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
                      {t.marketing.demo.remove_logo}
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-4">{t.marketing.demo.logo_notice}</p>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.marketing.demo.logo_url}</label>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.marketing.demo.brand_color}</label>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.marketing.demo.wa_number}</label>
                  <input 
                    type="text" 
                    value={whatsappNumber} 
                    onChange={e => setWhatsappNumber(e.target.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-3 border shadow-sm"
                    placeholder="+90 555..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.marketing.demo.instagram}</label>
                  <input 
                    type="text" 
                    value={instagram} 
                    onChange={e => setInstagram(e.target.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-3 border shadow-sm"
                    placeholder="@guzelliksalonum"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.marketing.demo.address}</label>
                <textarea 
                  value={address} 
                  onChange={e => setAddress(e.target.value)}
                  className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-3 border shadow-sm"
                  placeholder={t.marketing.demo.address}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.marketing.demo.short_desc}</label>
                <input 
                  type="text" 
                  value={shortDesc} 
                  onChange={e => setShortDesc(e.target.value)}
                  className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-3 border shadow-sm"
                  placeholder={t.marketing.demo.short_desc_ph}
                />
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t.marketing.demo.sample_services}</h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                   <input type="text" value={service1Name} onChange={e => setService1Name(e.target.value)} className="rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border shadow-sm" placeholder={t.marketing.demo.service_name_ph}/>
                   <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">₺</span>
                      <input type="number" value={service1Price} onChange={e => setService1Price(e.target.value)} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 pl-8 border shadow-sm" placeholder={t.marketing.demo.price_ph}/>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                   <input type="text" value={service2Name} onChange={e => setService2Name(e.target.value)} className="rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border shadow-sm" placeholder={t.marketing.demo.service_name_ph}/>
                   <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">₺</span>
                      <input type="number" value={service2Price} onChange={e => setService2Price(e.target.value)} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 pl-8 border shadow-sm" placeholder={t.marketing.demo.price_ph}/>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <input type="text" value={service3Name} onChange={e => setService3Name(e.target.value)} className="rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border shadow-sm" placeholder={t.marketing.demo.service_name_ph}/>
                   <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">₺</span>
                      <input type="number" value={service3Price} onChange={e => setService3Price(e.target.value)} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 pl-8 border shadow-sm" placeholder={t.marketing.demo.price_ph}/>
                   </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t.marketing.demo.sample_staff}</h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                   <input type="text" value={staff1Name} onChange={e => setStaff1Name(e.target.value)} className="rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border shadow-sm" placeholder={t.marketing.demo.staff_name_ph}/>
                   <input type="text" value={staff1Title} onChange={e => setStaff1Title(e.target.value)} className="rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border shadow-sm" placeholder={t.marketing.demo.title_ph}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <input type="text" value={staff2Name} onChange={e => setStaff2Name(e.target.value)} className="rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border shadow-sm" placeholder={t.marketing.demo.staff_name_ph}/>
                   <input type="text" value={staff2Title} onChange={e => setStaff2Title(e.target.value)} className="rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white p-2 border shadow-sm" placeholder={t.marketing.demo.title_ph}/>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="sticky top-24">
            <h2 className="text-xl font-medium text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              {t.marketing.demo.live_preview}
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
                
                {/* Profile Hero Block */}
                <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700">
                  <div className="h-24 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 relative flex items-center justify-center">
                    <span className="text-gray-400 dark:text-slate-500 font-medium text-xs">{t.marketing.demo.cover_area}</span>
                  </div>
                  <div className="p-4 text-center">
                    {(localLogo || logoUrl) ? (
                      <img src={localLogo || logoUrl} alt="Logo" className="w-16 h-16 rounded-full border-4 border-white dark:border-slate-800 shadow-sm mx-auto -mt-12 object-cover relative z-10 bg-white" />
                    ) : (
                      <div className="w-16 h-16 rounded-full border-4 border-white dark:border-slate-800 shadow-sm mx-auto -mt-12 flex items-center justify-center text-white font-bold text-xl relative z-10" style={{ backgroundColor: primaryColor }}>
                        {salonName.charAt(0)}
                      </div>
                    )}
                    <h2 className="text-lg font-bold mt-2 text-gray-900 dark:text-white">{salonName}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{shortDesc || t.marketing.demo.short_desc}</p>
                    {address && (
                      <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="truncate max-w-[200px]">{address}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.marketing.demo.select_staff}</h3>
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-accent flex items-center gap-3 relative shadow-sm">
                      <div className="absolute -top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{staff1Title || 'MASTER'}</div>
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(staff1Name)}&background=random`} alt="Staff" className="w-12 h-12 rounded-full" />
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{staff1Name || t.marketing.demo.staff_name_ph}</div>
                        <div className="text-xs text-gray-500">{t.marketing.demo.available_today}</div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 flex items-center gap-3 relative">
                      {staff2Title && <div className="absolute -top-2 right-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{staff2Title}</div>}
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(staff2Name)}&background=random`} alt="Staff" className="w-12 h-12 rounded-full opacity-80" />
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{staff2Name || t.marketing.demo.staff_name_ph}</div>
                        <div className="text-xs text-gray-500">{t.marketing.demo.available_tomorrow}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.marketing.demo.select_service}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 flex flex-col justify-between" style={{ minHeight: '100px' }}>
                      <div className="font-medium text-sm text-gray-900 dark:text-white">{service1Name || 'Hizmet 1'}</div>
                      <div className="font-bold mt-2" style={{ color: primaryColor }}>₺{service1Price || '0'}</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 flex flex-col justify-between" style={{ minHeight: '100px' }}>
                      <div className="font-medium text-sm text-gray-900 dark:text-white">{service2Name || 'Hizmet 2'}</div>
                      <div className="font-bold mt-2" style={{ color: primaryColor }}>₺{service2Price || '0'}</div>
                    </div>
                    <div className="col-span-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 flex justify-between items-center">
                      <div className="font-medium text-sm text-gray-900 dark:text-white">{service3Name || 'Hizmet 3'}</div>
                      <div className="font-bold" style={{ color: primaryColor }}>₺{service3Price || '0'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="w-full py-3 rounded-xl text-center font-bold text-white shadow-md opacity-50 cursor-not-allowed" style={{ backgroundColor: primaryColor }}>
                    {t.marketing.demo.continue}
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-2">{t.marketing.demo.preview_mode}</p>
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
                  {t.marketing.demo.btn_wa_demand}
                </button>
                <button 
                  onClick={handleCopyLink}
                  className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-gray-200 dark:border-slate-700 px-6 py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-lg text-center"
                >
                  {t.marketing.demo.btn_copy_link}
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DemoLandingPage;
