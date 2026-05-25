import React, { useState, useEffect, useCallback } from 'react';
import { SalonBusinessProfile, Staff, Service } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SalonWebsiteViewProps {
  tenant: any;
  businessProfile: SalonBusinessProfile | null;
  staffList: Staff[];
  servicesList: Service[];
  onStartBooking: () => void;
  onServiceSelect: (service: Service) => void;
  language: string;
}

const SalonWebsiteView: React.FC<SalonWebsiteViewProps> = ({
  tenant, businessProfile, staffList, servicesList, onStartBooking, onServiceSelect, language
}) => {
  const [currentCoverIndex, setCurrentCoverIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

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
    
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      handleNextCover();
    }, 5000);

    return () => clearInterval(interval);
  }, [coverImages.length, isPaused, lightboxImage, handleNextCover]);

  const directionsUrl = businessProfile?.address ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${businessProfile.address} ${businessProfile.district || ''} ${businessProfile.city || ''}`)}` : undefined;

  return (
    <div className="w-full max-w-6xl mx-auto bg-slate-50 dark:bg-slate-900 min-h-screen relative shadow-2xl xl:rounded-[2rem] overflow-hidden xl:border-4 border-gray-100 dark:border-slate-800 pb-20 sm:pb-8">
      
      {/* Top sticky header */}
      <div className="sticky top-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md z-40 border-b border-gray-100 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
         <div className="flex items-center gap-3">
            {businessProfile?.logo_url ? (
               <img src={businessProfile.logo_url} alt="Logo" className="w-10 h-10 rounded-lg object-cover shadow-sm bg-white border border-gray-100 dark:border-slate-700" />
            ) : (
               <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-lg shadow-sm">
                 {tenant?.name?.charAt(0) || 'S'}
               </div>
            )}
            <span className="font-bold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-md">{tenant?.name}</span>
         </div>
         <button onClick={onStartBooking} className="px-5 py-2 bg-accent text-white rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:bg-blue-600 transition">
            Randevu Al
         </button>
      </div>

      <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
        <div 
           className="relative h-[30vh] sm:h-[40vh] md:h-[50vh] w-full bg-gray-200 dark:bg-slate-700 group cursor-pointer focus:outline-none" 
           onClick={() => coverImages.length > 0 && setLightboxImage(coverImages[currentCoverIndex])}
           onMouseEnter={() => setIsPaused(true)}
           onMouseLeave={() => setIsPaused(false)}
           onFocus={() => setIsPaused(true)}
           onBlur={() => setIsPaused(false)}
           tabIndex={0}
           aria-label="Kapak fotoğrafı galerisi, otomatik geçiş"
        >
          {coverImages.length > 0 ? (
              <>
                 <img src={coverImages[currentCoverIndex]} alt="Cover" className="w-full h-full object-cover transition-opacity duration-700 ease-in-out" />
                 {coverImages.length > 1 && (
                   <>
                      <button onClick={handlePrevCover} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 border border-white/20 opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                      </button>
                      <button onClick={handleNextCover} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 border border-white/20 opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                         {coverImages.map((_, i) => (
                            <button 
                              key={i} 
                              onClick={(e) => { e.stopPropagation(); setCurrentCoverIndex(i); setIsPaused(true); }}
                              className={`rounded-full transition-all ${i === currentCoverIndex ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
                              aria-label={`Fotoğraf ${i + 1}`}
                            />
                         ))}
                      </div>
                   </>
                 )}
              </>
          ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                 Kapak Fotoğrafı Yok
              </div>
          )}
        </div>
        
        <div className="px-6 md:px-12 pb-8 text-center max-w-4xl mx-auto">
          {businessProfile?.logo_url ? (
            <img src={businessProfile.logo_url} alt="Profile" className="w-28 h-28 md:w-36 md:h-36 bg-white rounded-full border-4 border-white dark:border-slate-800 shadow-md mx-auto -mt-14 md:-mt-18 object-cover relative z-10" />
          ) : (
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white dark:border-slate-800 shadow-md mx-auto -mt-14 md:-mt-18 flex items-center justify-center text-white font-bold text-4xl md:text-5xl relative z-10 bg-accent">
              {tenant?.name?.charAt(0) || 'S'}
            </div>
          )}
          
          <h1 className="text-3xl md:text-4xl font-bold mt-5 text-gray-900 dark:text-white tracking-tight">{tenant?.name}</h1>
          {businessProfile?.short_description && (
              <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mt-2 font-medium max-w-2xl mx-auto leading-relaxed">{businessProfile.short_description}</p>
          )}
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
             <button onClick={onStartBooking} className="flex-1 sm:flex-none min-w-[160px] bg-accent text-white py-3 md:py-4 px-6 md:px-8 rounded-2xl font-bold md:text-lg shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:bg-blue-600 transition-all hidden sm:block">
                Hemen Randevu Al
             </button>
             {businessProfile?.whatsapp_number && (
                 <a href={`https://wa.me/${businessProfile.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none min-w-[160px] bg-[#25D366] text-white py-3 md:py-4 px-6 md:px-8 rounded-2xl font-bold md:text-lg shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                     <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                     WhatsApp
                 </a>
             )}
          </div>
        </div>
      </div>

      {/* Main Content Grid for Desktop */}
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 px-6 md:px-12 mt-8 md:mt-12">
        <div className="lg:col-span-8 space-y-12">
          {businessProfile?.description && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                {businessProfile.featured_message && <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{businessProfile.featured_message}</h3>}
                <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed text-sm md:text-base mb-4">
                   {businessProfile.description}
                </div>
                {businessProfile.about_text && (
                    <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed text-sm md:text-base pt-4 border-t border-gray-100 dark:border-slate-700">
                      {businessProfile.about_text}
                    </div>
                )}
              </div>
          )}

          {servicesList.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Ekibimiz ve Hizmetler</h3>
                 <span className="text-sm font-medium text-accent bg-blue-50 dark:bg-slate-800 px-3 py-1 rounded-full">{servicesList.length} Hizmet</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {servicesList.map((service) => (
                  <button
                      key={service.id}
                      onClick={() => onServiceSelect(service)}
                      className="group flex flex-col items-start bg-white dark:bg-slate-800 px-5 py-5 rounded-3xl border border-gray-100 dark:border-slate-700 hover:border-accent hover:shadow-lg transition-all text-left overflow-hidden min-h-[140px]"
                  >
                      <div className="flex w-full items-start justify-between mb-4">
                          <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl bg-gray-100 dark:bg-slate-700 overflow-hidden relative shadow-sm">
                              {service.image ? (
                                  <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                  </div>
                              )}
                          </div>
                          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-700/50 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-white transition-colors ml-4">
                               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                          </div>
                      </div>
                      <div className="w-full flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-accent transition-colors leading-tight mb-2">{language === 'tr' ? service.name_tr : service.name}</h4>
                          <div className="flex items-center justify-between mt-auto w-full pt-1">
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700/30 px-2 py-1 rounded-md">
                                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  {service.duration} dk
                              </div>
                              <div className="text-accent font-bold text-lg md:text-xl">
                                  {service.price} ₺
                              </div>
                          </div>
                      </div>
                  </button>
              ))}
              </div>
            </div>
          )}
          
          {staffList.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Uzmanlarımız</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                 {staffList.map((staff) => (
                    <div key={staff.id} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 text-center shadow-sm relative overflow-hidden flex flex-col items-center">
                        {staff.id === 'stf_1' && <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-yellow-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10 tracking-widest">MASTER</div>}
                        {staff.image || staff.avatar ? (
                           <img src={staff.image || staff.avatar} alt={staff.name} className="w-24 h-24 mx-auto rounded-full object-cover mb-4 shadow-sm border-4 border-gray-50 dark:border-slate-700" referrerPolicy="no-referrer" />
                        ) : (
                           <div className="w-24 h-24 mx-auto rounded-full bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-indigo-500 font-bold text-4xl mb-4 shadow-sm border-4 border-gray-50 dark:border-slate-700 relative z-10">
                              {staff.name.charAt(0)}
                           </div>
                        )}
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{staff.name}</h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{staff.roles?.join(', ') || staff.title}</p>
                    </div>
                 ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 mt-8 lg:mt-0">
           <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-700 lg:sticky lg:top-24">
              <div className="text-center mb-8">
                 <div className="w-14 h-14 bg-blue-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-accent mx-auto mb-4">
                     <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hemen Randevu Alın</h3>
                 <p className="text-sm text-gray-500">Size en uygun hizmeti profesyonel ekibimizden alın.</p>
              </div>
              <button onClick={onStartBooking} className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-blue-600 transition-all mb-8 hidden sm:block">
                 Randevu Başlat
              </button>

              <div className="space-y-6 pt-8 border-t border-gray-100 dark:border-slate-700">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider text-center">İletişim Bilgileri</h4>
                  
                  {businessProfile?.phone && (
                      <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-600">
                          <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-sm">
                              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          </div>
                          <div>
                              <p className="text-xs text-gray-500 mb-1">Telefon</p>
                              <p className="font-bold text-gray-900 dark:text-white">{businessProfile.phone}</p>
                          </div>
                      </div>
                  )}

                  {businessProfile?.address && (
                      <div className="flex items-start gap-4 bg-gray-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-600">
                          <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-sm">
                              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          </div>
                          <div>
                              <p className="text-xs text-gray-500 mb-1">Açık Adres</p>
                              <p className="font-medium text-sm text-gray-900 dark:text-white leading-snug">{businessProfile.address} {businessProfile.district} {businessProfile.city}</p>
                              {directionsUrl && (
                                 <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="text-accent text-sm font-bold hover:underline inline-flex items-center gap-1 mt-2">
                                     Haritada Aç
                                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                 </a>
                              )}
                          </div>
                      </div>
                  )}

                  {(businessProfile?.instagram_url || businessProfile?.facebook_url) && (
                      <div className="flex items-center justify-center gap-4 pt-4">
                         {businessProfile.instagram_url && (
                             <a href={businessProfile.instagram_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white dark:bg-slate-700 shadow-sm border border-gray-100 dark:border-slate-600 flex items-center justify-center text-gray-500 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50 transition-all">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                             </a>
                         )}
                         {businessProfile.facebook_url && (
                             <a href={businessProfile.facebook_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white dark:bg-slate-700 shadow-sm border border-gray-100 dark:border-slate-600 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                             </a>
                         )}
                      </div>
                  )}
              </div>
           </div>
        </div>
      </div>

      {lightboxImage && (
         <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setLightboxImage(null)}>
            <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
               <button className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 bg-black/40 hover:bg-black/80 rounded-full p-2 transition-colors" onClick={() => setLightboxImage(null)} title="Kapat">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
               </button>
               <img src={lightboxImage} alt="Enlarged" className="max-w-full max-h-[90vh] object-contain mx-auto rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
            </div>
         </div>
      )}
    </div>
  );
};

export default SalonWebsiteView;
