import React, { useState, useEffect, useCallback } from 'react';
import { SalonBusinessProfile, Staff, Service } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { customerService } from '../services/customerService';

interface SalonWebsiteViewProps {
  tenant: any;
  businessProfile: SalonBusinessProfile | null;
  staffList: Staff[];
  servicesList: Service[];
  onStartBooking: () => void;
  onServiceSelect: (service: Service) => void;
  onStaffSelect?: (staff: Staff | null, isAny?: boolean) => void;
  language: string;
}

const SalonWebsiteView: React.FC<SalonWebsiteViewProps> = ({
  tenant, businessProfile, staffList, servicesList, onStartBooking, onServiceSelect, onStaffSelect, language
}) => {
  const [currentCoverIndex, setCurrentCoverIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [savedCustomer, setSavedCustomer] = useState<any>(null);

  useEffect(() => {
    if (tenant?.id) {
       setSavedCustomer(customerService.getSavedCustomerProfile(tenant.id));
    }
  }, [tenant?.id]);

  const rawCoverImages = businessProfile?.cover_images?.length 
    ? businessProfile.cover_images 
    : businessProfile?.cover_image_url 
      ? [businessProfile.cover_image_url] 
      : [];
  
  const coverImages = [...new Set([...rawCoverImages, ...(businessProfile?.gallery_images || [])])].filter(Boolean);

  const handleNextCover = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (coverImages.length > 0) {
      setCurrentCoverIndex((prev) => (prev + 1) % coverImages.length);
    }
  }, [coverImages.length]);

  const handlePrevCover = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (coverImages.length > 0) {
       setCurrentCoverIndex((prev) => (prev === 0 ? coverImages.length - 1 : prev - 1));
    }
  }, [coverImages.length]);

  useEffect(() => {
    if (coverImages.length <= 1 || isPaused || lightboxImage) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const interval = setInterval(() => handleNextCover(), 5000);
    return () => clearInterval(interval);
  }, [coverImages.length, isPaused, lightboxImage, handleNextCover]);

  const directionsUrl = businessProfile?.address 
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${businessProfile.address} ${businessProfile.district || ''} ${businessProfile.city || ''}`)}` 
    : undefined;

  const displayName = businessProfile?.public_display_name || tenant?.name || 'Randapp Studio';
  const categoryStr = language === 'tr' ? 'Kuaför & Güzellik' : 'Hair & Beauty';
  const heroSlogan = businessProfile?.short_description || (language === 'tr' ? 'Şehrin en iyi saç tasarım stüdyosu.' : 'The best hair design studio in town.');

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen pb-24 md:pb-0 font-sans text-gray-900 dark:text-white">
      
      {/* 1. Header Desktop & Mobile */}
      <header className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-40 border-b border-gray-200 dark:border-slate-800 px-4 xl:px-8 py-3 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-3">
            {businessProfile?.logo_url ? (
               <img src={businessProfile.logo_url} alt="Logo" className="w-10 h-10 rounded-lg object-cover shadow-sm bg-white border border-gray-100 dark:border-slate-700" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            ) : (
               <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm bg-accent">
                 {displayName.charAt(0)}
               </div>
            )}
            <span className="font-bold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-xs">{displayName}</span>
         </div>

         {/* Desktop Nav */}
         <div className="hidden md:flex items-center gap-6 font-medium text-sm text-gray-600 dark:text-gray-300">
             <a href="#services" className="hover:text-accent transition-colors">{language === 'tr' ? 'Hizmetler' : 'Services'}</a>
             <a href="#staff" className="hover:text-accent transition-colors">{language === 'tr' ? 'Uzmanlar' : 'Staff'}</a>
             <a href="#gallery" className="hover:text-accent transition-colors">{language === 'tr' ? 'Galeri' : 'Gallery'}</a>
             <a href="#contact" className="hover:text-accent transition-colors">{language === 'tr' ? 'Konum' : 'Location'}</a>
             <button onClick={() => window.location.href = `#/ai-visualizer?tenantId=${tenant?.id}`} className="text-violet-600 dark:text-violet-400 hover:text-violet-800 transition-colors flex items-center gap-1 font-bold">
                <span className="text-lg">🪄</span> {language === 'tr' ? 'AI Stil Asistanı' : 'AI Style'}
             </button>
         </div>

         {/* Header CTAs */}
         <div className="flex items-center gap-3">
            {savedCustomer && (
              <div 
                 className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 rounded-lg text-sm cursor-pointer hover:bg-blue-100 transition border border-transparent"
                 title={language === 'tr' ? 'Bilgileriniz bu cihazda kayıtlı' : 'Your details are saved on this device'}
                 onClick={onStartBooking}
               >
                 <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs">
                    {savedCustomer.fullName?.charAt(0) || 'A'}
                 </div>
                 <span className="font-medium max-w-[100px] truncate">{savedCustomer.fullName?.split(' ')[0]}</span>
              </div>
            )}
            <button onClick={onStartBooking} className="px-5 py-2.5 bg-accent text-white rounded-xl font-bold border border-transparent hover:bg-blue-600 hover:shadow-md transition-all truncate">
               {language === 'tr' ? 'Randevu Al' : 'Book Now'}
            </button>
         </div>
      </header>

      {/* 2. Hero Section (Gallery) */}
      <section 
         id="hero" 
         className="relative w-full h-[65vh] min-h-[500px] flex items-center justify-center bg-gray-900 overflow-hidden cursor-pointer"
         onMouseEnter={() => setIsPaused(true)}
         onMouseLeave={() => setIsPaused(false)}
         onClick={() => coverImages.length > 0 && setLightboxImage(coverImages[currentCoverIndex])}
      >
         {/* Background Slides */}
         {coverImages.length > 0 ? (
           coverImages.map((img, idx) => (
             <img 
                key={idx}
                src={img} 
                alt={`Slide ${idx}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${currentCoverIndex === idx ? 'opacity-50' : 'opacity-0'}`} 
                onError={(e) => { e.currentTarget.style.display = 'none'; }} 
             />
           ))
         ) : (
           <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-80" />
         )}
         
         {/* Carousel Controls */}
         {coverImages.length > 1 && (
            <>
               <button onClick={handlePrevCover} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md transition-all sm:left-8 border border-white/10" aria-label="Previous image">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
               </button>
               <button onClick={handleNextCover} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md transition-all sm:right-8 border border-white/10" aria-label="Next image">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
               </button>
               
               {/* Indicators */}
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {coverImages.map((_, idx) => (
                     <button 
                       key={idx}
                       onClick={() => setCurrentCoverIndex(idx)}
                       className={`w-2 h-2 rounded-full transition-all ${currentCoverIndex === idx ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                       aria-label={`Go to slide ${idx + 1}`}
                     />
                  ))}
               </div>
            </>
         )}

         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/10 pointer-events-none" />

         <div className="relative z-10 container mx-auto px-6 text-center pt-10" onClick={(e) => e.stopPropagation()}>
            <div className="cursor-default">
            {businessProfile?.logo_url ? (
              <img src={businessProfile.logo_url} alt="Profile" className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full border-4 border-white/20 shadow-2xl mx-auto mb-6 object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white/20 shadow-2xl mx-auto mb-6 flex items-center justify-center text-white font-bold text-4xl bg-accent bg-opacity-90">
                {displayName.charAt(0)}
              </div>
            )}
            
            <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/90 font-medium text-sm tracking-wider mb-4 border border-white/20">
               {categoryStr}
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight shadow-sm leading-tight max-w-4xl mx-auto">
               {displayName}
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed mb-8 text-shadow-sm">
               {heroSlogan}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-10 text-sm font-semibold text-gray-300">
               <span className="flex items-center gap-1.5"><svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> {language === 'tr' ? 'Online Randevu' : 'Online Booking'}</span>
               <span className="flex items-center gap-1.5"><svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> {language === 'tr' ? 'Uzman Seçimi' : 'Staff Choice'}</span>
               <span className="flex items-center gap-1.5 text-violet-300"><span className="text-lg">🪄</span> {language === 'tr' ? 'AI Stil Asistanı' : 'AI Assistant'}</span>
            </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto pointer-events-auto">
               <button onClick={onStartBooking} className="w-full sm:w-auto px-8 py-4 bg-accent text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/50 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-2xl transition-all border border-blue-400/30">
                  {language === 'tr' ? 'Randevu Al' : 'Book Your Appointment'}
               </button>
               <button onClick={() => window.location.href = `#/ai-visualizer?tenantId=${tenant?.id}`} className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-2xl font-bold text-lg shadow-lg hover:-translate-y-1 transition-all border border-white/20 flex items-center justify-center gap-2">
                  <span>🪄</span> {language === 'tr' ? 'AI Stil Asistanı ile Fikir Al' : 'AI Style Advice'}
               </button>
            </div>
         </div>
      </section>

      {/* 2.5 Quick Action Strip */}
      <div className="w-full max-w-5xl mx-auto px-4 -mt-6 relative z-30 mb-8 hidden md:block">
         <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700/50 p-2 flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar">
            <button onClick={onStartBooking} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors font-bold text-gray-900 dark:text-white">
               <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               {language === 'tr' ? 'Randevu Al' : 'Book Now'}
            </button>
            <div className="w-px h-8 bg-gray-200 dark:bg-slate-700 shrink-0" />
            <button onClick={() => window.location.href = `#/ai-visualizer?tenantId=${tenant?.id}`} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors font-bold text-violet-600 dark:text-violet-400">
               <span className="text-xl leading-none">🪄</span>
               {language === 'tr' ? 'AI Stil Fikri' : 'AI Style Idea'}
            </button>
            <div className="w-px h-8 bg-gray-200 dark:bg-slate-700 shrink-0" />
            {businessProfile?.whatsapp_number && (
               <>
                  <a href={`https://wa.me/${businessProfile.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 px-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors font-bold text-gray-900 dark:text-white">
                     <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                     WhatsApp
                  </a>
                  <div className="w-px h-8 bg-gray-200 dark:bg-slate-700 shrink-0" />
               </>
            )}
            <a href="#contact" className="flex-1 flex items-center justify-center gap-2 py-3 px-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors font-bold text-gray-900 dark:text-white">
               <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               {language === 'tr' ? 'Konum' : 'Location'}
            </a>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 xl:px-8 space-y-24 py-16 pb-32 md:pb-16">
          
          {/* 3. Services Section */}
          {servicesList.length > 0 && (
            <section id="services" className="scroll-mt-24">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{language === 'tr' ? 'Hizmetlerimiz' : 'Our Services'}</h2>
                 <span className="bg-blue-50 dark:bg-slate-800 text-accent px-3 py-1 text-sm font-bold rounded-full">{servicesList.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicesList.map((service) => (
                    <div key={service.id} className="group flex flex-col bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:border-accent/40 transition-all overflow-hidden h-full">
                        <div className="h-48 bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                            {service.image ? (
                                <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                                    <svg className="w-12 h-12 text-blue-200 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold shadow-sm whitespace-nowrap dark:shadow-black text-gray-900 dark:text-white">
                               {service.price} ₺
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {service.duration} {language === 'tr' ? 'dk' : 'mins'}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-accent transition-colors">{language === 'tr' ? service.name_tr : service.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                               {service.description || (language === 'tr' ? 'Profesyonel hizmet randevunuzu hemen oluşturun.' : 'Book this professional service today.')}
                            </p>
                            
                            <button 
                                onClick={() => onServiceSelect(service)}
                                className="mt-auto w-full py-3 px-4 rounded-xl font-bold bg-blue-50 dark:bg-slate-700/50 hover:bg-accent text-accent hover:text-white dark:text-accent dark:hover:bg-accent dark:hover:text-white transition-colors border border-transparent text-center"
                            >
                                {language === 'tr' ? 'Bu Hizmete Randevu Al' : 'Book This Service'}
                            </button>
                        </div>
                    </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. AI Style Assistant Banner */}
          <section id="ai-assistant" className="scroll-mt-24">
             <div className="w-full relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-violet-900 via-indigo-900 to-fuchsia-900 shadow-2xl border border-violet-700/30 p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-white">
                <div className="flex-1 text-center md:text-left z-10 w-full">
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-violet-200 font-semibold text-sm mb-6 border border-white/10">
                      <span>🪄</span> Randapp AI
                   </div>
                   <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
                      {language === 'tr' ? 'Ne yaptıracağınıza karar veremediniz mi?' : 'Not sure what to book?'}
                   </h2>
                   <p className="text-lg md:text-xl text-violet-200 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed font-medium">
                      {language === 'tr' 
                         ? 'Saç, sakal veya tırnak fotoğrafınızla stil önerisi alın; size uygun hizmeti seçip randevuya devam edin.' 
                         : 'Upload your photo and let the AI Style Assistant recommend the best service for you.'}
                   </p>
                   
                   <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                      <button 
                        onClick={() => window.location.href = `#/ai-visualizer?tenantId=${tenant?.id}`}
                        className="w-full sm:w-auto text-center px-8 py-4 bg-white text-violet-900 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg"
                      >
                        {language === 'tr' ? 'AI Stil Asistanı ile Fikir Al' : 'Get AI Style Advice'}
                      </button>
                      <button 
                        onClick={onStartBooking}
                        className="w-full sm:w-auto text-center px-8 py-4 bg-violet-800/50 hover:bg-violet-700 text-white border border-violet-400/30 font-bold rounded-2xl transition-colors text-lg"
                      >
                        {language === 'tr' ? 'Öneriye Göre Randevu Al' : 'Book Based on Advice'}
                      </button>
                   </div>
                   
                   <p className="text-xs text-violet-300/60 mt-6 max-w-xl mx-auto md:mx-0">
                      {language === 'tr' 
                         ? 'Fotoğrafınız yalnızca stil önerisi amacıyla kullanılır. Kimlik tanıma veya sağlık teşhisi yapılmaz.' 
                         : 'Photos are processed for styling recommendations only. No biometric data is stored.'}
                   </p>
                </div>
                
                <div className="hidden md:flex w-full md:w-1/3 justify-center z-10 shrink-0">
                   <div className="relative w-64 h-64 md:w-80 md:h-80">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                      <div className="w-full h-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl rotate-3 flex items-center justify-center p-6">
                         <div className="w-full h-full border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-white/50 space-y-4">
                            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            <span className="font-semibold text-center">{language === 'tr' ? 'Fotoğrafınızı Yükleyin' : 'Upload Photo'}</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* 5. Staff Section */}
          {staffList.length > 0 && (
            <section id="staff" className="scroll-mt-24">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{language === 'tr' ? 'Uzmanlarımız' : 'Our Team'}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 
                 {/* No Preference Card */}
                 <div className="group flex flex-col bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-700/80 rounded-3xl border border-indigo-100 dark:border-slate-600 hover:shadow-xl hover:border-indigo-300 transition-all p-6 text-center h-full">
                    <div className="w-24 h-24 mx-auto rounded-full bg-indigo-100 dark:bg-slate-600 flex items-center justify-center text-indigo-500 dark:text-indigo-300 mb-4 shadow-inner">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 leading-tight">{language === 'tr' ? 'Bana Fark Etmez' : 'No Preference'}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex-1">
                       {language === 'tr' ? 'En erken uygun uzman ve saati sizin için önerir.' : 'We will find the earliest available staff and slot for you.'}
                    </p>
                    <button 
                       onClick={() => onStaffSelect && onStaffSelect(null, true)}
                       className="w-full py-3 rounded-xl font-bold bg-white text-indigo-600 border border-indigo-200 shadow-sm hover:bg-indigo-600 hover:text-white hover:border-transparent dark:bg-slate-900 dark:text-indigo-400 dark:border-slate-700 dark:hover:bg-indigo-600 dark:hover:text-white transition-all text-sm"
                    >
                       {language === 'tr' ? 'En Erken Randevuyu Bul' : 'Find Earliest Slot'}
                    </button>
                 </div>

                 {/* Staff Cards */}
                 {staffList.map((staff) => (
                    <div key={staff.id} className="group flex flex-col bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-200 dark:border-slate-700 text-center hover:shadow-xl hover:border-accent/40 transition-all h-full relative">
                        {staff.id === 'stf_1' && <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-[1.5rem] shadow-sm tracking-widest uppercase">MASTER</div>}
                        
                        <div className="relative mx-auto mb-4">
                           {staff.image ? (
                              <img src={staff.image} alt={staff.name} className="w-24 h-24 rounded-full object-cover shadow-sm border-[3px] border-gray-50 dark:border-slate-700 transition-transform group-hover:scale-105" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                           ) : (
                              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 font-bold text-4xl shadow-sm border-[3px] border-white dark:border-slate-800 transition-transform group-hover:scale-105">
                                 {staff.name.charAt(0)}
                              </div>
                           )}
                           <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" title="Müsait"></div>
                        </div>
                        
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white leading-tight mb-1">{staff.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4 flex-1">{staff.title}</p>
                        
                        <button 
                           onClick={() => onStaffSelect ? onStaffSelect(staff) : onStartBooking()}
                           className="w-full py-3 px-2 rounded-xl font-bold bg-slate-50 hover:bg-accent text-slate-700 hover:text-white border border-slate-200 hover:border-transparent dark:bg-slate-700/50 dark:border-slate-600 dark:text-gray-200 dark:hover:bg-accent transition-all text-sm whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                           {language === 'tr' ? 'Bu Uzmanla Randevu Al' : 'Book with Staff'}
                        </button>
                    </div>
                 ))}
              </div>
            </section>
          )}

          {/* 6. Gallery Thumbnails Strip */}
          {coverImages.length > 1 && (
            <section id="gallery" className="scroll-mt-24">
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{language === 'tr' ? 'Salonumuzdan Kareler' : 'Salon Atmosphere'}</h2>
                 <button onClick={() => setLightboxImage(coverImages[0])} className="text-sm font-bold text-accent hover:text-blue-600 transition-colors flex items-center gap-1">
                    {language === 'tr' ? 'Galeriye Bak' : 'View Gallery'} <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                 </button>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {coverImages.slice(0, 4).map((img, i) => (
                    <div key={i} onClick={() => setLightboxImage(img)} className="aspect-video md:aspect-square rounded-3xl overflow-hidden cursor-pointer group bg-slate-100 dark:bg-slate-800">
                       <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                  ))}
               </div>
            </section>
          )}

          {/* 7. Location & Contact Footer-style */}
          <section id="contact" className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 border border-gray-200 dark:border-slate-700 shadow-sm scroll-mt-24">
             <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                   <div>
                       <h2 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white">{language === 'tr' ? 'İletişim & Konum' : 'Contact & Location'}</h2>
                       {businessProfile?.about_text && (
                          <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-md">{businessProfile.about_text}</p>
                       )}
                   </div>
                   
                   <div className="space-y-6">
                      {businessProfile?.address && (
                         <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 rounded-full flex items-center justify-center shrink-0 text-accent">
                               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div>
                               <p className="text-sm text-gray-500 font-medium mb-1">{language === 'tr' ? 'Adres' : 'Address'}</p>
                               <p className="font-bold text-lg leading-snug text-gray-900 dark:text-white">{businessProfile.address} {businessProfile.district} {businessProfile.city}</p>
                               {directionsUrl && (
                                  <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="text-accent text-sm font-bold hover:underline inline-flex items-center gap-1 mt-2">
                                     {language === 'tr' ? 'Haritada Aç' : 'Open in Maps'}
                                  </a>
                               )}
                            </div>
                         </div>
                      )}
                      
                      {businessProfile?.phone && (
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 rounded-full flex items-center justify-center shrink-0 text-accent">
                               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            <div>
                               <p className="text-sm text-gray-500 font-medium mb-1">{language === 'tr' ? 'Telefon' : 'Phone'}</p>
                               <p className="font-bold text-lg text-gray-900 dark:text-white">{businessProfile.phone}</p>
                            </div>
                         </div>
                      )}
                   </div>

                   {/* Social Links */}
                   <div className="pt-4 flex items-center gap-4">
                      {businessProfile?.whatsapp_number && (
                           <a href={`https://wa.me/${businessProfile.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:-translate-y-1 transition-transform shadow-md" title="WhatsApp">
                               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                           </a>
                      )}
                      {businessProfile?.instagram_url && (
                          <a href={businessProfile.instagram_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 flex items-center justify-center hover:-translate-y-1 hover:bg-pink-100 hover:text-pink-600 transition-all shadow-sm">
                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                          </a>
                      )}
                   </div>
                </div>
                
                {/* Final CTA Area */}
                <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl h-full min-h-[300px] border border-gray-100 dark:border-slate-800 p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-inner">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-accent mb-6 shadow-sm rotate-3 border border-gray-100 dark:border-slate-700">
                       <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{language === 'tr' ? 'Size uygun zamanı seçin' : 'Secure your appointment'}</h3>
                    <p className="text-gray-500 mb-8 max-w-xs">{language === 'tr' ? 'Randevunuzu birkaç adımda kolayca oluşturun.' : 'Book your appointment easily in a few steps.'}</p>
                    <button onClick={onStartBooking} className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg shadow-[0_8px_16px_-8px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 hover:shadow-lg hover:bg-blue-600 transition-all border border-blue-400 dark:border-blue-700">
                       {language === 'tr' ? 'Randevunuzu Oluşturun' : 'Start Booking'}
                    </button>
                </div>
             </div>
          </section>

      </div>

      {/* Sticky Mobile Bottom CTA Bar */}
      <div className="fixed sm:hidden bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-slate-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-slate-800 z-50 flex gap-3 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
          <button onClick={onStartBooking} className="flex-1 bg-accent text-white font-bold h-14 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-transform text-lg flex items-center justify-center">
             {language === 'tr' ? 'Randevu Al' : 'Book Now'}
          </button>
          <button onClick={() => window.location.href = `#/ai-visualizer?tenantId=${tenant?.id}`} className="w-14 h-14 shrink-0 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 font-bold rounded-2xl border border-violet-200 dark:border-violet-700 active:scale-95 transition-transform text-2xl flex items-center justify-center shadow-inner">
             🪄
          </button>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
         <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setLightboxImage(null)}>
            <div className="relative w-full max-w-5xl h-full flex items-center justify-center group/lightbox">
               <button className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 bg-black/40 hover:bg-black/80 rounded-full w-10 h-10 flex items-center justify-center transition-colors border border-white/10" onClick={() => setLightboxImage(null)} title="Kapat">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
               </button>
               
               {coverImages.length > 1 && (
                  <>
                     <button 
                         onClick={(e) => {
                             e.stopPropagation();
                             const idx = coverImages.indexOf(lightboxImage);
                             if (idx > -1) setLightboxImage(coverImages[idx === 0 ? coverImages.length - 1 : idx - 1]);
                         }} 
                         className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-50 bg-black/40 hover:bg-black/80 rounded-full w-12 h-12 flex items-center justify-center transition-colors border border-white/10" 
                         title="Önceki"
                     >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                     </button>
                     <button 
                         onClick={(e) => {
                             e.stopPropagation();
                             const idx = coverImages.indexOf(lightboxImage);
                             if (idx > -1) setLightboxImage(coverImages[(idx + 1) % coverImages.length]);
                         }} 
                         className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-50 bg-black/40 hover:bg-black/80 rounded-full w-12 h-12 flex items-center justify-center transition-colors border border-white/10" 
                         title="Sonraki"
                     >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                     </button>
                  </>
               )}

               <img src={lightboxImage} alt="Enlarged" className="max-w-full max-h-[90vh] object-contain mx-auto rounded-lg shadow-2xl transition-all" onClick={(e) => e.stopPropagation()} />
            </div>
         </div>
      )}
    </div>
  );
};

export default SalonWebsiteView;
